// playerSetup.js - Character creation and setup functionality
import { createInterface } from 'readline'
import fs from 'fs'
import path from 'path'

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

// Load character data
let characterData = {}
try {
  const dataPath = path.join(process.cwd(), 'data', 'characterData.json')
  const rawData = fs.readFileSync(dataPath, 'utf8')
  characterData = JSON.parse(rawData)
} catch (error) {
  console.error('Error loading character data:', error.message)
  characterData = {
    races: { human: {}, elf: {}, beastkin: {} },
    classes: ['warrior', 'mage', 'rogue', 'cleric'],
    genders: ['male', 'female', 'non-binary'],
    ages: ['young', 'adult', 'middle-aged', 'elderly'],
    heights: ['short', 'average', 'tall'],
    weights: ['light', 'average', 'heavy']
  }
}

// Player character object
const playerCharacter = {
  name: '',
  firstName: '',
  lastName: '',
  race: '',
  class: '',
  gender: '',
  age: '',
  height: '',
  weight: ''
}

// Main function to start player setup
export function promptPlayerInfo () {
  console.log('\n' + '='.repeat(50))
  console.log('🌟 Welcome to the Character Creation! 🌟')
  console.log('='.repeat(50))
  console.log('You have been summoned to the fantasy world of Aethel!')
  console.log('Let\'s create your character for this new adventure...\n')

  promptPlayerName()
}

// Helper function to ask questions
function askQuestion (question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

// Step 1: Get player name
async function promptPlayerName () {
  let firstName = ''
  let lastName = ''
  while (!firstName) {
    firstName = await askQuestion('What is your first name? ')
    if (!firstName) {
      console.log('Please enter a valid first name.')
    }
  }
  playerCharacter.firstName = firstName

  while (!lastName) {
    lastName = await askQuestion('What is your last name? ')
    if (!lastName) {
      console.log('Please enter a valid last name.')
    }
  }
  playerCharacter.lastName = lastName
  playerCharacter.name = `${firstName} ${lastName}`

  console.log(`Welcome, ${playerCharacter.name}! Let's continue with your character creation.\n`)
  promptPlayerRace()
}

// Continue with the rest of the setup process
async function promptPlayerRace () {
  console.log('🏛️ Choose your race:')
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
      promptPlayerClass()
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
      promptPlayerGender()
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
      promptPlayerAge()
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
      promptPlayerHeight()
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
      promptPlayerWeight()
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
      showCharacterSummary()
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
  console.log(`Name: ${playerCharacter.name}`)
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
    promptPlayerName()
  }
}

// Step 9: Complete character creation and update game
function completeCharacterCreation () {
  console.log('\n🎉 Character creation complete!')
  console.log(`Welcome to Aethel, ${playerCharacter.name} the ${playerCharacter.race} ${playerCharacter.class}!`)
  console.log('\nYour adventure begins now...\n')

  // Export character data for use in the main game
  global.createdPlayer = playerCharacter

  rl.close()

  // Optional: Start the main game here or return to game.js
  console.log('🌍 Loading the world of Aethel...')
}

// Export function to get created player data
export function getPlayerData () {
  return playerCharacter
}

// Export function to update player object in main game
export function updatePlayerObject (gamePlayerObject) {
  if (playerCharacter.name) {
    gamePlayerObject.name = playerCharacter.name
    gamePlayerObject.race = playerCharacter.race
    gamePlayerObject.class = playerCharacter.class
    gamePlayerObject.gender = playerCharacter.gender
    gamePlayerObject.age = playerCharacter.age
    gamePlayerObject.height = playerCharacter.height
    gamePlayerObject.weight = playerCharacter.weight

    console.log(`✅ Player object updated for ${playerCharacter.name}!`)
    return true
  }
  return false
}
