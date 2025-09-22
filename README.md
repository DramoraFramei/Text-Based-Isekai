# Text-Based-Isekai

Welcome, traveler, to a world not your own. "Text-Based-Isekai" is a classic text-based adventure RPG where you, an ordinary person from Earth, are suddenly transported to a realm of magic, monsters, and mystery. Your choices will shape your destiny. Will you become a legendary hero, a feared villain, or find a way back home?

## 🌟 Features

- **Complete Character Creation System**: Create your unique character with race, class, and personal attributes
- **Rich Fantasy Races**: Choose from Human, Elf, or Beastkin, each with unique racial abilities
- **Diverse Classes**: Select from 11 different classes including Warrior, Mage, Rogue, Cleric, Paladin, Ranger, Sorcerer, Druid, Barbarian, Monk, and Bard
- **Standalone Executable**: No installation required - just download and play!
- **Interactive Character Creation**: 8-step guided character creation process

## 📖 Story

Your ordinary life comes to an abrupt end when you are unexpectedly summoned to the fantasy world of Aethel. With no memory of how you arrived, you find yourself in a land governed by strange rules, filled with magical creatures, and torn by conflict. The locals speak of ancient prophecies, powerful artifacts, and a looming darkness that threatens to consume everything.

Alone and armed with only your wits, you must navigate this new reality, uncover the reason for your arrival, and forge a new path for yourself.

## 🎮 Character Creation

When you start the game, you'll go through an interactive character creation process:

1. **Choose Your Name**: Enter your character's name
2. **Select Your Race**:
   - **Human**: Adaptable and versatile, quick to adapt to new situations
   - **Elf**: Naturally attuned to magic and nature
   - **Beastkin**: Possess heightened senses and primal instincts
3. **Pick Your Class**: Choose from 11 distinct classes, each with unique abilities and playstyles
4. **Customize Appearance**: Select gender, age category, height, and build
5. **Review & Confirm**: See your complete character summary before starting your adventure

## 🎮 Gameplay

This game is a purely text-based experience. You interact with the world by typing commands and reading the narrative descriptions that result from your actions.

- **Exploration:** Navigate through diverse environments, from bustling medieval cities and enchanted forests to dark dungeons and forgotten ruins. Use commands like `go north`, `look around`, and `examine [object]` to interact with your surroundings.
- **Choice-Driven Narrative:** The story unfolds based on the decisions you make. Your choices in dialogue and action will have consequences, opening up new quests, altering your relationships with characters, and changing the world around you.
- **Character Progression:** Develop your character by gaining experience, learning new skills, and acquiring powerful equipment. Customize your abilities to suit your playstyle, whether you prefer brute force, cunning strategy, or powerful magic.
- **Combat:** Engage in turn-based combat with a variety of monsters and foes. Use your skills and equipment strategically to overcome challenges and reap the rewards.
- **Interaction:** Talk to a wide cast of non-player characters (NPCs). They may offer quests, share valuable information, or become trusted allies—or dangerous enemies.

## 🚀 How to Play

### Quick Start (Recommended)

1. **Download**: Get the latest release from the releases page
2. **Navigate**: Go to the `Game/dist/` folder
3. **Run**: Double-click `text-based-isekai.exe` to start your adventure
4. **Create**: Follow the character creation prompts to build your hero
5. **Adventure**: Begin your journey in the world of Aethel!

### Alternative Methods

#### Using the Test Batch File

1. Navigate to the `Game/` folder
2. Double-click `test-exe.bat` to launch the game

#### For Developers (Node.js)

```bash
cd Game
node game.js
# or use npm
npm start
```

> **Note:** The executable is completely standalone and doesn't require Node.js to be installed.

## 🎯 Game Commands

Once you complete character creation and enter the world:

- **Movement**: `go [direction]` (e.g., `go north`, `go west`, `go inside`)
- **Observation**: `look` or `l` to examine your surroundings
- **Interaction**: `take [item]`, `talk to [character]`, `examine [object]`
- **Inventory**: `inventory` or `i` to check your items
- **Combat**: `attack [enemy]` to engage in battle
- **Help**: `help` to see available commands

## 🔧 Technical Details

- **Engine**: Node.js with ES6 modules
- **Executable**: Built with PKG for cross-platform compatibility
- **Data Storage**: JSON-based game data and character information
- **Size**: ~38MB standalone executable

## 📁 Project Structure

```text
Text-Based-Isekai/
├── Game/
│   ├── game.js            # Main entry point and core game logic
│   ├── playerSetup.js     # Character creation system
│   ├── combat.js          # Combat mechanics
│   ├── travel.js          # Movement and exploration
│   ├── data/              # Game data files
│   │   └── characterData.json
│   └── dist/              # Built executables
│       └── text-based-isekai.exe
└── README.md
```

## 🎲 Getting Started Tips

1. **Take Your Time**: Read the character creation descriptions carefully - your choices matter!
2. **Explore Thoroughly**: The world of Aethel is rich with secrets and hidden areas
3. **Talk to Everyone**: NPCs often provide valuable information and quests
4. **Experiment**: Try different commands to discover new interactions
5. **Save Often**: Keep track of your progress (when save functionality is implemented)

Your journey in Aethel awaits. Good luck, traveler!
