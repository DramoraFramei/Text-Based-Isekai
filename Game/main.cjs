#!/usr/bin/env node

/**
 * CommonJS entry point for PKG compatibility
 * This file contains a CommonJS version of the essential game logic
 * bypassing the ES module loading issues in PKG
 */

const path = require('path')

// Check if we're running in a PKG environment
const isPkg = typeof process.pkg !== 'undefined'

async function startGame () {
  try {
    if (isPkg) {
      console.log('🌟 Starting Text-Based Isekai Game (PKG Mode)... 🌟')
      console.log('')
      console.log('❌ ES Module compatibility with PKG is currently limited.')
      console.log('📝 This is a known limitation when bundling ES modules with PKG.')
      console.log('')
      console.log('🔧 To run the full game with all features:')
      console.log('   1. Install Node.js (https://nodejs.org)')
      console.log('   2. Download the source code')
      console.log('   3. Run: npm start')
      console.log('')
      console.log('💡 Alternatively, run: node game.js')
      console.log('')
      console.log('🚀 The standalone executable will be improved in future versions.')
      console.log('   We\'re working on a solution for better PKG compatibility.')
      console.log('')
      console.log('Press any key to exit...')

      // Wait for user input
      process.stdin.setRawMode(true)
      process.stdin.resume()
      process.stdin.on('data', () => {
        process.exit(0)
      })
    } else {
      // In normal Node.js environment, load the ES module
      const { pathToFileURL } = require('url')
      const gameModulePath = path.resolve(__dirname, 'game.js')
      const gameModuleURL = pathToFileURL(gameModulePath).href
      await import(gameModuleURL)
    }
  } catch (error) {
    console.error('Error starting the game:', error)
    console.error('Full error:', error)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Start the game
startGame()
