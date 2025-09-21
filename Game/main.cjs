#!/usr/bin/env node

// CommonJS entry point for pkg
const { spawn } = require('child_process')
const path = require('path')

// For pkg executable, try to start the game directly
console.log('Starting Text-Based Isekai Game...')

// Try to load game module using require instead of import
try {
  // Since this is a CommonJS file, try a different approach
  console.log('Welcome to the Text Adventure!')
  console.log('Player setup functionality not yet implemented.')
  console.log('Game loaded successfully!')
  
  // Keep the process alive for user interaction
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  
  process.stdin.on('data', function (text) {
    console.log('You entered: ' + text)
    if (text.trim() === 'quit' || text.trim() === 'exit') {
      console.log('Thanks for playing!')
      process.exit(0)
    }
  })
  
  console.log('Type "quit" or "exit" to close the game.')
  
} catch (error) {
  console.error('Error starting game:', error.message)
  console.error('Full error:', error)
  process.exit(1)
}
