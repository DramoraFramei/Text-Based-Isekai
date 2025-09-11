const readline = require('readline');
const fs = require('fs');
const { type } = require('os');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function loadGameData() {
	const characterData = JSON.parse(
		fs.readFileSync('./data/characterData.json', 'utf8')
	);
	const itemsData = JSON.parse(fs.readFileSync('./data/items.json', 'utf8'));
	const mechanicsData = JSON.parse(
		fs.readFileSync('./data/mechanics.json', 'utf8')
	);
	const spellsData = JSON.parse(
		fs.readFileSync('./data/spells.json', 'utf8')
	);
	const recipesData = JSON.parse(
		fs.readFileSync('./data/recipes.json', 'utf8')
	);

	// Reconstruct the gameData object
	const gameData = {
		...characterData,
		...itemsData,
		...mechanicsData,
		spells: spellsData.spells, // Correctly nest the spells object
		...recipesData,
		// Empty arrays for future use
		socialStanding: [],
		faction: [],
		factions: [],
		factionLeader: [],
		factionMember: [],
		alliance: [],
		guild: [],
		guilds: [],
		guildLeader: [],
		guildMember: []
	};

	// Restore the getter for forbidden spells
	Object.defineProperty(gameData.spells.summoning, 'forbidden', {
		get: function () {
			return [...this.primordial, ...this.demonic, ...this.divine];
		}
	});

	return gameData;
}

const gameData = loadGameData();

function mainMenu() {
	console.log('Welcome to the Text Adventure!\n');
	console.log('1. New Game');
	console.log('2. Load Game');
	console.log('3. Exit');
	rl.question('\nPlease select an option: ', (choice) => {
		switch (choice.trim()) {
			case '1':
			case 'new game':
				console.log('\nStarting a new game...');
				promptPlayerInfo();
				break;
			case '2':
			case 'load game':
				// Try to load the autosave first, then the manual save.
				if (fs.existsSync('autosave.json')) {
					console.log('\nAutosave found. Loading game...');
					loadGame('autosave.json');
				} else if (fs.existsSync('savegame.json')) {
					console.log('\nLoading saved game...');
					loadGame('savegame.json');
				} else {
					console.log('\nNo save file found. Starting a new game.');
					promptPlayerInfo();
				}
				break;
			case '3':
			case 'exit':
				rl.close();
				break;
			default:
				console.log("Invalid option. Please enter '1', '2', or '3'.");
				mainMenu(); // Show the menu again
				break;
		}
	});
}

const itemGeneration = {
	rarities: [
		{ name: 'Very Common', chance: 0.25, multiplier: 0.8 },
		{ name: 'Common', chance: 0.4, multiplier: 1.0 },
		{ name: 'Uncommon', chance: 0.2, multiplier: 1.2 },
		{ name: 'Rare', chance: 0.1, multiplier: 1.5 },
		{ name: 'Very Rare', chance: 0.03, multiplier: 1.8 },
		{ name: 'Mythical', chance: 0.01, multiplier: 2.2 },
		{ name: 'Very Mythical', chance: 0.005, multiplier: 2.6 },
		{ name: 'Legendary', chance: 0.002, multiplier: 3.0 },
		{ name: 'Very Legendary', chance: 0.001, multiplier: 3.5 },
		{ name: 'Divine', chance: 0.0005, multiplier: 4.0 },
		{ name: 'Very Divine', chance: 0.0002, multiplier: 4.5 },
		{ name: 'Celestial', chance: 0.0001, multiplier: 5.0 },
		{ name: 'Very Celestial', chance: 0.00005, multiplier: 5.5 },
		{ name: 'Primordial', chance: 0.00002, multiplier: 6.0 },
		{ name: 'Very Primordial', chance: 0.00001, multiplier: 7.0 }
	],
	enchantments: {
		attack: { prefix: 'Vicious', suffix: 'of Slaying', value: 2 },
		defense: { prefix: 'Sturdy', suffix: 'of Protection', value: 2 }
	}
};

const racialAbilities = {
	shapeshifter: {
		transform: (formName) => {
			if (!player.knownForms.includes(formName)) {
				console.log(
					`You don't know how to transform into a ${formName}.`
				);
				return;
			}
			if (player.transform.isTransformed) {
				console.log('You must revert to your original form first.');
				return;
			}
			const form = enemies[formName]; // Assuming we transform into enemies for now
			if (!form) {
				console.log(`The form '${formName}' is not valid.`);
				return;
			}

			transformInto(formName);
		}
	}
};

const raceBonuses = {
	human: {
		strength: 1,
		dexterity: 1,
		constitution: 1,
		intelligence: 1,
		wisdom: 1,
		charisma: 1
	},
	elf: { dexterity: 2, intelligence: 1, constitution: -1 },
	dwarf: { constitution: 2, strength: 1, charisma: -1 },
	orc: { strength: 2, constitution: 1, intelligence: -2 },
	demon: { strength: 1, intelligence: 2, charisma: -1 },
	angel: { wisdom: 2, charisma: 2, strength: -1 },
	beastkin: { dexterity: 2, strength: 1, intelligence: -1 },
	gnome: { intelligence: 2, dexterity: 1, strength: -1 },
	lizardman: { constitution: 2, strength: 1, charisma: -1 },
	halfling: { dexterity: 2, luck: 2, strength: -2 },
	tiefling: { intelligence: 1, charisma: 2, constitution: -1 }
};

const classBonuses = {
	warrior: { strength: 2, constitution: 1, maxHealth: 20, attack: 2 },
	mage: { intelligence: 3, wisdom: 1, maxHealth: -10, mana: 30 },
	rogue: { dexterity: 3, luck: 1, attack: 1 },
	paladin: { strength: 1, wisdom: 1, charisma: 2, defense: 1 },
	ranger: { dexterity: 2, wisdom: 1, attack: 1 },
	barbarian: { strength: 3, constitution: 2, intelligence: -2 },
	cleric: { wisdom: 3, constitution: 1, mana: 15 },
	monk: { dexterity: 2, wisdom: 2, defense: 1 },
	bard: { charisma: 3, dexterity: 1, luck: 1 },
	sorcerer: { intelligence: 2, charisma: 2, mana: 20 },
	druid: { wisdom: 2, constitution: 1, mana: 10 }
	// Add more class bonuses as needed
};

const quests = {
	goblin_slayer: {
		name: 'Goblin Slayer',
		description:
			'Goblins have been spotted in a nearby dungeon. Clear them out to make the area safe.',
		objective: {
			type: 'kill',
			target: 'goblin',
			count: 1
		},
		reward: { gold: 50, xp: 25 },
		status: 'available' // available, accepted, completed
	}
};

const player = {
	name: '',
	class: '',
	race: '',
	uniqueItemIdCounter: 0, // To ensure all items have a unique ID
	gender: '',
	mineFloor: 0, // 0 = not in mine, 1-120 for floors
	age: '',
	height: '',
	weight: '',
	location: 'forest',
	inventory: [
		// 'torch' // for testing cave
	],
	equipment: {
		weapon: null,
		chest: null,
		head: null,
		legs: null,
		feet: null
	},
	skills: [],
	spells: [
		'fireball' // Give a starting spell for testing
	],
	potions: [],
	weapons: [],
	armor: [],
	rings: [],
	trinkets: [],
	consumables: [],
	stats: {
		// Base stats, will be modified by class
		health: 100,
		maxHealth: 100,
		mana: 100,
		level: 1,
		experience: 0,
		xpToNextLevel: 100,
		attack: 10,
		defense: 10,
		strength: 10,
		dexterity: 10,
		constitution: 10,
		intelligence: 10,
		wisdom: 10,
		charisma: 10,
		luck: 10,
		energy: 100,
		gold: 50 // Starting gold
	},
	reputation: {
		good: 0,
		neutral: 0,
		evil: 0
	},
	questLog: {
		// e.g., 'goblin_slayer': { status: 'accepted', progress: 0 }
		// status can be 'accepted', 'completed'
	},
	knownForms: [], // For shapeshifters
	transform: {
		isTransformed: false,
		transformedInto: null,
		originalStats: null
	},
	activeEffects: [], // e.g., [{ id: 'burning', turnsLeft: 2 }]
	cooldowns: {}, // e.g., { 'battleRage': 1, 'layOnHands': 1 }
	flags: {}, // e.g., { 'usedHalflingLuckToday': true }
	lastCheck: null // For Halfling Luck re-roll
};

const gameState = {
	time: 8, // Start at 8:00 AM
	day: 1,
	isNight: () => gameState.time >= 20 || gameState.time < 6,
	currentEnemy: null // Will hold the enemy object during combat
};

const commandAliases = {
	examine: 'look',
	inspect: 'look',
	l: 'look',
	x: 'look',
	inv: 'inventory',
	bag: 'inventory',
	i: 'inventory',
	craft: 'craft',
	char: 'stats',
	character: 'stats',
	c: 'stats',
	gear: 'equipment',
	e: 'equipment'
};

const npcs = {
	old_man_gideon: {
		name: 'Gideon',
		description:
			'A weathered old man with a long white beard sits on a tree stump, whittling a piece of wood.',
		dialogue: [
			"Well, hello there, traveler. It's not often I see a new face in these woods...",
			"Be careful if you're heading north. There's a dark cave up that way. I'd recommend getting a torch if you plan to explore it...",
			"The village to the east is usually welcoming, but they've been on edge lately...",
			'The Priest, Father Andrew, has been talking about some being appearing in this world from another. Let me see if I can remember the name he keeps saying...',
			'OH RIGHT!!!',
			`It was ${player.name}!`
		],
		dialogueIndex: 0 // To cycle through what he says
	},
	elara_the_shopkeeper: {
		name: 'Elara',
		description:
			'A cheerful woman with a bright smile stands behind the counter.',
		dialogue: [
			'Welcome to my shop! What can I get for you today?',
			"I've got a fresh stock of torches, perfect for exploring dark places. Just say 'buy torch'."
		],
		dialogueIndex: 0
	},
	James_the_blacksmith: {
		name: 'James',
		description:
			'A gruff and burly man with massive muscles who is very passionate about blacksmithing.',
		// Dialogue is a function to dynamically access player info
		dialogue: (p) => [
			`Great, another ${p.race || 'stranger'}, and a ${
				p.class || 'drifter'
			} at that. Are you here to actually buy something or are you just planning on wasting my time?`,
			"Make it quick, time is money and I don't have too much of either to spare."
		],
		dialogueIndex: 0
	},
	Father_Andrew_the_Priest: {
		name: 'Father Andrew',
		description:
			'A refined man of the cloth that exudes an aura of calm and gentle love that puts everyone in a state of peace.',
		dialogue: (p) => [
			`Welcome ${player.name}, I have been informed of your appearance in this world.`
		]
	}
};

const enemies = {
	goblin: {
		name: 'Goblin',
		description:
			'A small, green-skinned creature with sharp teeth and a rusty dagger.',
		stats: {
			health: 30,
			maxHealth: 30,
			attack: 8,
			defense: 4,
			gold: 15, // gold dropped
			xp: 10, // experience points
			activeEffects: []
		}
	},
	drops: [
		{ itemId: 'health_potion', chance: 0.25 }, // 25% chance to drop a health potion
		{ itemId: 'rusty_sword', chance: 0.05 } // 5% chance to drop a rusty sword
	]
};

const locations = {
	forest: {
		description:
			"You are in a dense forest. You can go 'north', 'east', 'west', or 'south'.",
		longDescription:
			'The forest is thick with ancient trees, their leaves forming a dense canopy that blots out much of the sun. The air is damp and smells of earth and moss. A faint path winds through the undergrowth.',
		npcs: ['old_man_gideon'],
		actions: {
			north: () => travel('cave', 1),
			south: () => {
				console.log(
					'You wander deeper into the forest, but find a dungeon, its entrance half buried in the surrounding tree roots.'
				);
				travel('dungeon', 1);
			},
			east: () => {
				console.log('You have discovered a village.');
				player.location = 'village entrance';
			},
			west: () => {
				console.log('You go west, and find a road.');
				travel('roads', 1);
			}
		},
		interactables: {
			trees: {
				description:
					'The ancient trees of the forest stand tall and proud. They look like a good source of wood.',
				actions: ['chop']
			}
		}
	},
	cave: {
		description: () => {
			if (!player.inventory.includes('torch')) {
				return "You are at the entrance of a dark cave. It's too dark to see inside. You can go 'back' to the forest.";
			} else {
				return "You are in a dark cave. You have a torch so you can 'proceed', or go 'back' to the forest.";
			}
		},
		longDescription:
			'The entrance to the cave is a dark, gaping maw in the side of a rocky hill. A chill wind blows out from within, carrying the scent of damp stone and something ancient and still.',
		actions: {
			back: () => travel('forest', 1),
			proceed: () => {
				if (player.inventory.includes('torch')) {
					console.log(
						'You explore further into the cave and find an old abandoned mine.'
					);
					travel('old abandoned mine', 1);
				} else {
					console.log(
						"It's too dark to proceed without a light source."
					);
				}
			}
		}
	},
	'village entrance': {
		description:
			"You have discovered a village. You can 'explore' or go 'back' to the forest.",
		longDescription:
			'Before you stands a simple wooden palisade marking the entrance to a small village. You can see thatched-roof houses beyond the gate and hear the distant sounds of life.',
		actions: {
			explore: () => {
				console.log('You decide to explore the village.');
				travel('inside village', 0); // No time passes for short walks
			},
			back: () => travel('forest', 1)
		}
	},
	'inside village': {
		description:
			"You are inside the village. Where do you go? There's the 'market', 'shop', 'inn', 'temple', 'stables', 'bar', 'adventurers guild', or the 'blacksmith'. You can also go 'back' to the village entrance.",
		longDescription:
			'The village is small but lively. Dirt paths connect a handful of rustic buildings. Villagers mill about, going about their daily tasks, occasionally glancing your way.',
		actions: {
			blacksmith: () => (player.location = 'blacksmith'),
			market: () => (player.location = 'market'),
			shop: () => (player.location = 'shop'),
			inn: () => (player.location = 'inn'),
			temple: () => (player.location = 'temple'),
			stables: () => (player.location = 'stables'),
			bar: () => (player.location = 'bar'),
			'adventurers guild': () => (player.location = 'adventurers guild'),
			back: () => travel('village entrance', 0)
		}
	},
	market: {
		description:
			'You are at the bustling market. You can go back to the village.',
		longDescription:
			'The market square is a flurry of activity, with stalls selling everything from fresh produce to handmade crafts. The air is filled with a cacophony of voices and smells.',
		actions: { back: () => (player.location = 'inside village') }
	},
	shop: {
		description:
			'You are at the general shop. You can go back to the village.',
		longDescription:
			'This is a cozy general store. Shelves are stocked with various goods, from coils of rope to bags of grain. A small counter sits near the back.',
		npcs: ['elara_the_shopkeeper'],
		inventory: {
			torch: { current: 5, max: 5 },
			health_potion: { current: 10, max: 10 }
		},
		lastRestockDay: 1,
		actions: {
			back: () => travel('inside village', 0)
		}
	},
	blacksmith: {
		description:
			"You are at James' Blacksmith shop. You can go 'back' to the village.",
		longDescription:
			'The air in the blacksmith shop is hot and thick with the smell of coal and hot metal. An impressive forge glows in the corner, and various tools of the trade are hung neatly on the walls. An anvil sits squarely in the center of the room. A sturdy workbench is set against one wall.',
		npcs: ['James_the_blacksmith'],
		craftingStation: ['workbench', 'forge'],
		interactables: {
			workbench: {
				description:
					'A large, sturdy workbench covered in tools, metal shavings, and leather scraps. It looks like the perfect place to craft items.'
			},
			forge: {
				description:
					'A massive stone forge, radiating intense heat. The coals glow a menacing red, ready to smelt the toughest of ores.'
			}
		},
		inventory: {
			rusty_sword: { current: 1, max: 1 },
			leather_armor: { current: 1, max: 1 },
			rusty_pickaxe: { current: 1, max: 1, chance: 0.5 },
			lockpick: { current: 3, max: 3 }
		},
		lastRestockDay: 1,
		actions: {
			back: () => travel('inside village', 0)
		}
	},
	inn: {
		description: 'You are at the cozy inn. You can go back to the village.',
		longDescription:
			'The inn is warm and inviting, with a large fireplace crackling in the corner. A few patrons are scattered around, nursing their drinks. The smell of stew hangs in the air.',
		actions: {
			back: () => travel('inside village', 0),
			sleep: () => {
				console.log('You sleep soundly until morning.');
				advanceTime(8); // Sleep for 8 hours
			}
		}
	},
	temple: {
		description:
			'You are at the serene temple. You can go back to the village.',
		longDescription:
			'The temple is a quiet, peaceful building made of white stone. The air is thick with the scent of incense. Soft light filters through stained-glass windows.',
		actions: {
			back: () => (player.location = 'inside village')
		}
	},
	stables: {
		description: 'You are at the stables. You can go back to the village.',
		longDescription:
			'The stables smell strongly of hay and animals. A few horses look at you from their stalls. Tack and equipment hang neatly on the walls.',
		actions: { back: () => (player.location = 'inside village') }
	},
	bar: {
		description:
			'You are at the noisy bar. You can go back to the village.',
		longDescription:
			'The bar is a rowdy place, filled with loud chatter and the clinking of mugs. The floor is sticky with spilled ale.',
		actions: { back: () => (player.location = 'inside village') }
	},
	'adventurers guild': {
		description:
			"You are at the adventurers guild. You can 'view quests', 'accept quest <quest name>', 'turn in <quest name>', or 'change class'. You can also go 'back' to the village.",
		longDescription:
			'The adventurers guild is a large, functional hall. A massive board covered in notices and requests for aid dominates one wall. Adventurers of all shapes and sizes are gathered here, discussing their latest exploits.',
		actions: { back: () => travel('inside village', 0) }
	},
	'old abandoned mine': {
		description:
			"You are in an old abandoned mine. You can go 'back' to the cave.",
		onEnter: (isLookCommand = false) => {
			const chest = locations['old abandoned mine'].interactables.chest;
			let dynamicDescription =
				'The mine shaft is dark and supported by rotting wooden beams. The air is stale and you can see discarded tools and broken carts littering the ground.';
			if (isLookCommand && chest.isHidden) {
				// Perception check to find the chest when 'look' is used
				performSkillCheck(
					'perception',
					40,
					() => {
						// Success
						console.log(
							'Your keen eyes spot something unusual... Tucked away in a dark corner, you find a dusty old chest!'
						);
						chest.isHidden = false;
					},
					() => {
						// Failure
						console.log(
							'You scan the area, but see nothing out of the ordinary.'
						);
					}
				);
			} else if (!chest.isHidden) {
				dynamicDescription +=
					' In the corner, you spot a dusty old chest.';
			}
		},
		interactables: {
			chest: {
				description:
					"It's a sturdy, iron-banded chest. It looks very old.",
				isTrapped: true,
				isDisarmed: false,
				isLocked: true,
				isUnlocked: false,
				isHidden: true, // The chest is now hidden by default
				contents: { gold: 50, itemIds: ['health_potion'] }
			}
		},
		actions: {
			back: () => travel('cave', 1),
			mine: () => {
				const hasPickaxe =
					player.equipment.weapon?.name
						.toLowerCase()
						.includes('pickaxe') ||
					player.inventory.some((i) =>
						i.name.toLowerCase().includes('pickaxe')
					);

				if (!hasPickaxe)
					return console.log('You need a pickaxe to mine here.');

				advanceTime(1);
				performSkillCheck(
					'mining',
					50,
					() => {
						// Success
						console.log(
							'Your skilled swing strikes the perfect spot!'
						);
						const amount =
							player.race.toLowerCase() === 'dwarf' ? 2 : 1; // Dwarves find more
						for (let i = 0; i < amount; i++) {
							player.inventory.push(
								createItemInstance('iron_ore', false)
							);
						}
						console.log(
							`You managed to get ${amount} chunk(s) of Iron Ore!`
						);
					},
					() =>
						console.log(
							'You swing your pickaxe, but only dust and pebbles break away. You find no ore.'
						)
				);
			},
			prospect: () => {
				const hasPickaxe =
					player.equipment.weapon?.name
						.toLowerCase()
						.includes('pickaxe') ||
					player.inventory.some((i) =>
						i.name.toLowerCase().includes('pickaxe')
					);

				if (!hasPickaxe)
					return console.log(
						'You need a pickaxe to prospect for rare ore.'
					);

				advanceTime(1);
				console.log(
					'You carefully chip away at the rock, searching for valuable veins...'
				);
				performSkillCheck(
					'perception',
					30, // Harder than regular mining
					() => {
						// Success
						let foundOre = false;
						for (const drop of prospectingTable) {
							if (Math.random() < drop.chance) {
								const newItem = createItemInstance(
									drop.itemId,
									false
								);
								player.inventory.push(newItem);
								console.log(
									`Success! Your careful work has revealed a chunk of ${newItem.name}!`
								);
								foundOre = true;
								break; // Stop after finding the first ore
							}
						}
						if (!foundOre) {
							console.log(
								'You find some interesting geological formations, but no valuable ore.'
							);
						}
					},
					() => {
						// Failure
						console.log(
							'You spend some time prospecting, but find nothing of value.'
						);
					}
				);
			}
		}
	},
	dungeon: {
		description:
			"You are at the entrance of a dark dungeon. You can 'enter' or go 'back' to the forest.",
		longDescription:
			'The dungeon entrance is a foreboding stone archway, covered in moss and ancient carvings. A palpable sense of dread emanates from the darkness within.',
		actions: {
			enter: () => {
				console.log('You step into the damp, dark dungeon...');
				startCombat('goblin');
			},
			back: () => travel('forest', 1)
		}
	},
	roads: {
		description:
			"You are on a dusty road. You can go 'back' to the forest.",
		longDescription:
			'You stand on a well-trodden dirt road that stretches out in either direction. It seems to lead towards more civilized lands.',
		actions: {
			north: () => travel('nountains', 1),
			south: () => travel('city', 1),
			back: () => travel('forest', 1)
		}
	},
	mountains: {
		description:
			"Mount Celestus is a monolithic titan, its base lost in cloud forests while its summit, the celestial summit, gleams in the vacuum of space, far beyond Earth's atmosphere. This impossibly tall peak is so high that its slopes transition from vibrant alpine meadows to barren rock, and finally, to a world of absolute zero temperatures and cosmic radiation.",
		longDescription:
			"Mount Celestus, a breathtaking and impossible marvel of geology, dominates the skyline of the world. Its sheer scale defies comprehension, an immense craggy titan whose base is shrouded in lush, misty forests. As you ascend its lower slopes, you traverse a landscape of staggering biodiversity, with waterfalls cascading down colossal cliffs and unique flora and fauna that have adapted to the mountain's changing climate. Above the tree line, the air thins dramatically, and the vibrant life gives way to a stark, alpine world. Glaciers cling to the mountain's shoulders, and powerful winds howl through jagged canyons.  This is where the true climb begins—a journey that leads to the mountain's most unique feature: its summit, which is a world unto itself. The upper reaches of Mount Celestus pierce the sky, breaking through the planet's atmospheric shell and extending into the frigid vacuum of space. The peak, often called the celestial summit, is a place of profound silence and otherworldly beauty. There, the sky is an inky black canvas ablaze with stars, and the sun shines with a cold, unfiltered brilliance. Climbers who reach this impossible height would need specialized magic to survive the lack of oxygen, the extreme cold, and the onslaught of cosmic radiation. At the summit, you can look down upon the swirling cloud formations of the entire planet, watching sunrises and sunsets as the world of Demos turns below you. It's a place where the concepts of 'up' and 'down' blur, and a single step places you both on the world and in the vastness of the cosmos. It's not just a mountain; it's a bridge between worlds.",
		actions: {
			climb: () => travel('mountains', 1),
			back: () => travel('roads', 1)
		}
	},
	city: {
		description:
			'Aethelgard is a city of impossible beauty, where towering spires of white marble scrape the clouds and bridges woven with living vines connect floating islands. It is a metropolis built on layers of history, with ancient cobblestone streets giving way to crystalline thoroughfares and canals of pure starlight. At its heart lies the Sunspire Palace, a beacon of light and magic that illuminates the entire city, casting a golden glow over its sculpted gardens and endless waterfalls.',
		longDescription:
			"Aethelgard is a name whispered in awe across all the known lands, a city that embodies the pinnacle of magic and architecture. It is built not just on the land, but in the very air itself, a tapestry of interconnected islands that drift serenely above a crystalline lake. The city’s core is a masterpiece of white marble, where spires reach so high they seem to pierce the sky, and balconies are adorned with blooming, luminous flowers that thrive on arcane energy. The heart of Aethelgard is the Sunspire Palace, a monolith of polished alabaster that catches the light of both sun and moon, broadcasting a soft, golden radiance across the entire city. Below it, the city's districts are connected by bridges that are more art than engineering—some are crafted from polished moonlight, while others are great arches of petrified wood overgrown with vines and flowers that sing in the wind. The streets themselves are a mosaic of epochs, with ancient, moss-covered cobblestones giving way to smooth, magically-lit thoroughfares that hum with latent power. Within its boundaries, life is a constant spectacle. Waterfalls, defying gravity, flow up into the sky and rain down as a fine, prismatic mist. Grand libraries are housed in colossal, hollowed-out geodes, their walls shimmering with latent magic. In the city's lower reaches, forgotten neighborhoods are carved into the very stone of the earth, where artisans work with ancient elements to create wonders. Aethelgard is more than a city; it is a living work of art, a dream made real by generations of magic and ingenuity, where every vista is a painting and every corner holds a new, breathtaking secret.",
		actions: {
			explore: () => travel('inner city', 1),
			back: () => travel('roads', 1)
		}
	},
	'inner city': {
		description:
			'Aethelgard is a city of impossible beauty, where towering spires of white marble scrape the clouds and bridges woven with living vines connect floating islands. It is a metropolis built on layers of history, with ancient cobblestone streets giving way to crystalline thoroughfares and canals of pure starlight. At its heart lies the Sunspire Palace, a beacon of light and magic that illuminates the entire city, casting a golden glow over its sculpted gardens and endless waterfalls.',
		longDescription:
			"Aethelgard is a name whispered in awe across all the known lands, a city that embodies the pinnacle of magic and architecture. It is built not just on the land, but in the very air itself, a tapestry of interconnected islands that drift serenely above a crystalline lake. The city’s core is a masterpiece of white marble, where spires reach so high they seem to pierce the sky, and balconies are adorned with blooming, luminous flowers that thrive on arcane energy. The heart of Aethelgard is the Sunspire Palace, a monolith of polished alabaster that catches the light of both sun and moon, broadcasting a soft, golden radiance across the entire city. Below it, the city's districts are connected by bridges that are more art than engineering—some are crafted from polished moonlight, while others are great arches of petrified wood overgrown with vines and flowers that sing in the wind. The streets themselves are a mosaic of epochs, with ancient, moss-covered cobblestones giving way to smooth, magically-lit thoroughfares that hum with latent power. Within its boundaries, life is a constant spectacle. Waterfalls, defying gravity, flow up into the sky and rain down as a fine, prismatic mist. Grand libraries are housed in colossal, hollowed-out geodes, their walls shimmering with latent magic. In the city's lower reaches, forgotten neighborhoods are carved into the very stone of the earth, where artisans work with ancient elements to create wonders. Aethelgard is more than a city; it is a living work of art, a dream made real by generations of magic and ingenuity, where every vista is a painting and every corner holds a new, breathtaking secret.",
		Options: [
			'Sunspire Palace',
			'Grand Library',
			'Magic Academy'
			// Add more options as needed
		],
		actions: {
			sunspire_palace: () => travel('sunspire_palace', 1),
			grand_library: () => travel('grand_library', 1),
			magic_academy: () => travel('magic_academy', 1),
			// Add more actions as needed
			back: () => travel('city', 1)
		}
	},
	sunspire_palace: {
		description:
			"The Sunspire Palace is the beating heart of Aethelgard, a colossal spire of polished alabaster and crystal that pierces the clouds. Its walls are embedded with luminous veins of pure light, causing the entire structure to glow with a soft, warm radiance that mimics the rising sun. A beacon of royal power and magic, it stands as the city's highest point and a symbol of its eternal grace, bathing the floating districts below in a perpetual golden light.",
		longDescription:
			"The Sunspire Palace stands as Aethelgard's ultimate testament to power and beauty, an architectural wonder that is as much a living entity as it is a building. From the outside, it is a breathtaking spire of impossibly white alabaster, its surface polished to a mirror sheen. It is not merely a structure, but a beacon, infused with magical veins of pure light that pulse with a soft, golden radiance, illuminating the city day and night. The true magic of the palace, however, is revealed within. The grand entrance opens into a breathtaking rotunda where walls are not solid stone but a shimmering curtain of condensed starlight. From here, crystalline staircases spiral upwards, seemingly suspended in the air, their steps humming with latent energy. The palace's many chambers are each a unique work of art. The Hall of Whispers, for instance, is a massive cavern where echoes of ancient spells and royal decrees still resonate softly on the air, while the gardens within are a magical biome where flora from across the realms thrive in an environment of carefully curated light and humidity. At the very top of the palace lies the throne room, the pinnacle of the entire structure. It is a space of sublime, hushed power, its walls sculpted from polished moonstone. The true wonder is the ceiling, a colossal, seamless dome of flawless star-sapphire. Through this transparent celestial dome, one can look up and see the constellations in their unadulterated brilliance, an ever-changing tapestry of light and space. Below, the throne itself is carved from a single piece of sunstone, a source of warmth and energy that ensures the palace is a place of comfort and power, a sanctuary where royalty presides over a city built on dreams and magic.",
		visited: false,
		onEnter: () => {
			const location = locations.sunspire_palace;
			if (!location.visited) {
				console.log(
					'You were stopped by a Sunspire Palace guard who demanded that you meet with the King of Aethelgard, and get his approval before you can be allowed to explore the palace freely.'
				);
				location.visited = true;
			}
		},
		actions: {
			back: () => travel('inner city', 1)
		}
	}
};

function formatTime(hour) {
	const ampm = hour >= 12 ? 'PM' : 'AM';
	let formattedHour = hour % 12;
	if (formattedHour === 0) {
		formattedHour = 12; // For 12 AM (midnight) and 12 PM (noon)
	}
	return `${formattedHour}:00 ${ampm}`;
}

function displayLocation() {
	// If in combat, don't display location info, stay in combat loop
	if (gameState.currentEnemy) {
		promptCombatAction();
		return;
	}

	if (player.location === 'mine_floor') {
		displayMineFloor();
		return;
	}

	const location = locations[player.location];
	if (!location) {
		console.log(`Error: Location "${player.location}" not found!`);
		player.location = 'forest'; // Reset to a default location
		displayLocation();
		return;
	}

	console.log(
		`\n--- Day ${gameState.day}, ${formatTime(gameState.time)} ---`
	);

	const description =
		typeof location.description === 'function'
			? location.description()
			: location.description;
	console.log(description);

	// Display NPCs in the location
	if (location.npcs && location.npcs.length > 0) {
		console.log('\nAlso here:');
		const npcNames = [];
		location.npcs.forEach((npcId) => {
			const npc = npcs[npcId];
			if (npc) {
				console.log(`- ${npc.description}`);
				npcNames.push(npc.name);
			}
		});
		if (npcNames.length > 0) {
			const nameList = npcNames
				.map((name) => `'${name.toLowerCase()}'`)
				.join(' or ');
			console.log(`You can 'talk to' ${nameList}.`);
		}
	}

	// Display items for sale
	if (location.inventory) {
		console.log('\nItems for sale:');
		Object.keys(location.inventory).forEach((itemId) => {
			const item = gameData.items[itemId];
			const stock = location.inventory[itemId];
			if (item && stock.current > 0) {
				console.log(
					`- ${item.name} (${item.price} gold) [${stock.current} in stock]`
				);
			}
		});
		console.log("You can 'buy <item name>' to purchase something.");
	}
	if (player.location === 'inn')
		console.log("You can 'sleep' here to pass the time.");

	if (player.inventory.length > 0) {
		console.log("You can 'use <item>' or 'equip <item>'.");
	}
	if (Object.values(player.equipment).some((item) => item)) {
		console.log("Check your 'equipment' or 'unequip <slot>'.");
	}
	console.log("You can check your 'inventory' at any time.");
	console.log("You can 'look' around for more detail.");

	console.log(''); // Add a blank line for spacing
	promptAction();
}

async function promptPlayerInfo() {
	const ask = (question) =>
		new Promise((resolve) => rl.question(question, resolve));

	const firstName = await ask('What is your first name? ');
	const lastName = await ask('What is your last name? ');
	player.name = `${firstName} ${lastName}`;
	console.log(`\nWelcome, ${player.name}!`);
	const raceOptions = Object.keys(gameData.races).join(', ');
	player.race = await ask(`What is your race? (${raceOptions}): `);
	console.log(`Your race is ${player.race}.`);
	if (player.race.toLowerCase() === 'shapeshifter') {
		console.log(
			'As a shapeshifter, you can learn the forms of creatures you defeat.'
		);
		console.log(
			"Use 'transform <creature>' to change and 'revert' to change back."
		);
	}

	const genderOptions = gameData.genders.join(', ');
	player.gender = await ask(`What is your gender? (${genderOptions}): `);
	console.log(`Your gender is ${player.gender}.`);

	const ageOptions = Object.entries(gameData.ages)
		.map(([key, value]) => `${key} (${value.display})`)
		.join(', ');
	player.age = await ask(`What is your age category? (${ageOptions}): `);
	console.log(`You are in the age category of ${player.age}.`);

	const heightOptions = Object.entries(gameData.heights)
		.map(([key, value]) => `${key} (${value.display})`)
		.join(', ');
	player.height = await ask(`What is your height? (${heightOptions}): `);
	console.log(`Your height is ${player.height}.`);

	const weightOptions = gameData.weights.join(', ');
	player.weight = await ask(`What is your weight? (${weightOptions}): `);
	console.log(`Your weight is considered ${player.weight}.`);

	const classOptions = gameData.classes.join(', ');
	player.class = await ask(`What is your class? (${classOptions}): `);
	console.log(`You have chosen the path of a ${player.class}.`);

	// Apply initial stat bonuses from race and class
	applyStatBonuses();
	// Fully heal the player after setting initial stats
	player.stats.health = player.stats.maxHealth;

	console.log('\nCharacter creation complete!\n');
	console.log(
		'Your initial stats have been set based on your race and class.'
	);
	displayLocation();
}

function displayMineFloor() {
	console.log(
		`\n--- Day ${gameState.day}, ${formatTime(gameState.time)} ---`
	);
	console.log(`\n--- Mine Floor ${player.mineFloor} ---`);
	const oreType = getOreForFloor(player.mineFloor);
	const oreName = oreType ? gameData.items[oreType].name : 'nothing of value';
	console.log(
		`The rock walls on this level look like they might contain ${oreName}.`
	);
	console.log(
		"The rickety lift is here. You can go 'up' or 'down'. You can also 'mine' the walls."
	);
	promptAction();
}

function getOreForFloor(floor) {
	const metalIndex = Math.floor((floor - 1) / 10);
	const metals = gameData.metals;

	if (metalIndex < 0 || metalIndex >= metals.length) {
		return null; // Should not happen if floor is between 1 and 120
	}

	const metalName = metals[metalIndex];

	if (metalName === 'adamant') {
		return 'adamantite_ore';
	}

	return `${metalName.replace(/ /g, '_')}_ore`;
}

function applyStatBonuses() {
	// Define a universal baseline for all characters before bonuses
	const baseStats = {
		health: 100,
		maxHealth: 100,
		mana: 100,
		attack: 10,
		defense: 10,
		strength: 10,
		dexterity: 10,
		constitution: 10,
		intelligence: 10,
		wisdom: 10,
		charisma: 10,
		luck: 10,
		energy: 100
	};

	// Apply racial bonuses
	const raceBonus = raceBonuses[player.race.toLowerCase()];
	if (raceBonus) {
		for (const stat in raceBonus) {
			baseStats[stat] = (baseStats[stat] || 0) + raceBonus[stat];
		}
	}

	// Apply class bonuses
	const classBonus = classBonuses[player.class.toLowerCase()];
	if (classBonus) {
		for (const stat in classBonus) {
			baseStats[stat] = (baseStats[stat] || 0) + classBonus[stat];
		}
	}

	// Update the player's stats object, preserving level, xp, and gold
	Object.assign(player.stats, baseStats);
}

function promptAction() {
	rl.question('What do you do? ', (action) => {
		handleAction(action.toLowerCase().trim());
	});
}

const commandHandlers = {
	save: (argument) => {
		saveGame();
		displayLocation();
	},
	load: (argument) => {
		loadGame();
	},
	transform: (argument) => {
		handleTransform(argument);
		displayLocation();
	},
	revert: (argument) => {
		if (player.race.toLowerCase() !== 'shapeshifter') {
			console.log('Only shapeshifters can revert their form.');
		} else {
			revertForm();
		}
		displayLocation();
	},
	buy: (argument) => {
		handleBuy(argument);
		displayLocation();
	},
	cast: (argument) => {
		handleCast(argument);
	},
	repair: (argument) => {
		handleRepair(argument);
		displayLocation();
	},
	chop: (argument) => {
		if (locations[player.location].interactables?.trees) {
			handleChop();
		} else {
			console.log('There are no trees to chop here.');
		}
		displayLocation();
	},
	craft: (argument) => {
		handleCraft(argument);
		displayLocation();
	},
	use: (argument) => {
		handleUse(argument);
		displayLocation();
	},
	inventory: (argument) => {
		displayInventory();
		displayLocation();
	},
	equip: (argument) => {
		handleEquip(argument);
		displayLocation();
	},
	unequip: (argument) => {
		handleUnequip(argument);
		displayLocation();
	},
	stats: (argument) => {
		displayPlayerStats();
		displayLocation();
	},
	equipment: (argument) => {
		displayEquipment();
		displayLocation();
	},
	look: (argument) => {
		handleLook(argument);
		displayLocation();
	},
	'talk to': (argument) => {
		handleTalkTo(argument);
		displayLocation();
	},
	'view quests': (argument) => {
		handleViewQuests();
		displayLocation();
	},
	'accept quest': (argument) => {
		handleAcceptQuest(argument);
		displayLocation();
	},
	'turn in': (argument) => {
		handleTurnInQuest(argument);
		displayLocation();
	},
	'change class': (argument) => {
		handleChangeClass();
	}
};

function handleAction(action) {
	const currentLocation = locations[player.location];
	const [command, ...args] = action.split(' ');
	const argument = args.join(' ');
	const resolvedCommand = commandAliases[command] || command;

	// 1. Check for multi-word commands first
	const multiWordCommands = [
		'talk to',
		'view quests',
		'accept quest',
		'turn in',
		'change class'
	];
	for (const cmd of multiWordCommands) {
		if (action.startsWith(cmd)) {
			const arg = action.substring(cmd.length).trim();
			if (commandHandlers[cmd]) {
				commandHandlers[cmd](arg);
				return;
			}
		}
	}

	// 2. Check for single-word global commands
	if (commandHandlers[resolvedCommand]) {
		commandHandlers[resolvedCommand](argument);
		return;
	}

	// 3. Check for single-word, location-specific actions (like movement)
	if (
		currentLocation.actions &&
		currentLocation.actions[resolvedCommand] &&
		args.length === 0
	) {
		currentLocation.actions[command]();
		displayLocation();
		return;
	}

	// 4. If no valid action is found
	if (action) {
		// Avoids showing "Invalid action" on empty input
		console.log('Invalid action.');
	}
	displayLocation();
}

function handleTalkTo(npcName) {
	const currentLocation = locations[player.location];
	const npcId = currentLocation.npcs?.find(
		(id) => npcs[id].name.toLowerCase() === npcName.toLowerCase()
	);

	if (npcId) {
		const npc = npcs[npcId];
		// Get dialogue lines, calling the function if it exists
		const dialogueLines =
			typeof npc.dialogue === 'function'
				? npc.dialogue(player)
				: npc.dialogue;
		// Display dialogue and cycle to the next line
		console.log(`\n[${npc.name}]: "${dialogueLines[npc.dialogueIndex]}"`);
		npc.dialogueIndex = (npc.dialogueIndex + 1) % dialogueLines.length;
	} else {
		console.log(`There is no one here by the name of '${npcName}'.`);
	}
}

function handleChop() {
	advanceTime(1);
	performSkillCheck(
		'chopping',
		60,
		() => {
			// Success
			console.log(
				'You spend some time chopping at the trees and find a good piece of wood.'
			);
			player.inventory.push(createItemInstance('stick', false));
			console.log('You managed to get a sturdy Stick.');
		},
		() => {
			// Failure
			console.log(
				'You swing your axe, but the wood is rotten and crumbles to dust.'
			);
		}
	);
}

function handleMine() {
	let bestPickaxe = null;

	// Check equipped weapon first
	if (player.equipment.weapon?.name.toLowerCase().includes('pickaxe')) {
		bestPickaxe = player.equipment.weapon;
	}

	// Check inventory for a better pickaxe
	for (const item of player.inventory) {
		if (item.name.toLowerCase().includes('pickaxe')) {
			if (!bestPickaxe || item.miningBonus > bestPickaxe.miningBonus) {
				bestPickaxe = item;
			}
		}
	}

	if (!bestPickaxe) {
		return console.log('You need a pickaxe to mine here.');
	}

	console.log(`(You use your ${bestPickaxe.name}.)`);

	const oreItemId = getOreForFloor(player.mineFloor);
	if (!oreItemId) {
		console.log(
			`You swing your ${bestPickaxe.name}, but the rock is barren here.`
		);
		return;
	}

	const oreItem = gameData.items[oreItemId];
	const pickaxeBonus = bestPickaxe.miningBonus || 0;

	advanceTime(1);
	performSkillCheck(
		'mining',
		50 + pickaxeBonus, // Base success chance + pickaxe bonus
		() => {
			// Success
			console.log('Your skilled swing strikes the perfect spot!');
			const amount = player.race.toLowerCase() === 'dwarf' ? 2 : 1;
			for (let i = 0; i < amount; i++) {
				player.inventory.push(createItemInstance(oreItemId, false));
			}
			decreaseDurability(bestPickaxe);
			console.log(
				`You managed to get ${amount} chunk(s) of ${oreItem.name}!`
			);
		},
		() =>
			console.log(
				`You swing your pickaxe, but only dust and pebbles break away. You find no ${oreItem.name}.`
			),
		{
			pickaxeBonus: pickaxeBonus
		}
	);
}

function handleRepair(itemName) {
	if (player.location !== 'blacksmith') {
		return console.log('You must be at a blacksmith to repair items.');
	}

	if (!itemName) {
		return console.log(
			"What would you like to repair? Use 'repair <item name>'."
		);
	}

	// Find the item in inventory or equipment
	let itemInstance = player.inventory.find(
		(i) => i.name.toLowerCase() === itemName.toLowerCase()
	);
	let isEquipped = false;

	if (!itemInstance) {
		for (const slot in player.equipment) {
			if (
				player.equipment[slot] &&
				player.equipment[slot].name.toLowerCase() ===
					itemName.toLowerCase()
			) {
				itemInstance = player.equipment[slot];
				isEquipped = true;
				break;
			}
		}
	}

	if (!itemInstance) {
		return console.log(`You don't have a '${itemName}'.`);
	}

	const baseItem = gameData.items[itemInstance.itemId];
	if (
		itemInstance.durability === undefined ||
		baseItem.maxDurability === undefined
	) {
		return console.log(`The ${itemInstance.name} cannot be repaired.`);
	}

	if (itemInstance.durability >= baseItem.maxDurability) {
		return console.log(
			`The ${itemInstance.name} is already in perfect condition.`
		);
	}

	const damage = baseItem.maxDurability - itemInstance.durability;
	// Cost is 1 gold per 2 points of damage, with a minimum of 1 gold.
	const cost = Math.max(1, Math.ceil(damage / 2));

	if (player.stats.gold < cost) {
		return console.log(
			`You need ${cost} gold to repair the ${itemInstance.name}, but you only have ${player.stats.gold}.`
		);
	}

	player.stats.gold -= cost;
	itemInstance.durability = baseItem.maxDurability;

	console.log(
		`You pay James ${cost} gold to repair your ${itemInstance.name}. It is now fully repaired.`
	);
}

function makeCheck(type, successChance, successCallback, failureCallback) {
	const roll = Math.random() * 100;
	const success = roll < successChance;

	player.lastCheck = {
		type,
		success,
		failed: !success,
		callback: success ? successCallback : failureCallback
	};

	if (success) successCallback();
	else failureCallback();

	return success;
}

function performSkillCheck(
	skill,
	baseSuccessChance,
	successCallback,
	failureCallback,
	options = {}
) {
	const playerStats = getEffectiveStats();
	let modifier = 0;

	// Determine which stat modifies the skill
	// This can be expanded into a larger mapping
	if (skill === 'dexterity' || skill === 'stealth') {
		modifier = (playerStats.dexterity - 10) * 2; // +2% chance per point above 10
	} else if (skill === 'intelligence') {
		modifier = (playerStats.intelligence - 10) * 2;
	} else if (skill === 'wisdom' || skill === 'perception') {
		modifier = (playerStats.wisdom - 10) * 2;
	} else if (
		skill === 'strength' ||
		skill === 'mining' ||
		skill === 'chopping'
	) {
		modifier = (playerStats.strength - 10) * 2;
	}

	// Add racial bonus for dwarves
	if (
		(skill === 'mining' || skill === 'crafting') &&
		player.race.toLowerCase() === 'dwarf'
	) {
		modifier += 10; // Dwarves get a +10% bonus to mining/crafting
		console.log('(Your dwarven stonecunning aids you.)');
	}

	const finalSuccessChance = Math.max(
		5,
		Math.min(95, baseSuccessChance + modifier)
	); // Clamp between 5% and 95%

	console.log(
		`(You attempt a ${skill} check... Success chance: ${finalSuccessChance}%)`
	);
	return makeCheck(
		'skillCheck',
		finalSuccessChance,
		successCallback,
		failureCallback
	);
}

function handleLook(argument) {
	const location = locations[player.location];
	if (!argument || argument === 'around') {
		console.log(location.longDescription);
		if (location.onEnter) {
			location.onEnter(true); // Pass true to indicate it's a 'look' command
		}
	} else {
		const target = argument.replace('at ', '');
		// Check for interactable objects
		if (location.interactables && location.interactables[target]) {
			const interactable = location.interactables[target];
			console.log(interactable.description);

			// Check if it's a crafting station
			const locationStations = Array.isArray(location.craftingStation)
				? location.craftingStation
				: [location.craftingStation];
			if (locationStations.includes(target)) {
				console.log('\nYou can craft the following items here:');
				let foundRecipe = false;
				for (const recipeId in gameData.recipes) {
					const recipe = gameData.recipes[recipeId];
					if (recipe.station && recipe.station === target) {
						foundRecipe = true;
						const itemName = gameData.items[recipeId].name;
						const materials = Object.entries(recipe.materials)
							.map(
								([matId, count]) =>
									`${gameData.items[matId].name} (x${count})`
							)
							.join(', ');
						console.log(`- ${itemName}: Requires ${materials}`);
					}
				}
				if (!foundRecipe) {
					console.log(
						'You do not know any recipes for this station.'
					);
				}
			}
		} else {
			console.log(`You see nothing special about the ${target}.`);
		}
	}
}

function handleBuy(itemName) {
	const shopLocation = locations[player.location];
	if (!shopLocation || !shopLocation.inventory) {
		return console.log('There is nothing to buy here.');
	}
	const itemId = Object.keys(gameData.items).find(
		(id) => gameData.items[id].name.toLowerCase() === itemName.toLowerCase()
	);

	if (!itemId || !shopLocation.inventory[itemId]) {
		return console.log(`This shop doesn't sell '${itemName}'.`);
	}

	const item = gameData.items[itemId];
	const stock = shopLocation.inventory[itemId];

	if (stock.current <= 0) {
		return console.log(`The shop is sold out of ${item.name}.`);
	}

	if (player.stats.gold < item.price)
		return console.log("You don't have enough gold for that.");

	player.stats.gold -= item.price;
	stock.current--;

	const newItem = createItemInstance(itemId, false); // Purchased items have no rarity
	player.inventory.push(newItem);

	console.log(
		`You bought a ${item.name} for ${item.price} gold. You have ${player.stats.gold} gold remaining.`
	);
}

function handleUse(itemName) {
	player.lastCheck = null; // Clear any re-roll opportunity
	// Find an item instance in the inventory by its unique name
	const itemInstance = player.inventory.find(
		(inst) => inst.name.toLowerCase() === itemName.toLowerCase()
	);

	if (!itemInstance) {
		return console.log(`You don't have a '${itemName}' in your inventory.`);
	}

	const item = gameData.items[itemInstance.itemId];
	if (item.type !== 'consumable' || !item.effect) {
		return console.log(`You can't use the ${item.name} like that.`);
	}

	// Use the item
	item.effect(player);

	// Special case for lockpicks, which are consumed on failure
	if (itemInstance.itemId === 'lockpick') {
		// This logic is now handled in handleOpen
		return;
	}

	console.log(
		`You used the ${item.name}. Your health is now ${player.stats.health}.`
	);

	// Remove from inventory
	const itemIndex = player.inventory.findIndex(
		(i) => i.uniqueId === itemInstance.uniqueId
	);
	player.inventory.splice(itemIndex, 1);
}

function displayInventory() {
	player.lastCheck = null; // Clear any re-roll opportunity
	console.log('\n--- Inventory ---');
	if (player.inventory.length === 0) {
		console.log('Your inventory is empty.');
	} else {
		const itemCounts = {};
		player.inventory.forEach((instance) => {
			const key = instance.name; // Use the unique instance name as the key
			if (!itemCounts[key]) {
				itemCounts[key] = { count: 0, instances: [] };
			}
			itemCounts[key].count++;
			itemCounts[key].instances.push(instance);
		});

		Object.keys(itemCounts).forEach((name) => {
			const data = itemCounts[name];
			const firstInst = data.instances[0];
			const durability =
				firstInst.durability !== undefined
					? `(${firstInst.durability}/${
							gameData.items[firstInst.itemId].maxDurability
					  })`
					: '';
			console.log(`- ${name} (x${data.count}) ${durability}`);
		});
	}
	console.log(`Gold: ${player.stats.gold}`);
	console.log('-----------------\n');
}

function handleEquip(itemName) {
	player.lastCheck = null; // Clear any re-roll opportunity
	const itemInstance = player.inventory.find(
		(inst) => inst.name.toLowerCase() === itemName.toLowerCase()
	);

	if (!itemInstance) {
		return console.log(`You don't have a '${itemName}' in your inventory.`);
	}

	const baseItem = gameData.items[itemInstance.itemId];
	const slot = baseItem.equipSlot;

	if (!slot) {
		return console.log(`You cannot equip the ${itemToEquip.name}.`);
	}

	// Check for broken item
	if (itemInstance.durability <= 0) {
		return console.log(
			`You cannot equip the ${itemInstance.name}, it is broken.`
		);
	}

	// Unequip current item in that slot, if any
	const currentItemInstance = player.equipment[slot];
	if (currentItemInstance) {
		player.inventory.push(currentItemInstance);
		const currentItem = gameData.items[currentItemInstance.itemId];
		// Use the instance name for unequipping message
		console.log(
			`You unequip the ${currentItemInstance.name} and put it in your inventory.`
		);
	}

	// Equip the new item
	player.equipment[slot] = itemInstance;
	const itemIndex = player.inventory.findIndex(
		(i) => i.uniqueId === itemInstance.uniqueId
	);
	player.inventory.splice(itemIndex, 1);

	console.log(`You equip the ${itemInstance.name}.`);
}

function handleUnequip(slot) {
	player.lastCheck = null; // Clear any re-roll opportunity
	if (!player.equipment.hasOwnProperty(slot)) {
		return console.log(`'${slot}' is not a valid equipment slot.`);
	}

	const itemInstance = player.equipment[slot];
	if (!itemInstance) {
		return console.log(`You have nothing equipped in the ${slot} slot.`);
	}

	const item = gameData.items[itemInstance.itemId];
	player.equipment[slot] = null;
	player.inventory.push(itemInstance);

	console.log(
		`You unequip the ${itemInstance.name} and place it in your inventory.`
	);
}

function displayEquipment() {
	player.lastCheck = null; // Clear any re-roll opportunity
	console.log('\n--- Equipment ---');
	const effectiveStats = getEffectiveStats();

	for (const slot in player.equipment) {
		const itemInstance = player.equipment[slot];
		const itemName = itemInstance ? itemInstance.name : '[Empty]';
		const durability =
			itemInstance && itemInstance.durability !== undefined
				? `(${itemInstance.durability}/${
						gameData.items[itemInstance.itemId].maxDurability
				  })`
				: '';
		console.log(
			`${
				slot.charAt(0).toUpperCase() + slot.slice(1)
			}: ${itemName} ${durability}`
		);
	}

	console.log('\n--- Effective Stats ---');
	console.log(`Health: ${player.stats.health}/${effectiveStats.maxHealth}`);
	console.log(`Attack: ${effectiveStats.attack}`);
	console.log(`Defense: ${effectiveStats.defense}`);
	console.log('-----------------------\n');
}

function advanceTime(hours) {
	console.log(`(${hours} hour(s) pass.)`);
	const previousDay = gameState.day;
	gameState.time += hours;

	if (gameState.time >= 24) {
		gameState.day += Math.floor(gameState.time / 24);
		gameState.time %= 24;
	}
	// Lizardman regeneration check
	if (player.race.toLowerCase() === 'lizardman') {
		for (let i = 0; i < hours; i++) {
			lizardmanRegeneration();
		}
	}

	if (gameState.day > previousDay) {
		console.log('A new day has dawned!');
		Object.values(locations).forEach((loc) => {
			if (loc.inventory && loc.lastRestockDay < gameState.day) {
				console.log(`The ${player.location} has restocked its items.`);
				Object.keys(loc.inventory).forEach((itemId) => {
					loc.inventory[itemId].current = loc.inventory[itemId].max;
				});
				loc.lastRestockDay = gameState.day;
			}
		});
		// Reset daily abilities
		player.flags.usedHalflingLuckToday = false;
	}
}

function travel(destination, timeCost) {
	player.location = destination;
	if (timeCost > 0) {
		advanceTime(timeCost);
	}
	// Check for onEnter events for the new location
	const newLocation = locations[destination];
	if (newLocation && typeof newLocation.onEnter === 'function') {
		// Reset interactable states if needed when re-entering a location
		// For now, we'll let them persist.
		// Example: newLocation.interactables.chest.isDisarmed = false;
		newLocation.onEnter();
	}
	saveGame('autosave.json', true);
}
function lizardmanRegeneration() {
	// This will now be called per hour passed
	if (
		player.race.toLowerCase() === 'lizardman' &&
		player.stats.health < getEffectiveStats().maxHealth
	) {
		const regenAmount = 1;
		player.stats.health = Math.min(
			getEffectiveStats().maxHealth,
			player.stats.health + regenAmount
		);
		// We can silence this to avoid spam, or keep it. For now, let's silence it.
	}
}

function getEffectiveStats() {
	// Start with a copy of base stats
	const effectiveStats = { ...player.stats };

	// If transformed, merge stats
	if (player.transform.isTransformed) {
		const form = enemies[player.transform.transformedInto];
		Object.assign(effectiveStats, mergeStats(player.stats, form.stats));
	}

	// Add stats from equipped items
	for (const slot in player.equipment) {
		const itemInstance = player.equipment[slot];
		if (itemInstance) {
			const itemStats = itemInstance.stats; // Use the instance's stats
			for (const stat in itemStats) {
				effectiveStats[stat] =
					(effectiveStats[stat] || 0) + (itemStats[stat] || 0);
			}
		}
	}
	return effectiveStats;
}

function createItemInstance(itemId, withRarity) {
	const baseItem = gameData.items[itemId];
	if (!baseItem) {
		console.log(
			`Error: Tried to create an unknown item with id: ${itemId}`
		);
		return null;
	}

	// Create a deep copy to avoid modifying the base item object
	const instance = JSON.parse(JSON.stringify(baseItem));

	// Assign unique properties for this specific instance
	instance.itemId = itemId;
	instance.uniqueId = player.uniqueItemIdCounter++;
	instance.durability = baseItem.maxDurability;

	if (withRarity) {
		const rarity = rollForRarity();
		instance.rarity = rarity.name;

		// Modify name based on rarity
		instance.name = `${rarity.name} ${baseItem.name}`;

		// Modify stats based on rarity multiplier
		if (instance.stats) {
			for (const stat in instance.stats) {
				instance.stats[stat] = Math.round(
					instance.stats[stat] * rarity.multiplier
				);
			}
		}

		// Assign material based on rarity for bladed weapons
		const isBladed = gameData.weapons.types.bladed.some((type) =>
			baseItem.name.toLowerCase().includes(type)
		);

		if (isBladed) {
			const rarityIndex = itemGeneration.rarities.findIndex(
				(r) => r.name === rarity.name
			);
			// We have more rarities than metals, so we'll clamp the index to the available metals
			const metalIndex = Math.min(
				rarityIndex,
				gameData.metals.length - 1
			);
			const material = gameData.metals[metalIndex];
			instance.material = material;

			// Update the name to include the material
			instance.name = `${rarity.name} ${material} ${baseItem.name}`;
		}
	} else {
		// For items without rarity (e.g., bought from a shop)
		instance.name = baseItem.name;
	}

	return instance;
}

function rollForRarity() {
	const roll = Math.random();
	let cumulativeChance = 0;

	for (const rarity of itemGeneration.rarities) {
		cumulativeChance += rarity.chance;
		if (roll < cumulativeChance) {
			return rarity;
		}
	}

	return itemGeneration.rarities.find((r) => r.name === 'Common'); // Fallback
}

function decreaseDurability(itemInstance, amount = 1) {
	if (!itemInstance || !itemInstance.durability) return;

	itemInstance.durability -= amount;
	if (itemInstance.durability <= 0) {
		const baseItem = gameData.items[itemInstance.itemId];
		console.log(`Your ${baseItem.name} has broken!`);
		// Find and remove the item from inventory
		const invIndex = player.inventory.findIndex(
			(i) => i.uniqueId === itemInstance.uniqueId
		);
		if (invIndex > -1) player.inventory.splice(invIndex, 1);
		// The calling function will handle removing it from equipment if necessary
	}
}

function mergeStats(playerStats, formStats) {
	const merged = { ...playerStats }; // Start with player's stats
	for (const stat in formStats) {
		// For numerical stats, add them together.
		if (typeof formStats[stat] === 'number' && stat !== 'health') {
			merged[stat] = (merged[stat] || 0) + formStats[stat];
		}
		// For other properties (like abilities, skills in the future), you could merge arrays.
	}
	// Ensure current health isn't more than the new max health
	merged.health = Math.min(merged.health, merged.maxHealth);
	return merged;
}

function startCombat(enemyId) {
	const enemyTemplate = enemies[enemyId];
	if (!enemyTemplate) {
		console.log('Error: Enemy not found!');
		return;
	}
	// Create a copy of the enemy so we don't modify the template
	gameState.currentEnemy = JSON.parse(JSON.stringify(enemyTemplate));

	console.log(`\nA wild ${gameState.currentEnemy.name} appears!`);
	console.log(gameState.currentEnemy.description);

	promptCombatAction();
}

function promptCombatAction() {
	const playerStats = getEffectiveStats();
	const playerBaseStats = player.stats;
	const enemy = gameState.currentEnemy;
	console.log(
		`\nYour HP: ${playerBaseStats.health}/${playerStats.maxHealth} | Mana: ${playerBaseStats.mana}/100 | ${enemy.name} HP: ${enemy.stats.health}/${enemy.stats.maxHealth}`
	);
	rl.question(
		'Combat: [a]ttack, [c]ast <spell>, [u]se item, [f]lee? ',
		(action) => {
			handleCombatAction(action.toLowerCase().trim());
		}
	);
}

function handleCombatAction(action) {
	const playerStats = getEffectiveStats();
	const enemy = gameState.currentEnemy;
	const playerRace = player.race.toLowerCase();

	// Reset per-combat abilities if it's a new fight
	if (player.cooldowns['battleRage'] === 0)
		delete player.cooldowns['battleRage'];
	if (player.cooldowns['hellishRebuke'] === 0)
		delete player.cooldowns['hellishRebuke'];

	// Process status effects for the player
	if (processEffects(player, 'player')) {
		// If an effect prevents action (e.g. frozen), skip turn
		enemyTurn();
		return;
	}

	let [command, ...args] = action.split(' ');
	const argument = args.join(' ');

	if (player.location === 'mine_floor') {
		if (command === 'up') {
			if (player.mineFloor === 1) {
				console.log(
					'You ascend the lift and return to the mine entrance.'
				);
				player.mineFloor = 0;
				travel('old abandoned mine', 1);
			} else {
				player.mineFloor--;
				console.log(
					`You take the lift up to floor ${player.mineFloor}.`
				);
				displayLocation();
			}
			return;
		} else if (command === 'down') {
			if (player.mineFloor >= 120) {
				console.log(
					"You've reached the bottom of the mine. You can't go any deeper."
				);
			} else {
				player.mineFloor++;
				console.log(
					`You take the lift down to floor ${player.mineFloor}.`
				);
			}
			displayLocation();
			return;
		} else if (command === 'mine') {
			handleMine();
			displayLocation();
			return;
		}
	}

	// Handle conditional "smelt" alias
	if (command === 'smelt') {
		const locationStations = Array.isArray(currentLocation.craftingStation)
			? currentLocation.craftingStation
			: [currentLocation.craftingStation];

		if (locationStations.includes('forge')) {
			command = 'craft'; // Treat 'smelt' as 'craft' at a forge
		}
	}

	// Resolve alias to its canonical command
	command = commandAliases[command] || command;

	if (command === 'a' || command === 'attack') {
		// Player's turn
		let attackStat = playerStats.attack;
		if (player.flags.battleRage) {
			attackStat = Math.floor(attackStat * 1.5); // 50% damage boost
			console.log('You attack with furious rage!');
		}

		let playerDamage = Math.max(1, attackStat - enemy.stats.defense); // Always do at least 1 damage
		enemy.stats.health -= playerDamage;

		// Weapon durability loss
		const weapon = player.equipment.weapon;
		if (weapon) {
			decreaseDurability(weapon);
		}

		console.log(`You attack the ${enemy.name} for ${playerDamage} damage.`);
		if (player.flags.battleRage) {
			player.flags.battleRage = false; // Berserk only lasts for one attack
		}

		if (enemy.stats.health <= 0) {
			return winCombat();
		}
	} else if (command === 'c' || command === 'cast') {
		if (!argument) {
			console.log('Cast what? (e.g., cast fireball)');
			return promptCombatAction();
		}
		handleCast(argument);
	} else if (command === 'u' || command === 'use') {
		if (!argument) {
			console.log('Use what? (e.g., use health potion)');
			return promptCombatAction();
		}
		handleUse(argument); // handleUse already prints messages
	} else if (command === 'f' || command === 'flee') {
		console.log('You manage to escape from the battle!');
		return endCombat(true); // Fleeing ends combat
	} else if (command === 'rage' && playerRace === 'orc') {
		if (player.cooldowns['battleRage']) {
			// Allow re-prompting for another action
			player.lastCheck = {
				type: 'ability',
				callback: () => handleCombatAction(action)
			};
			console.log('You can only use Battle Rage once per combat.');
			return promptCombatAction();
		}
		console.log(
			"You fly into a battle rage, your next attack will be devastating but you'll be left open!"
		);
		player.flags.battleRage = true;
		player.cooldowns['battleRage'] = 1; // Mark as used for this combat
	} else if (command === 'heal' && playerRace === 'angel') {
		if (player.cooldowns['layOnHands']) {
			// Allow re-prompting for another action
			player.lastCheck = {
				type: 'ability',
				callback: () => handleCombatAction(action)
			};
			console.log('You have already used Healing Hands today.');
			return promptCombatAction();
		}
		const healAmount = Math.floor(playerStats.maxHealth * 0.3); // Heal for 30% of max HP
		player.stats.health = Math.min(
			playerStats.maxHealth,
			player.stats.health + healAmount
		);
		player.cooldowns['layOnHands'] = gameState.day; // Usable again tomorrow
		console.log(
			`A divine light surrounds you, healing you for ${healAmount} HP.`
		);
		console.log(
			`Your health is now ${player.stats.health}/${playerStats.maxHealth}.`
		);
	} else if (command === 'reroll' && playerRace === 'halfling') {
		if (player.flags.usedHalflingLuckToday) {
			console.log("You've already used your Halfling Luck today.");
			return promptCombatAction();
		}
		if (player.lastCheck && player.lastCheck.failed) {
			console.log('With a bit of uncanny luck, you try again!');
			player.flags.usedHalflingLuckToday = true;
			player.lastCheck.callback(); // Re-run the failed action
		} else {
			console.log("There's nothing to re-roll right now.");
			return promptCombatAction();
		}
	} else {
		console.log(
			'Invalid combat action. The enemy takes the opportunity to strike!'
		);
	}

	// Enemy's turn (if player didn't win or flee or cast a spell that ends their turn)
	if (gameState.currentEnemy) {
		enemyTurn();
	}
}

function enemyTurn() {
	const playerStats = getEffectiveStats();
	const enemy = gameState.currentEnemy;
	const playerRace = player.race.toLowerCase();

	if (!enemy) return;

	// Process status effects for the enemy
	if (processEffects(enemy, 'enemy')) {
		// If an effect prevents action, skip turn
		promptCombatAction();
		return;
	}

	let defenseStat = playerStats.defense;
	if (player.flags.battleRage) {
		defenseStat = Math.floor(defenseStat * 0.5); // 50% defense penalty
		console.log('Your rage leaves you open to attack!');
	}

	let enemyDamage = Math.max(1, enemy.stats.attack - defenseStat);
	let damageType = 'physical'; // Assume physical by default

	// Apply racial resistances/vulnerabilities
	if (
		playerRace === 'undead' &&
		(damageType === 'holy' || damageType === 'fire')
	) {
		enemyDamage = Math.floor(enemyDamage * 1.5); // 50% more damage
		console.log('The attack is super effective against your undead form!');
	}
	if (playerRace === 'demon' && damageType === 'holy') {
		enemyDamage = Math.floor(enemyDamage * 1.5);
		console.log('The holy attack sears your demonic flesh!');
	}
	if (
		playerRace === 'aasimar' &&
		(damageType === 'holy' || damageType === 'necrotic')
	) {
		enemyDamage = Math.floor(enemyDamage * 0.5); // 50% less damage
		console.log('Your celestial blood resists the damage!');
	}

	// Armor durability loss
	for (const slot in player.equipment) {
		if (gameData.items[player.equipment[slot]?.itemId]?.type === 'armor') {
			decreaseDurability(player.equipment[slot]);
		}
	}

	player.stats.health -= enemyDamage;
	console.log(`The ${enemy.name} attacks you for ${enemyDamage} damage.`);

	// Handle Tiefling's Hellish Rebuke
	if (playerRace === 'tiefling' && !player.cooldowns['hellishRebuke']) {
		const rebukeDamage = Math.floor(playerStats.intelligence / 2);
		if (rebukeDamage > 0) {
			console.log(
				`As you are hit, you lash out with infernal fire, dealing ${rebukeDamage} damage back!`
			);
			enemy.stats.health -= rebukeDamage;
			player.cooldowns['hellishRebuke'] = 1; // Mark as used for this combat
		}
	}

	if (player.stats.health <= 0) {
		loseCombat();
	} else {
		promptCombatAction(); // Continue the fight
	}
}

function handleCast(spellName) {
	if (!gameState.currentEnemy) {
		console.log('You can only cast spells in combat.');
		displayLocation();
		return;
	}

	if (!player.spells.includes(spellName)) {
		console.log(`You don't know the spell '${spellName}'.`);
		promptCombatAction();
		return;
	}

	// Find the damage type associated with the spell
	let damageType;
	for (const category in gameData.spells.destruction) {
		if (gameData.spells.destruction[category].includes(spellName)) {
			damageType = gameData.damage.types[category];
			break;
		}
	}

	if (!damageType) {
		console.log(`The spell '${spellName}' has no defined effect.`);
		promptCombatAction();
		return;
	}

	if (player.stats.mana < damageType.manaCost) {
		console.log("You don't have enough mana to cast that spell.");
		promptCombatAction();
		return;
	}

	player.stats.mana -= damageType.manaCost;
	const enemy = gameState.currentEnemy;
	const damage =
		damageType.baseDamage + Math.floor(player.stats.intelligence / 5);
	enemy.stats.health -= damage;

	console.log(
		`You cast ${spellName}, dealing ${damage} ${damageType.name} damage to the ${enemy.name}.`
	);

	// The rest of the turn logic will be handled by enemyTurn
	enemyTurn();
}

function processEffects(target, targetType) {
	let preventedAction = false;

	// We iterate backwards because we might be removing items from the array.
	for (let i = target.activeEffects.length - 1; i >= 0; i--) {
		const activeEffect = target.activeEffects[i];
		const effectDef = gameData.damage.effects[activeEffect.id];

		if (!effectDef) {
			target.activeEffects.splice(i, 1); // Clean up invalid effects
			continue;
		}

		// Apply damage-over-time
		if (effectDef.damagePerTurn > 0) {
			target.stats.health -= effectDef.damagePerTurn;
			if (effectDef.onTick) {
				effectDef.onTick(target);
			}
			if (target.stats.health <= 0) {
				// The target died from the effect
				if (targetType === 'enemy') winCombat();
				else loseCombat();
				return true; // Stop further processing
			}
		}

		// Check for action-preventing effects
		if (activeEffect.id === 'frozen' || activeEffect.id === 'shocked') {
			preventedAction = true;
			console.log(`${target.name} is ${effectDef.name} and cannot act!`);
		}

		// Tick down duration
		activeEffect.turnsLeft--;

		// Remove expired effects
		if (activeEffect.turnsLeft <= 0) {
			if (effectDef.onRemove) {
				effectDef.onRemove(target);
			}
			target.activeEffects.splice(i, 1);
		}
	}

	return preventedAction;
}

function applyEffect(target, effectId, duration) {
	const effectDef = gameData.damage.effects[effectId];
	if (!effectDef) return; // Effect doesn't exist

	// Dwarven Resilience Check
	if (target === player && player.race.toLowerCase() === 'dwarf') {
		const isMagicEffect = ['burning', 'freezing', 'shocked'].includes(
			effectId
		);
		const isPoison = effectId === 'poison';

		if (isMagicEffect || isPoison) {
			const resisted = makeCheck(
				'savingThrow',
				60,
				() => {
					console.log(
						'Your hardy nature helps you shrug off the effect!'
					);
				},
				() => {
					console.log('You fail to resist the effect.');
				}
			);
			if (resisted) return; // If the save was successful, don't apply the effect.
		}
	}

	// Check for existing effect to refresh, not stack
	const existingEffect = target.activeEffects.find((e) => e.id === effectId);
	if (existingEffect) {
		existingEffect.turnsLeft = Math.max(existingEffect.turnsLeft, duration);
	} else {
		target.activeEffects.push({ id: effectId, turnsLeft: duration });
	}

	if (effectDef.onApply) {
		effectDef.onApply(target);
	}
}

function makeCheck(type, successChance, successCallback, failureCallback) {
	const roll = Math.random() * 100;
	const success = roll < successChance;

	player.lastCheck = {
		type,
		success,
		failed: !success,
		callback: success ? successCallback : failureCallback
	};

	if (success) successCallback();
	else failureCallback();

	return success;
}

function performSkillCheck(
	skill,
	baseSuccessChance,
	successCallback,
	failureCallback
) {
	const playerStats = getEffectiveStats();
	let modifier = 0;

	// Determine which stat modifies the skill
	// This can be expanded into a larger mapping
	if (skill === 'dexterity' || skill === 'stealth') {
		modifier = (playerStats.dexterity - 10) * 2; // +2% chance per point above 10
	} else if (skill === 'intelligence') {
		modifier = (playerStats.intelligence - 10) * 2;
	} else if (skill === 'wisdom' || skill === 'perception') {
		modifier = (playerStats.wisdom - 10) * 2;
	} else if (skill === 'strength') {
		modifier = (playerStats.strength - 10) * 2;
	}

	const finalSuccessChance = Math.max(
		5,
		Math.min(95, baseSuccessChance + modifier)
	); // Clamp between 5% and 95%

	console.log(
		`(You attempt a ${skill} check... Success chance: ${finalSuccessChance}%)`
	);
	return makeCheck(
		'skillCheck',
		finalSuccessChance,
		successCallback,
		failureCallback
	);
}

function winCombat() {
	const enemy = gameState.currentEnemy;
	console.log(`\nYou have defeated the ${enemy.name}!`);

	player.stats.gold += enemy.stats.gold;
	player.stats.experience += enemy.stats.xp;
	console.log(
		`You gain ${enemy.stats.gold} gold and ${enemy.stats.xp} experience points.`
	);
	checkForLevelUp();

	// Handle loot drops
	if (enemy.drops) {
		enemy.drops.forEach((drop) => {
			if (Math.random() < drop.chance) {
				// Generate a new item instance for the player, with rarity
				const newItem = createItemInstance(drop.itemId, true);
				player.inventory.push(newItem);
				// The name now includes rarity
				console.log(`The ${enemy.name} dropped: ${newItem.name}!`);
			}
		});
	}

	// Check for quest progress
	Object.keys(player.questLog).forEach((questId) => {
		const questEntry = player.questLog[questId];
		const questDef = quests[questId];
		if (
			questEntry.status === 'accepted' &&
			questDef.objective.target === enemyId
		) {
			questEntry.progress++;
			console.log(
				`Quest progress: ${questDef.name} (${questEntry.progress}/${questDef.objective.count})`
			);
		}
	});
	endCombat(false);
}

function loseCombat() {
	console.log('\nYou have been defeated. Your vision fades to black...');
	// Reset player to a safe location with some health, or end game.
	// For now, we'll just end the game.
	console.log('--- GAME OVER ---');
	rl.close();
}

function endCombat(fled) {
	gameState.currentEnemy = null;
	player.lastCheck = null; // Clear last check after combat
	// Reset per-combat abilities and flags
	player.flags.battleRage = false;
	if (player.cooldowns['battleRage'] === 1)
		player.cooldowns['battleRage'] = 0; // Ready for next combat
	if (player.cooldowns['hellishRebuke'] === 1)
		player.cooldowns['hellishRebuke'] = 0;

	if (!fled) {
		console.log('You catch your breath and look around the dungeon.');
	}
	displayLocation(); // Go back to the normal game loop
}

function checkForLevelUp() {
	while (player.stats.experience >= player.stats.xpToNextLevel) {
		levelUp();
	}
}

function levelUp() {
	player.stats.experience -= player.stats.xpToNextLevel;
	player.stats.level++;

	// Stat increases
	const healthIncrease = 10;
	const attackIncrease = 2;
	const defenseIncrease = 1;

	// Apply stat increases to the base stats
	player.stats.maxHealth += healthIncrease;
	player.stats.attack += attackIncrease;
	player.stats.defense += defenseIncrease;

	// Restore health to full on level up
	player.stats.health = getEffectiveStats().maxHealth;

	// Calculate XP for the *new* next level (exponential growth)
	player.stats.xpToNextLevel = Math.floor(
		100 * Math.pow(player.stats.level, 1.5)
	);

	console.log('\n*******************************************');
	console.log(`** LEVEL UP! You are now level ${player.stats.level}! **`);
	console.log(
		`** Max Health +${healthIncrease}, Attack +${attackIncrease}, Defense +${defenseIncrease} **`
	);
	console.log(`** Next level at ${player.stats.xpToNextLevel} XP. **`);
	console.log('*******************************************\n');
}

function displayPlayerStats() {
	console.log('\n--- Character Sheet ---');
	const baseStats = player.stats;
	const effectiveStats = getEffectiveStats();

	console.log(`Name: ${player.name}`);
	// Capitalize first letter of race and class if they exist
	const pRace = player.race
		? player.race.charAt(0).toUpperCase() + player.race.slice(1)
		: 'N/A';
	const pClass = player.class
		? player.class.charAt(0).toUpperCase() + player.class.slice(1)
		: 'Adventurer';
	console.log(`Race: ${pRace} | Class: ${pClass}`);
	console.log(''); // spacer

	console.log(`Level: ${baseStats.level}`);
	console.log(
		`Experience: ${baseStats.experience} / ${baseStats.xpToNextLevel}`
	);

	if (player.transform.isTransformed) {
		console.log(
			`Current Form: ${player.transform.transformedInto.toUpperCase()}`
		);
	}

	console.log(''); // spacer

	// Display stats that can be modified by gear
	const modifiableStats = [
		'maxHealth',
		'attack',
		'defense',
		'strength',
		'dexterity',
		'constitution',
		'intelligence',
		'wisdom',
		'charisma',
		'luck'
	];

	// Special case for current health vs max health
	console.log(`Health: ${baseStats.health} / ${effectiveStats.maxHealth}`);

	modifiableStats.forEach((stat) => {
		if (stat === 'maxHealth') return; // already handled
		const base = baseStats[stat];
		const effective = effectiveStats[stat];
		const diff = effective - base;

		const statName = stat.charAt(0).toUpperCase() + stat.slice(1);
		console.log(
			diff !== 0
				? `${statName}: ${effective} (${base} +${diff})`
				: `${statName}: ${base}`
		);
	});

	console.log(''); // spacer
	// Display stats not typically modified by gear
	console.log(`Mana: ${baseStats.mana}`);
	console.log(`Energy: ${baseStats.energy}`);
	console.log(`Gold: ${baseStats.gold}`);
	console.log('-----------------------\n');
}

function handleViewQuests() {
	if (player.location !== 'adventurers guild') {
		return console.log(
			"You must be at the Adventurer's Guild to view quests."
		);
	}
	console.log('\n--- Available Quests ---');
	let available = 0;
	Object.entries(quests).forEach(([id, quest]) => {
		if (!player.questLog[id]) {
			console.log(`\n[${quest.name}]`);
			console.log(`  Description: ${quest.description}`);
			console.log(
				`  Objective: Kill ${quest.objective.count} ${quest.objective.target}(s)`
			);
			console.log(
				`  Reward: ${quest.reward.gold} gold, ${quest.reward.xp} XP`
			);
			available++;
		}
	});
	if (available === 0) {
		console.log('There are no new quests available at the moment.');
	}
	console.log('------------------------\n');
}

function handleAcceptQuest(questName) {
	if (player.location !== 'adventurers guild') {
		return console.log(
			"You must be at the Adventurer's Guild to accept quests."
		);
	}
	const questId = Object.keys(quests).find(
		(q) => quests[q].name.toLowerCase() === questName.toLowerCase()
	);
	if (!questId) {
		return console.log(`There is no quest called '${questName}'.`);
	}
	if (player.questLog[questId]) {
		return console.log(
			`You have already accepted or completed the '${questName}' quest.`
		);
	}

	player.questLog[questId] = { status: 'accepted', progress: 0 };
	console.log(
		`You have accepted the quest: "${quests[questId].name}". Check your stats to see your quest log.`
	);
}

function handleTurnInQuest(questName) {
	if (player.location !== 'adventurers guild') {
		return console.log(
			"You must be at the Adventurer's Guild to turn in quests."
		);
	}
	const questId = Object.keys(quests).find(
		(q) => quests[q].name.toLowerCase() === questName.toLowerCase()
	);
	if (!questId) {
		return console.log(`There is no quest called '${questName}'.`);
	}
	const questEntry = player.questLog[questId];
	if (!questEntry || questEntry.status !== 'accepted') {
		return console.log(
			`You don't have an active quest named '${questName}'.`
		);
	}

	const questDef = quests[questId];
	if (questEntry.progress >= questDef.objective.count) {
		// Grant rewards
		player.stats.gold += questDef.reward.gold;
		player.stats.experience += questDef.reward.xp;
		console.log(`\nQuest Complete: ${questDef.name}!`);
		console.log(
			`You receive ${questDef.reward.gold} gold and ${questDef.reward.xp} XP.`
		);

		// Mark as completed and remove from active log
		questEntry.status = 'completed';
		checkForLevelUp();
	} else {
		console.log(
			`You have not completed the objective for '${questDef.name}' yet.`
		);
		console.log(
			`Progress: ${questEntry.progress}/${questDef.objective.count}`
		);
	}
}

async function handleChangeClass() {
	if (player.location !== 'adventurers guild') {
		console.log(
			"You can only change your class at the Adventurer's Guild."
		);
		return displayLocation();
	}
	const cost = 100;
	if (player.stats.gold < cost) {
		console.log(
			`You need ${cost} gold to change your class. You only have ${player.stats.gold}.`
		);
		return displayLocation();
	}

	const ask = (question) =>
		new Promise((resolve) => rl.question(question, resolve));
	const classOptions = gameData.classes
		.filter((c) => c !== player.class)
		.join(', ');
	const newClass = await ask(
		`It will cost ${cost} gold to retrain. Choose a new class (${classOptions}): `
	);

	if (
		gameData.classes.includes(newClass.toLowerCase()) &&
		newClass.toLowerCase() !== player.class
	) {
		player.stats.gold -= cost;
		player.class = newClass.toLowerCase();
		// Re-apply stat bonuses for the new class
		applyStatBonuses();
		console.log(
			`You have paid ${cost} gold and are now a ${player.class}!`
		);
		console.log(
			'Your base stats have been updated to reflect your new class.'
		);
	} else {
		console.log(
			'Invalid choice or you chose your current class. No changes were made.'
		);
	}
	displayLocation();
}

function handleTransform(formName) {
	if (player.race.toLowerCase() !== 'shapeshifter') {
		console.log('Only shapeshifters can transform.');
		return;
	}
	const ability = racialAbilities.shapeshifter.transform;
	if (ability) {
		ability(formName);
	}
}

function transformInto(formName) {
	const form = enemies[formName];
	if (!form) {
		console.log(`Cannot transform into '${formName}'. Form not found.`);
		return;
	}

	// Save original stats before transforming
	player.transform.originalStats = JSON.parse(JSON.stringify(player.stats));
	player.transform.isTransformed = true;
	player.transform.transformedInto = formName;

	console.log(`You transform into a ${form.name}!`);
	// You might want to heal the player or adjust health/mana based on the new form's stats
	const newStats = getEffectiveStats();
	player.stats.health = Math.min(player.stats.health, newStats.maxHealth);
}

function revertForm() {
	if (!player.transform.isTransformed) {
		console.log('You are already in your original form.');
		return;
	}
	console.log(`You revert back to your original form.`);
	player.stats = player.transform.originalStats;
	player.transform = {
		isTransformed: false,
		transformedInto: null,
		originalStats: null
	};
}

function saveGame(slot = 'savegame.json', isAutosave = false) {
	try {
		// 1. Extract mutable data from locations
		const locationsState = {};
		for (const key in locations) {
			const loc = locations[key]; // This is correct
			locationsState[key] = {};
			if (loc.inventory) {
				locationsState[key].inventory = loc.inventory;
			}
			if (loc.lastRestockDay) {
				locationsState[key].lastRestockDay = loc.lastRestockDay;
			}
			if (loc.hasOwnProperty('visited')) {
				locationsState[key].visited = loc.visited;
			}
			// Save state of interactables
			if (loc.interactables) {
				locationsState[key].interactables = JSON.parse(
					JSON.stringify(loc.interactables)
				);
			}
		}

		// 2. Extract mutable data from NPCs
		const npcsState = {};
		for (const key in npcs) {
			npcsState[key] = {
				dialogueIndex: npcs[key].dialogueIndex
			};
		}

		const playerState = {
			...player,
			cooldowns: {
				...player.cooldowns
			}
		};

		// 3. Combine all state into one object
		const saveData = {
			player: player, // player object now includes questLog
			gameState: { time: gameState.time, day: gameState.day },
			locationsState: locationsState, // This is correct
			npcsState: npcsState
		};

		// 4. Write to file
		fs.writeFileSync(slot, JSON.stringify(saveData, null, 2)); // Using null, 2 for pretty-printing
		if (!isAutosave) {
			console.log('Game saved successfully!');
		}
	} catch (error) {
		console.error('Error saving game:', error);
	}
}

function loadGame(slot = 'savegame.json', callback) {
	try {
		if (!fs.existsSync(slot) && slot !== 'autosave.json') {
			console.log('No save file found.');
			promptAction(); // Go back to prompting the user
			return;
		}

		// 1. Read and parse the save file
		const rawData = fs.readFileSync(slot);
		const saveData = JSON.parse(rawData);

		// 2. Restore the game state
		Object.assign(player, saveData.player);
		Object.assign(gameState, saveData.gameState);

		// 3. Restore mutable location and NPC data
		for (const key in saveData.locationsState) {
			Object.assign(locations[key], saveData.locationsState[key]);
		}

		for (const key in saveData.npcsState) {
			Object.assign(npcs[key], saveData.npcsState[key]);
		}

		console.log('\nGame loaded successfully!');

		// Use a callback to ensure the game loop continues correctly
		if (callback) {
			callback();
		} else {
			displayLocation(); // Show the newly loaded location
		}
	} catch (error) {
		console.error('Error loading game:', error);
		promptAction(); // On error, go back to the prompt
	}
}

mainMenu(); // This should be the only top-level function call that starts the game

rl.on('close', () => {
	console.log('Thanks for playing!');
	process.exit(0);
});
