// Test script to demonstrate the inquirer prompts functionality
import { input, select, confirm } from '@inquirer/prompts'

async function testInquirerFeatures () {
  console.log('🧪 Testing Inquirer Prompts Integration...\n')

  // Test input prompt
  console.log('1. Testing Input Prompt:')
  const name = await input({
    message: 'What is your character name?',
    validate: (input) => {
      if (!input || input.trim().length === 0) {
        return 'Please enter a valid name.'
      }
      return true
    }
  })
  console.log(`Hello, ${name}!\n`)

  // Test select prompt
  console.log('2. Testing Select Prompt:')
  const action = await select({
    message: 'What would you like to do?',
    choices: [
      {
        name: '⚔️ Enter the dungeon',
        value: 'dungeon'
      },
      {
        name: '🏪 Visit the shop',
        value: 'shop'
      },
      {
        name: '🗣️ Talk to NPCs',
        value: 'talk'
      }
    ]
  })
  console.log(`You chose: ${action}\n`)

  // Test confirm prompt
  console.log('3. Testing Confirm Prompt:')
  const confirmChoice = await confirm({
    message: 'Are you ready to start your adventure?',
    default: true
  })
  console.log(`Ready to adventure: ${confirmChoice ? 'Yes!' : 'Not yet...'}\n`)

  console.log('✅ All inquirer prompts are working correctly!')
  console.log('🎮 These features are now integrated into the main game!')
}

testInquirerFeatures().catch(console.error)
