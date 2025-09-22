// Demo script to show the enhanced quit command functionality
import { confirm } from '@inquirer/prompts'

async function demoEnhancedQuitCommand () {
  console.log('🎮 Demo: Enhanced Quit Command Functionality\n')

  console.log('When a player types "quit", "exit", or "q", they will see:\n')

  console.log('Step 1: Save prompt')
  const saveFirst = await confirm({
    message: 'Would you like to save your game before quitting?',
    default: true
  })

  if (saveFirst) {
    console.log('\n💾 Saving your game...')
    console.log('💾 Game saved successfully! (simulated)')
  } else {
    console.log('\n⏭️ Skipping save...')
  }

  console.log('\nStep 2: Quit confirmation')
  const confirmQuit = await confirm({
    message: 'Are you sure you want to quit the game?',
    default: false
  })

  if (confirmQuit) {
    console.log('\n👋 Thanks for playing Text-Based Isekai! Goodbye!')
    console.log('🚪 (Game would exit here with process.exit(0))')
  } else {
    console.log('\n🎮 Continuing your adventure...')
    console.log('📍 (Player would return to the game location)')
  }

  console.log('\n✅ Enhanced quit command demo completed!')
  console.log('🎯 Available quit commands: quit, exit, q')
  console.log('💡 Features: Save prompt + Quit confirmation')
}

demoEnhancedQuitCommand().catch(console.error)
