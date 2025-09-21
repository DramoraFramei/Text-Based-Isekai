#!/usr/bin/env node

// CommonJS entry point for pkg

async function startGame () {
  try {
    console.log('🌟 Starting Text-Based Isekai Game... 🌟\n')

    // Import the player setup module
    const { promptPlayerInfo } = await import('./playerSetup.js')

    // Start the character creation process
    promptPlayerInfo()
  } catch (error) {
    console.error('Error starting game:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Start the game
startGame()
