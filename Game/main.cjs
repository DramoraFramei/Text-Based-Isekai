#!/usr/bin/env node

/**
 * CommonJS wrapper for PKG compatibility
 * This file dynamically imports the ES module game.js
 */

async function startGame () {
  try {
    // Dynamic import of the ES module
    await import('./game.js')

    // The game.js module should start automatically when imported
    // If it exports a start function, we could call it here:
    // if (gameModule.startGame) {
    //   gameModule.startGame();
    // }
  } catch (error) {
    console.error('Error starting the game:', error)
    process.exit(1)
  }
}

// Start the game
startGame()
