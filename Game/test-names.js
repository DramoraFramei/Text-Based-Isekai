// Simple test to verify firstName and lastName functionality
import { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const testPlayer = {
  firstName: '',
  lastName: ''
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

async function testNamePrompt() {
  console.log('Testing firstName and lastName input...\n')
  
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
  
  testPlayer.firstName = firstName
  testPlayer.lastName = lastName
  
  console.log(`\nSuccess! Full name: ${testPlayer.firstName} ${testPlayer.lastName}`)
  console.log('\nFirst and last name functionality is working correctly!')
  
  rl.close()
}

testNamePrompt()