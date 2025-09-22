#!/usr/bin/env node

// CommonJS entry point for pkg

// Simple embedded player setup for pkg compatibility
const { createInterface } = require('readline')
const fs = require('fs')
const path = require('path')

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

// Player character object
const playerCharacter = {
  firstName: '',
  lastName: '',
  race: '',
  class: '',
  gender: '',
  age: '',
  height: '',
  weight: ''
}

// Load character data
let characterData = {}
try {
  const dataPath = path.join(__dirname, 'data', 'characterData.json')
  const rawData = fs.readFileSync(dataPath, 'utf8')
  characterData = JSON.parse(rawData)
} catch (error) {
  console.error('Error loading character data:', error.message)
  characterData = {
    races: { human: {}, elf: {}, beastkin: {} },
    classes: ['warrior', 'mage', 'rogue', 'cleric', 'paladin', 'ranger', 'sorcerer', 'druid', 'barbarian', 'monk', 'bard'],
    genders: ['male', 'female', 'non-binary'],
    ages: ['young', 'adult', 'middle-aged', 'elderly'],
    heights: ['short', 'average', 'tall'],
    weights: ['light', 'average', 'heavy']
  }
}

// Helper function to ask questions
function askQuestion (question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

// Main function to start player setup
async function promptPlayerInfo () {
  console.log('\n' + '='.repeat(50))
  console.log('🌟 Welcome to the Character Creation! 🌟')
  console.log('='.repeat(50))
  console.log('You have been summoned to the fantasy world of Aethel!')
  console.log('Let\'s create your character for this new adventure...\n')

  await promptPlayerName()
}

// Step 1: Get player name
async function promptPlayerName () {
  let firstName = ''
  let lastName = ''

  // Get first name
  while (!firstName) {
    firstName = await askQuestion('What is your first name? ')
    if (!firstName) {
      console.log('Please enter a valid first name.')
    }
  }

  // Get last name
  while (!lastName) {
    lastName = await askQuestion('What is your last name? ')
    if (!lastName) {
      console.log('Please enter a valid last name.')
    }
  }

  playerCharacter.firstName = firstName
  playerCharacter.lastName = lastName
  console.log(`Welcome, ${firstName} ${lastName}! Let's continue with your character creation.\n`)
  await promptPlayerRace()
}

// Step 2: Get player race
async function promptPlayerRace () {
  console.log('�️ Choose your race:')
  console.log('Each race has unique abilities and characteristics.\n')
  const availableRaces = Object.keys(characterData.races)

  // Display race options with descriptions
  availableRaces.forEach((race, index) => {
    console.log(`${index + 1}. ${race.charAt(0).toUpperCase() + race.slice(1)}`)

    // Get racial abilities for description
    const raceData = characterData.races[race]
    if (raceData.racialAbilities) {
      const abilities = Object.values(raceData.racialAbilities)
      if (abilities.length > 0) {
        console.log(`   - ${abilities[0].description}`)
      }
    }
    console.log('')
  })

  let raceChoice = ''
  while (!raceChoice) {
    const input = await askQuestion('Enter the number of your chosen race: ')
    const choice = parseInt(input) - 1

    if (choice >= 0 && choice < availableRaces.length) {
      raceChoice = availableRaces[choice]
      playerCharacter.race = raceChoice
      console.log(`You have chosen to be a ${raceChoice.charAt(0).toUpperCase() + raceChoice.slice(1)}!\n`)
      await promptPlayerClass()
    } else {
      console.log('Invalid choice. Please enter a valid number.')
    }
  }
}

// Step 3: Get player class
async function promptPlayerClass () {
  console.log('⚔️ Choose your class:')
  console.log('Your class determines your abilities and fighting style.\n')

  // Get unique classes (remove duplicates)
  const availableClasses = [...new Set(characterData.classes)]

  // Display class options
  availableClasses.forEach((className, index) => {
    console.log(`${index + 1}. ${className.charAt(0).toUpperCase() + className.slice(1)}`)

    // Add class descriptions
    switch (className.toLowerCase()) {
      case 'warrior':
        console.log('   - Masters of combat and weapons, strong in battle')
        break
      case 'mage':
        console.log('   - Wielders of arcane magic and powerful spells')
        break
      case 'rogue':
        console.log('   - Stealthy and agile, masters of stealth and precision')
        break
      case 'cleric':
        console.log('   - Divine healers and supporters, blessed by the gods')
        break
      case 'paladin':
        console.log('   - Holy warriors combining faith and martial prowess')
        break
      case 'ranger':
        console.log('   - Nature guardians skilled in archery and survival')
        break
      case 'sorcerer':
        console.log('   - Born with innate magical abilities and raw power')
        break
      case 'druid':
        console.log('   - Nature\'s champions with shapeshifting abilities')
        break
      case 'barbarian':
        console.log('   - Fierce warriors fueled by primal rage')
        break
      case 'monk':
        console.log('   - Disciplined fighters using inner spiritual power')
        break
      case 'bard':
        console.log('   - Charismatic performers weaving magic through music')
        break
      default:
        console.log('   - A unique class with special abilities')
    }
    console.log('')
  })

  let classChoice = ''
  while (!classChoice) {
    const input = await askQuestion('Enter the number of your chosen class: ')
    const choice = parseInt(input) - 1

    if (choice >= 0 && choice < availableClasses.length) {
      classChoice = availableClasses[choice]
      playerCharacter.class = classChoice
      console.log(`You have chosen to be a ${classChoice.charAt(0).toUpperCase() + classChoice.slice(1)}!\n`)
      await promptPlayerGender()
    } else {
      console.log('Invalid choice. Please enter a valid number.')
    }
  }
}

// Step 4: Get player gender
async function promptPlayerGender () {
  console.log('👤 Choose your gender:')

  const availableGenders = characterData.genders || ['male', 'female', 'non-binary']

  availableGenders.forEach((gender, index) => {
    console.log(`${index + 1}. ${gender.charAt(0).toUpperCase() + gender.slice(1)}`)
  })
  console.log('')

  let genderChoice = ''
  while (!genderChoice) {
    const input = await askQuestion('Enter the number of your chosen gender: ')
    const choice = parseInt(input) - 1

    if (choice >= 0 && choice < availableGenders.length) {
      genderChoice = availableGenders[choice]
      playerCharacter.gender = genderChoice
      console.log(`Gender set to ${genderChoice}!\n`)
      await promptPlayerAge()
    } else {
      console.log('Invalid choice. Please enter a valid number.')
    }
  }
}

// Step 5: Get player age
async function promptPlayerAge () {
  console.log('🕐 Choose your age category:')

  // Get age categories from characterData.ages object or use fallback array
  const ageCategories = characterData.ages
    ? Object.keys(characterData.ages)
    : ['young', 'adult', 'middle-aged', 'elderly']

  ageCategories.forEach((age, index) => {
    const ageData = characterData.ages?.[age]
    const displayText = ageData?.display || age

    console.log(`${index + 1}. ${age.charAt(0).toUpperCase() + age.slice(1)}`)
    console.log(`   - ${displayText}`)
  })
  console.log('')

  let ageChoice = ''
  while (!ageChoice) {
    const input = await askQuestion('Enter the number of your chosen age category: ')
    const choice = parseInt(input) - 1

    if (choice >= 0 && choice < ageCategories.length) {
      ageChoice = ageCategories[choice]
      playerCharacter.age = ageChoice
      console.log(`Age category set to ${ageChoice}!\n`)
      await promptPlayerHeight()
    } else {
      console.log('Invalid choice. Please enter a valid number.')
    }
  }
}

// Step 6: Get player height
async function promptPlayerHeight () {
  console.log('📏 Choose your height:')

  // Get height categories from characterData.heights object or use fallback array
  const heightCategories = characterData.heights
    ? Object.keys(characterData.heights)
    : ['short', 'average', 'tall']

  heightCategories.forEach((height, index) => {
    const heightData = characterData.heights?.[height]
    const displayText = heightData?.display || height

    console.log(`${index + 1}. ${height.charAt(0).toUpperCase() + height.slice(1)}`)
    console.log(`   - ${displayText}`)
  })
  console.log('')

  let heightChoice = ''
  while (!heightChoice) {
    const input = await askQuestion('Enter the number of your chosen height: ')
    const choice = parseInt(input) - 1

    if (choice >= 0 && choice < heightCategories.length) {
      heightChoice = heightCategories[choice]
      playerCharacter.height = heightChoice
      console.log(`Height set to ${heightChoice}!\n`)
      await promptPlayerWeight()
    } else {
      console.log('Invalid choice. Please enter a valid number.')
    }
  }
}

// Step 7: Get player weight
async function promptPlayerWeight () {
  console.log('⚖️ Choose your build/weight:')

  const availableWeights = characterData.weights || ['light', 'average', 'heavy']

  availableWeights.forEach((weight, index) => {
    console.log(`${index + 1}. ${weight.charAt(0).toUpperCase() + weight.slice(1)}`)
  })
  console.log('')

  let weightChoice = ''
  while (!weightChoice) {
    const input = await askQuestion('Enter the number of your chosen build: ')
    const choice = parseInt(input) - 1

    if (choice >= 0 && choice < availableWeights.length) {
      weightChoice = availableWeights[choice]
      playerCharacter.weight = weightChoice
      console.log(`Build set to ${weightChoice}!\n`)
      await showCharacterSummary()
    } else {
      console.log('Invalid choice. Please enter a valid number.')
    }
  }
}

// Step 8: Show character summary and confirm
async function showCharacterSummary () {
  console.log('\n' + '='.repeat(50))
  console.log('📋 CHARACTER SUMMARY')
  console.log('='.repeat(50))
  console.log(`Name: ${playerCharacter.firstName} ${playerCharacter.lastName}`)
  console.log(`Race: ${playerCharacter.race.charAt(0).toUpperCase() + playerCharacter.race.slice(1)}`)
  console.log(`Class: ${playerCharacter.class.charAt(0).toUpperCase() + playerCharacter.class.slice(1)}`)
  console.log(`Gender: ${playerCharacter.gender.charAt(0).toUpperCase() + playerCharacter.gender.slice(1)}`)
  console.log(`Age: ${playerCharacter.age.charAt(0).toUpperCase() + playerCharacter.age.slice(1)}`)
  console.log(`Height: ${playerCharacter.height.charAt(0).toUpperCase() + playerCharacter.height.slice(1)}`)
  console.log(`Build: ${playerCharacter.weight.charAt(0).toUpperCase() + playerCharacter.weight.slice(1)}`)
  console.log('='.repeat(50))

  // Show racial abilities if available
  const raceData = characterData.races[playerCharacter.race]
  if (raceData && raceData.racialAbilities) {
    console.log('\n🌟 RACIAL ABILITIES:')
    Object.values(raceData.racialAbilities).forEach(ability => {
      console.log(`• ${ability.name}: ${ability.description}`)
    })
  }

  console.log('\n✨ Your character is ready to begin their adventure in Aethel!')

  const confirm = await askQuestion('\nDo you want to confirm this character? (yes/no): ')

  if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
    completeCharacterCreation()
  } else {
    console.log('\nLet\'s start over with character creation...\n')
    await promptPlayerName()
  }
}

// Step 9: Complete character creation and update game
function completeCharacterCreation () {
  console.log('\n🎉 Character creation complete!')
  console.log(`Welcome to Aethel, ${playerCharacter.firstName} ${playerCharacter.lastName} the ${playerCharacter.race} ${playerCharacter.class}!`)
  console.log('\nYour adventure begins now...\n')

  console.log('🌍 Loading the world of Aethel...')

  // Start the main game loop immediately
  startMainGame()
}

// Basic game variables
const gameState = {
  location: 'forest',
  isRunning: true,
  inventory: ['basic_clothing', 'gold_pouch']
}

// Simple locations (based on game.js structure but with emojis)
const locations = {
  forest: {
    description: "🌲 You are in a dense forest. You can go 'north', 'east', 'west', or 'south'.",
    actions: {
      north: () => {
        gameState.location = 'cave'
        console.log('\n🕳️ You venture north and discover a dark cave entrance...')
      },
      south: () => {
        gameState.location = 'dungeon'
        console.log('\n� You wander deeper into the forest and find a dungeon, its entrance half-buried in tree roots.')
      },
      east: () => {
        gameState.location = 'village entrance'
        console.log('\n🏘️ You have discovered a village.')
      },
      west: () => {
        gameState.location = 'roads'
        console.log('\n🛤️ You go west and find a dusty road.')
      }
    },
    availableActions: ['north', 'south', 'east', 'west', 'inventory', 'stats', 'help', 'quit']
  },
  'village entrance': {
    description: "🏘️ You have discovered a village. You can 'explore' or go 'back' to the forest.",
    actions: {
      explore: () => {
        gameState.location = 'inside village'
        console.log('\n🚶 You decide to explore the village.')
      },
      back: () => {
        gameState.location = 'forest'
        console.log('\n🌲 You return to the forest.')
      }
    },
    availableActions: ['explore', 'back', 'inventory', 'stats', 'help', 'quit']
  },
  'inside village': {
    description: "🏘️ You are inside the village. Where do you go? There's the 'market', 'shop', 'inn', 'temple', 'stables', 'bar', or 'adventurers guild'. You can also go 'back' to the village entrance.",
    actions: {
      market: () => {
        gameState.location = 'market'
        console.log('\n🏪 You head to the bustling market.')
      },
      shop: () => {
        gameState.location = 'shop'
        console.log('\n🏪 You visit the general shop.')
      },
      inn: () => {
        gameState.location = 'inn'
        console.log('\n🏨 You enter the cozy inn.')
      },
      temple: () => {
        gameState.location = 'temple'
        console.log('\n⛪ You visit the serene temple.')
      },
      stables: () => {
        gameState.location = 'stables'
        console.log('\n🐎 You go to the stables.')
      },
      bar: () => {
        gameState.location = 'bar'
        console.log('\n🍺 You enter the noisy bar.')
      },
      'adventurers guild': () => {
        gameState.location = 'adventurers guild'
        console.log('\n⚔️ You visit the adventurers guild.')
      },
      back: () => {
        gameState.location = 'village entrance'
        console.log('\n🚶 You walk back to the village entrance.')
      }
    },
    availableActions: ['market', 'shop', 'inn', 'temple', 'stables', 'bar', 'adventurers guild', 'back', 'inventory', 'stats', 'help', 'quit']
  },
  market: {
    description: '� You are at the bustling market. You can go back to the village.',
    actions: {
      back: () => {
        gameState.location = 'inside village'
        console.log('\n🏘️ You return to the village center.')
      }
    },
    availableActions: ['back', 'inventory', 'stats', 'help', 'quit']
  },
  shop: {
    description: '🏪 You are at the general shop. The merchant has basic supplies. You can go back to the village.',
    actions: {
      back: () => {
        gameState.location = 'inside village'
        console.log('\n🏘️ You return to the village center.')
      }
    },
    availableActions: ['back', 'inventory', 'stats', 'help', 'quit']
  },
  inn: {
    description: '🏨 You are at the cozy inn. You can go back to the village.',
    actions: {
      back: () => {
        gameState.location = 'inside village'
        console.log('\n🏘️ You return to the village center.')
      },
      sleep: () => {
        console.log('\n� You sleep soundly until morning.')
        console.log('💤 You feel refreshed!')
      }
    },
    availableActions: ['back', 'sleep', 'inventory', 'stats', 'help', 'quit']
  },
  temple: {
    description: '⛪ You are at the serene temple. You can go back to the village.',
    actions: {
      back: () => {
        gameState.location = 'inside village'
        console.log('\n🏘️ You return to the village center.')
      }
    },
    availableActions: ['back', 'inventory', 'stats', 'help', 'quit']
  },
  stables: {
    description: '🐎 You are at the stables. You can go back to the village.',
    actions: {
      back: () => {
        gameState.location = 'inside village'
        console.log('\n🏘️ You return to the village center.')
      }
    },
    availableActions: ['back', 'inventory', 'stats', 'help', 'quit']
  },
  bar: {
    description: '🍺 You are at the noisy bar. You can go back to the village.',
    actions: {
      back: () => {
        gameState.location = 'inside village'
        console.log('\n�️ You return to the village center.')
      }
    },
    availableActions: ['back', 'inventory', 'stats', 'help', 'quit']
  },
  'adventurers guild': {
    description: '⚔️ You are at the adventurers guild. You can go back to the village.',
    actions: {
      back: () => {
        gameState.location = 'inside village'
        console.log('\n🏘️ You return to the village center.')
      }
    },
    availableActions: ['back', 'inventory', 'stats', 'help', 'quit']
  },
  cave: {
    description: () => {
      if (!gameState.inventory.includes('torch')) {
        return "🕳️ You are in a dark cave. It's too dark to see much. You need a light source to explore further."
      } else {
        return "🕳️ You are in a dark cave. Your torch illuminates the rocky walls. You can proceed deeper or go back."
      }
    },
    actions: {
      back: () => {
        gameState.location = 'forest'
        console.log('\n🌲 You return to the forest.')
      },
      proceed: () => {
        if (gameState.inventory.includes('torch')) {
          gameState.location = 'old abandoned mine'
          console.log('\n⛏️ You explore further and discover an old abandoned mine!')
        } else {
          console.log('\n❌ It\'s too dark to proceed without a light source.')
        }
      }
    },
    availableActions: ['back', 'proceed', 'inventory', 'stats', 'help', 'quit']
  },
  'old abandoned mine': {
    description: '⛏️ You are in an old abandoned mine with rusty equipment scattered about. Mysterious echoes come from deeper within.',
    actions: {
      back: () => {
        gameState.location = 'cave'
        console.log('\n🕳️ You return to the cave entrance.')
      },
      explore: () => {
        console.log('\n💎 You search the mine and find some old mining equipment!')
        console.log('You found: Old Pickaxe (added to inventory)')
        if (!gameState.inventory.includes('pickaxe')) {
          gameState.inventory.push('pickaxe')
        }
      }
    },
    availableActions: ['back', 'explore', 'inventory', 'stats', 'help', 'quit']
  },
  dungeon: {
    description: '🏰 You are at the entrance of a dark dungeon. Dark energy emanates from within.',
    actions: {
      enter: () => {
        console.log('\n⚔️ You step into the dungeon and encounter a goblin!')
        console.log('Combat system not yet implemented - you retreat safely.')
      },
      back: () => {
        gameState.location = 'forest'
        console.log('\n🌲 You return to the forest, deciding the dungeon can wait.')
      }
    },
    availableActions: ['enter', 'back', 'inventory', 'stats', 'help', 'quit']
  },
  roads: {
    description: '🛤️ You are on a dusty road. You can go back to the forest.',
    actions: {
      back: () => {
        gameState.location = 'forest'
        console.log('\n🌲 You return to the forest.')
      }
    },
    availableActions: ['back', 'inventory', 'stats', 'help', 'quit']
  }
}

// Main game loop (updated to match game.js structure)
function startMainGame () {
  console.log('\n[DEBUG] startMainGame called')

  if (!gameState.isRunning) {
    console.log('[DEBUG] Game is not running, exiting')
    return
  }

  const currentLocation = locations[gameState.location]
  
  // Handle description (can be string or function)
  const description = typeof currentLocation.description === 'function'
    ? currentLocation.description()
    : currentLocation.description

  console.log(`\n=== ${gameState.location.charAt(0).toUpperCase() + gameState.location.slice(1).replace('_', ' ')} ===`)
  console.log(description)
  
  // Show available location actions
  const locationActions = Object.keys(currentLocation.actions || {})
  if (locationActions.length > 0) {
    console.log('\nAvailable actions:')
    locationActions.forEach(action => {
      console.log(`- ${action}`)
    })
  }
  
  // Show standard actions
  console.log('\nOther commands:')
  console.log('- inventory')
  console.log('- stats')
  console.log('- help')
  console.log('- quit')

  // Ensure readline interface is ready
  if (!rl || rl.closed) {
    console.log('\nError: Input interface is not available.')
    return
  }

  console.log('[DEBUG] About to ask for input...')
  rl.question('\nWhat would you like to do? ', (answer) => {
    console.log(`[DEBUG] Received input: "${answer}"`)
    if (answer && answer.trim()) {
      handleAction(answer.toLowerCase().trim())
    } else {
      // If empty input, just show the menu again
      startMainGame()
    }
  })
}

// Handle player actions
function handleAction (action) {
  if (!action || action.trim() === '') {
    console.log('\nPlease enter a valid action.')
    if (gameState.isRunning) {
      startMainGame()
    }
    return
  }

  const currentLocation = locations[gameState.location]

  // Handle global actions first (inventory, stats, help, quit)
  switch (action) {
    case 'inventory':
      console.log('\n� Your inventory:')
      if (gameState.inventory.length === 0) {
        console.log('- Empty')
      } else {
        gameState.inventory.forEach(item => {
          const displayName = item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
          console.log(`- ${displayName}`)
        })
      }
      break

    case 'stats':
      console.log('\n📊 Character Stats:')
      console.log(`Name: ${playerCharacter.firstName} ${playerCharacter.lastName}`)
      console.log(`Race: ${playerCharacter.race}`)
      console.log(`Class: ${playerCharacter.class}`)
      console.log(`Gender: ${playerCharacter.gender}`)
      console.log(`Age: ${playerCharacter.age}`)
      console.log(`Height: ${playerCharacter.height}`)
      console.log(`Weight: ${playerCharacter.weight}`)
      console.log(`Location: ${gameState.location.replace('_', ' ')}`)
      break

    case 'quit':
    case 'exit':
      console.log('\n👋 Thank you for playing the Text-Based Isekai Game!')
      console.log('Your adventure will continue another time...')
      gameState.isRunning = false
      rl.close()
      return

    case 'help':
      console.log('\n📖 Available commands:')
      console.log('- Type any of the available actions listed above')
      console.log('- Use "stats" to view your character information')
      console.log('- Use "inventory" to check your items')
      console.log('- Use "quit" or "exit" to end the game')
      break

    default:
      // Check if it's a location-specific action
      if (currentLocation.actions && currentLocation.actions[action]) {
        // Execute the location-specific action
        currentLocation.actions[action]()
      } else {
        console.log(`\n❓ Unknown action: "${action}"`)
        console.log('Try one of the available actions listed above, or type "help" for more information.')
      }
      break
  }

  // Continue the game loop if still running
  if (gameState.isRunning) {
    startMainGame()
  }
}

// Start the game
async function startGame () {
  try {
    console.log('🌟 Starting Text-Based Isekai Game... 🌟\n')
    await promptPlayerInfo()
  } catch (error) {
    console.error('Error starting game:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Start the game
startGame()
