#!/usr/bin/env node

/**
 * CommonJS wrapper for PKG compatibility
 * This file dynamically imports the ES module game.js with proper URL handling
 */

const { pathToFileURL } = require('url')
const path = require('path')

async function startGame () {
  try {
    // Use pathToFileURL for proper file URL conversion
    const gameModulePath = path.resolve(__dirname, 'game.js')
    const gameModuleURL = pathToFileURL(gameModulePath).href

    // Dynamic import with proper URL
    await import(gameModuleURL)

    // The game.js module should start automatically when imported
  } catch (error) {
    console.error('Error starting the game:', error)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Start the game
startGame()
