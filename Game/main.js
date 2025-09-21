#!/usr/bin/env node

// CommonJS entry point for pkg
async function startApp () {
  try {
    await import('./game.js')
  } catch (error) {
    console.error('Error starting game:', error.message)
    process.exit(1)
  }
}

startApp()
