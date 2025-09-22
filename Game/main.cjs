#!/usr/bin/env node

// CommonJS entry point for pkg

// Simple embedded player setup for pkg compatibility
const fs = require('fs')
const path = require('path')
const { input, select, confirm } = require('@inquirer/prompts')

// For game actions, we'll still need readline for the main game loop
const { createInterface } = require('readline')

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
  console.log('🧙‍♂️ Let\'s start with your character\'s name...\n')

  // Get first name using inquirer input
  const firstName = await input({
    message: 'What is your first name?',
    validate: (input) => {
      if (!input || input.trim().length === 0) {
        return 'Please enter a valid first name.'
      }
      return true
    }
  })

  // Get last name using inquirer input
  const lastName = await input({
    message: 'What is your last name?',
    validate: (input) => {
      if (!input || input.trim().length === 0) {
        return 'Please enter a valid last name.'
      }
      return true
    }
  })

  playerCharacter.firstName = firstName.trim()
  playerCharacter.lastName = lastName.trim()
  console.log(`\n✨ Welcome, ${firstName} ${lastName}! Let's continue with your character creation.\n`)
  await promptPlayerRace()
}

// Step 2: Get player race
async function promptPlayerRace () {
  console.log('🧝‍♂️ Choose your race:')
  console.log('Each race has unique abilities and characteristics.\n')

  const availableRaces = Object.keys(characterData.races)

  // Create choices array for inquirer
  const raceChoices = availableRaces.map(race => {
    const raceData = characterData.races[race]
    let description = race.charAt(0).toUpperCase() + race.slice(1)

    // Add racial ability description if available
    if (raceData.racialAbilities) {
      const abilities = Object.values(raceData.racialAbilities)
      if (abilities.length > 0) {
        description += ` - ${abilities[0].description}`
      }
    }

    return {
      name: description,
      value: race
    }
  })

  const raceChoice = await select({
    message: 'Select your race:',
    choices: raceChoices
  })

  playerCharacter.race = raceChoice
  console.log(`\n✨ You have chosen to be a ${raceChoice.charAt(0).toUpperCase() + raceChoice.slice(1)}!\n`)
  await promptPlayerClass()
}

// Step 3: Get player class
async function promptPlayerClass () {
  console.log('⚔️ Choose your class:')
  console.log('Your class determines your abilities and fighting style.\n')

  // Get unique classes (remove duplicates)
  const availableClasses = [...new Set(characterData.classes)]

  // Create choices array with descriptions
  const classChoices = availableClasses.map(className => {
    let description
    switch (className.toLowerCase()) {
      case 'warrior':
        description = 'Warriors - Masters of combat and weapons, strong in battle'
        break
      case 'mage':
        description = 'Mages - Wielders of arcane magic and powerful spells'
        break
      case 'rogue':
        description = 'Rogues - Stealthy and agile, masters of stealth and precision'
        break
      case 'cleric':
        description = 'Clerics - Divine healers and supporters, blessed by the gods'
        break
      case 'paladin':
        description = 'Paladins - Holy warriors combining faith and martial prowess'
        break
      case 'ranger':
        description = 'Rangers - Nature guardians skilled in archery and survival'
        break
      case 'sorcerer':
        description = 'Sorcerers - Born with innate magical abilities and raw power'
        break
      case 'druid':
        description = 'Druids - Nature\'s champions with shapeshifting abilities'
        break
      case 'barbarian':
        description = 'Barbarians - Fierce warriors fueled by primal rage'
        break
      case 'monk':
        description = 'Monks - Disciplined fighters using inner spiritual power'
        break
      case 'bard':
        description = 'Bards - Charismatic performers weaving magic through music'
        break
      default:
        description = `${className.charAt(0).toUpperCase() + className.slice(1)} - A unique class with special abilities`
    }

    return {
      name: description,
      value: className
    }
  })

  const classChoice = await select({
    message: 'Select your class:',
    choices: classChoices
  })

  playerCharacter.class = classChoice
  console.log(`\n✨ You have chosen to be a ${classChoice.charAt(0).toUpperCase() + classChoice.slice(1)}!\n`)
  await promptPlayerGender()
}

// Step 4: Get player gender
async function promptPlayerGender () {
  console.log('👤 Choose your gender:')

  const availableGenders = characterData.genders || ['male', 'female', 'non-binary']

  const genderChoices = availableGenders.map(gender => ({
    name: gender.charAt(0).toUpperCase() + gender.slice(1),
    value: gender
  }))

  const genderChoice = await select({
    message: 'Select your gender:',
    choices: genderChoices
  })

  playerCharacter.gender = genderChoice
  console.log(`\n✨ Gender set to ${genderChoice}!\n`)
  await promptPlayerAge()
}

// Step 5: Get player age
async function promptPlayerAge () {
  console.log('🕐 Choose your age category:')

  // Get age categories from characterData.ages object or use fallback array
  const ageCategories = characterData.ages
    ? Object.keys(characterData.ages)
    : ['young', 'adult', 'middle-aged', 'elderly']

  const ageChoices = ageCategories.map(age => {
    const ageData = characterData.ages?.[age]
    const displayText = ageData?.display || age

    return {
      name: `${age.charAt(0).toUpperCase() + age.slice(1)} - ${displayText}`,
      value: age
    }
  })

  const ageChoice = await select({
    message: 'Select your age category:',
    choices: ageChoices
  })

  playerCharacter.age = ageChoice
  console.log(`\n✨ Age category set to ${ageChoice}!\n`)
  await promptPlayerHeight()
}

// Step 6: Get player height
async function promptPlayerHeight () {
  console.log('📏 Choose your height:')

  // Get height categories from characterData.heights object or use fallback array
  const heightCategories = characterData.heights
    ? Object.keys(characterData.heights)
    : ['short', 'average', 'tall']

  const heightChoices = heightCategories.map(height => {
    const heightData = characterData.heights?.[height]
    const displayText = heightData?.display || height

    return {
      name: `${height.charAt(0).toUpperCase() + height.slice(1)} - ${displayText}`,
      value: height
    }
  })

  const heightChoice = await select({
    message: 'Select your height:',
    choices: heightChoices
  })

  playerCharacter.height = heightChoice
  console.log(`\n✨ Height set to ${heightChoice}!\n`)
  await promptPlayerWeight()
}

// Step 7: Get player weight
async function promptPlayerWeight () {
  console.log('⚖️ Choose your build/weight:')

  const availableWeights = characterData.weights || ['light', 'average', 'heavy']

  const weightChoices = availableWeights.map(weight => ({
    name: weight.charAt(0).toUpperCase() + weight.slice(1),
    value: weight
  }))

  const weightChoice = await select({
    message: 'Select your build:',
    choices: weightChoices
  })

  playerCharacter.weight = weightChoice
  console.log(`\n✨ Build set to ${weightChoice}!\n`)
  await showCharacterSummary()
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

  const confirmCharacter = await confirm({
    message: 'Do you want to confirm this character?',
    default: true
  })

  if (confirmCharacter) {
    completeCharacterCreation()
  } else {
    console.log('\n🔄 Let\'s start over with character creation...\n')
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

// NPCs with dialogue system
const npcs = {
  old_man_gideon: {
    name: 'Gideon',
    description: '👴 A weathered old man with a long white beard sits on a tree stump, whittling a piece of wood.',
    dialogue: [
      "Well, hello there, traveler. It's not often I see a new face in these woods...",
      "Be careful if you're heading north. There's a dark cave up that way. I'd recommend getting a torch if you plan to explore it...",
      "The village to the east is usually welcoming, but they've been on edge lately...",
      'Of course, I would be on edge as well, what with the strange things that Father Andrew has been talking about lately...',
      'let me see if I can remember exactly what he said...',
      'He mentioned something about a person from another world coming here...',
      '... what?',
      '... I don\'t suppose that person is you, is it?',
      'In that case, welcome to Aethel! You should find the village to the east. Father Andrew will want to speak with you...'
    ],
    dialogueIndex: 0
  },
  elara_the_shopkeeper: {
    name: 'Elara',
    description: '👩‍💼 A cheerful woman with a bright smile stands behind the counter. She seems to be a shopkeeper.',
    dialogue: [
      'Welcome to my shop! What can I get for you today?',
      "I've got a fresh stock of torches, perfect for exploring dark places. Just say 'buy torch'."
    ],
    dialogueIndex: 0
  },
  innkeeper_thomas: {
    name: 'Thomas',
    description: '🧔 A stout, friendly man with rosy cheeks wipes down mugs behind the bar.',
    dialogue: [
      'Welcome to The Prancing Pony! Best ale and rooms in the village!',
      "Need a place to rest? A room's just 10 gold for the night.",
      "Heard there's been strange activity in the old mine lately..."
    ],
    dialogueIndex: 0
  },
  temple_priest: {
    name: 'Father Andrew',
    description: '⛪ A serene man in white priest robes tends to the altar with gentle care.',
    dialogue: [
      'Welcome `playerCharacter.name`, I have been expecting you...',
      'The Gods have spoken of your coming. You are the one from another world, correct?',
      'You must be cautious. Dark forces are stirring in Aethel, and your arrival may tip the balance...',
      'I can offer guidance, but you must be prepared to face the challenges ahead...',
      'Seek out the ancient ruins to the north. They hold secrets that may aid you on your journey...',
      'And remember, you are not alone in this fight. Allies will come from unexpected places...',
      'Trust in your instincts, and do not hesitate to seek help when you need it.'
    ],
    dialogueIndex: 0
  },
  bartender_rick: {
    name: 'Rick',
    description: '🍺 A burly man with muscular arms serves drinks with practiced efficiency.',
    dialogue: [
      'What\'ll it be, stranger? We\'ve got ale, wine, and rumors.',
      'Heard you\'re new in town. Word of advice: stay out of the dungeon south of the forest.',
      'That old man Gideon knows more than he lets on. Been living in those woods for decades.'
    ],
    dialogueIndex: 0
  }
}

// Save and Load System
function saveGame () {
  try {
    // Create save data object
    const saveData = {
      playerCharacter: { ...playerCharacter },
      gameState: { ...gameState },
      npcDialogueIndexes: {}
    }

    // Save NPC dialogue indexes
    Object.keys(npcs).forEach(npcId => {
      saveData.npcDialogueIndexes[npcId] = npcs[npcId].dialogueIndex
    })

    // Create saves directory if it doesn't exist
    const savesDir = path.join(__dirname, 'saves')
    if (!fs.existsSync(savesDir)) {
      fs.mkdirSync(savesDir)
    }

    // Save to file
    const saveFile = path.join(savesDir, 'savegame.json')
    fs.writeFileSync(saveFile, JSON.stringify(saveData, null, 2))

    console.log('\n💾 Game saved successfully!')
    return true
  } catch (error) {
    console.log('\n❌ Error saving game:', error.message)
    return false
  }
}

function loadGame () {
  try {
    const saveFile = path.join(__dirname, 'saves', 'savegame.json')

    if (!fs.existsSync(saveFile)) {
      console.log('\n❌ No save file found!')
      return false
    }

    // Read save data
    const saveData = JSON.parse(fs.readFileSync(saveFile, 'utf8'))

    // Restore player character
    Object.assign(playerCharacter, saveData.playerCharacter)

    // Restore game state
    Object.assign(gameState, saveData.gameState)

    // Restore NPC dialogue indexes
    if (saveData.npcDialogueIndexes) {
      Object.keys(saveData.npcDialogueIndexes).forEach(npcId => {
        if (npcs[npcId]) {
          npcs[npcId].dialogueIndex = saveData.npcDialogueIndexes[npcId]
        }
      })
    }

    console.log('\n💾 Game loaded successfully!')
    console.log(`Welcome back, ${playerCharacter.firstName} ${playerCharacter.lastName}!`)
    return true
  } catch (error) {
    console.log('\n❌ Error loading game:', error.message)
    return false
  }
}

// Simple locations (based on game.js structure but with emojis)
const locations = {
  forest: {
    description: "🌲 You are in a dense forest. You can go 'north', 'east', 'west', or 'south'.",
    npcs: ['old_man_gideon'],
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
    npcs: ['elara_the_shopkeeper'],
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
    npcs: ['innkeeper_thomas'],
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
    npcs: ['temple_priest'],
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
    npcs: ['bartender_rick'],
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
        return '🕳️ You are in a dark cave. Your torch illuminates the rocky walls. You can proceed deeper or go back.'
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

  // Display NPCs in the location
  if (currentLocation.npcs && currentLocation.npcs.length > 0) {
    console.log('\nAlso here:')
    currentLocation.npcs.forEach((npcId) => {
      const npc = npcs[npcId]
      if (npc) {
        console.log(`- ${npc.description}`)
      }
    })
    console.log("You can 'talk to <name>' to interact with them.")
  }

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
  console.log('- save')
  console.log('- load')
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

    case 'save':
      console.log('\n💾 Saving your game...')
      saveGame()
      break

    case 'load':
      console.log('\n💾 Loading your game...')
      if (loadGame()) {
        // Game loaded successfully, restart the main game loop
        console.log('\n🎮 Resuming your adventure...')
      }
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
      console.log('- Use "talk to <name>" to interact with NPCs')
      console.log('- Use "save" to save your game progress')
      console.log('- Use "load" to load your saved game')
      console.log('- Use "quit" or "exit" to end the game')
      break

    default:
      // Check for interaction actions like "talk to <npc>"
      if (action.startsWith('talk to ')) {
        const npcName = action.substring(8).toLowerCase() // Get the name after "talk to "

        // First try exact name match
        let npcId = currentLocation.npcs?.find(
          (id) => npcs[id].name.toLowerCase() === npcName
        )

        // If no exact match, try partial match in description
        if (!npcId && currentLocation.npcs) {
          npcId = currentLocation.npcs.find((id) => {
            const npc = npcs[id]
            return npc.description.toLowerCase().includes(npcName) ||
                   npc.name.toLowerCase().includes(npcName)
          })
        }

        if (npcId) {
          const npc = npcs[npcId]
          // Display dialogue and cycle to the next line
          console.log(
            `\n[${npc.name}]: "${npc.dialogue[npc.dialogueIndex]}"`
          )
          npc.dialogueIndex = (npc.dialogueIndex + 1) % npc.dialogue.length
        } else {
          console.log(`\n❓ There is no one here by the name of '${npcName}'.`)
        }
        break
      }

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

    // Check if a save file exists
    const saveFile = path.join(__dirname, 'saves', 'savegame.json')
    if (fs.existsSync(saveFile)) {
      console.log('💾 Save file detected!')

      const choice = await select({
        message: 'What would you like to do?',
        choices: [
          {
            name: '📁 Load your saved game',
            value: 'load'
          },
          {
            name: '🆕 Start a new game',
            value: 'new'
          }
        ]
      })

      if (choice === 'load') {
        if (loadGame()) {
          console.log('\n🎮 Resuming your adventure...')
          startMainGame()
          return
        } else {
          console.log('\n❌ Failed to load save file. Starting new game...\n')
        }
      }
    }

    // Start new game
    await promptPlayerInfo()
  } catch (error) {
    console.error('Error starting game:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Start the game
startGame()
