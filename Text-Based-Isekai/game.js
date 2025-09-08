const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function startGame() {
	console.log('Welcome to the Text Adventure!');
	promptPlayerInfo();
}

const gameData = {
	gameVariables: [
		'playerName',
		'playerClass',
		'playerRace',
		'playerGender',
		'playerAge',
		'playerHeight',
		'playerWeight',
		'playerLocation',
		'playerInventory',
		'playerEquipment',
		'playerSkills',
		'playerSpells',
		'playerPotions',
		'playerWeapons',
		'playerArmor',
		'playerAccessories',
		'playerTrinkets',
		'playerConsumables',
		'playerStats',
		'races',
		'genders',
		'ages',
		'heights',
		'weights',
		'locations',
		'weaponCategories',
		'classes',
		'npcs',
		'reputation',
		'alliance',
		'faction',
		'guild',
		'social standing',
		'factions',
		'faction leader',
		'faction member',
		'guilds',
		'guild leader',
		'guild member',
		'metals',
		'bladed weapons',
		'blunt weapons',
		'ranged weapons',
		'magic weapons',
		'armor categories',
		'non-armor',
		'light armor',
		'medium armor',
		'heavy armor',
		'magic armor',
		'accessories',
		'trinkets',
		'potions',
		'consumables',
		'spells',
		'skills'
	],

	skillCategories: [
		'athletics',
		'acrobatics',
		'stealth',
		'intimidation',
		'persuasion',
		'magic'
		// Add more skill categories as needed
	],

	athleticsSkills: [
		'cheetah sprint',
		'artful dodge',
		'windless'
		// Add more athletics skills as needed
	],

	acrobaticsSkills: [
		'sure footing',
		'lunge',
		'dodge',
		'top rope',
		'thin line'
		// Add more acrobatics skills as needed
	],

	stealthSkills: [
		'sneak attack',
		'hide',
		'trap',
		'smoke screen',
		'mist walk',
		'rhythm walk',
		'hidden mark',
		'shadow travel',
		'sleight Of Hand'
		// Add more stealth skills as needed
	],

	intimidationSkills: [
		'burly',
		'deeper voice'
		// Add more intimidation skills as needed
	],

	persuasionSkills: [
		'silver tongue'
		// Add more persuasion skills as needed
	],

	magicSkills: [
		'summoned armor',
		'summoned weapons'
		// Add more magic skills as needed
	],

	skills: [
		skillCategories.athletics,
		skillCategories.acrobatics,
		skillCategories.stealth,
		skillCategories.intimidation,
		skillCategories.persuasion,
		skillCategories.magic
		// Add more skills as needed
	],

	spellCategories: [
		'destruction',
		'summoning',
		'healing',
		'protection',
		'enchantment',
		'illusion',
		'curse',
		'alteration',
		'ancient',
		'forbidden',
		'demonic',
		'primordial',
		'divine'
		// Add more spell categories as needed
	],

	destructionSpellCategories: [
		'fire',
		'ice',
		'lightning',
		'water',
		'air',
		'earth'
		// Add more destruction spell categories as needed
	],

	fireSpells: [
		'flames',
		'fireball',
		'hell fire'
		// Add more fire spells as needed
	],

	iceSpells: [
		'frostbite',
		'icy wind'
		// Add more ice spells as needed
	],

	lightningSpells: [
		'lightning bolt',
		'thunderclap',
		'lightning strike',
		'chain lightning'
		// Add more lightning spells as needed
	],

	waterSpells: [
		'flood',
		'gush',
		'splash'
		// Add more water spells as needed
	],

	airSpells: [
		'wind blade',
		'storm spear',
		'cloud control'
		// Add more air spells as needed
	],

	earthSpells: [
		'rock bullet',
		'earthquake'
		// Add more earth spells as needed
	],

	destructionSpells: {}, // Populated later

	summoningSpellCategories: [
		'familiar summoning',
		'demonic summoning',
		'primordial summoning',
		'divine summoning',
		'forbidden summoning'
		// Add more summoning spell categories as needed
	],

	familiarSummoningSpellCategories: [
		'ally',
		'pet',
		'temporary'
		// Add more familiar summoning spells as needed
	],

	allySummoningSpells: [
		'elemental',
		'beast'
		// Add more ally summoning spells as needed
	],

	petSummoningSpells: [
		'cat',
		'dog',
		'lizard',
		'snake'
		// Add more pet summoning spells as needed
	],

	temporarySummoningSpells: [
		'elemental',
		'beast'
		// Add more temporary summoning spells as needed
	],

	divineSummoningSpells: [
		'angel',
		'demi-god',
		'god',
		'spirit',
		'ghosts'
		// Add more divine summoning spells as needed
	],

	forbiddenSummoningSpells: [], // Populated later

	primordialSummoningSpells: [
		'voidling',
		'Android',
		'Chimeras',
		'Dream-Eaters',
		'Genies',
		'Hydra-people',
		'Mists',
		'Monstrosities',
		'Oni'
		// Add more primordial summoning spells as needed
	],

	demonicSummoningSpells: [
		'demon',
		'monster',
		'undead',
		'spirit',
		'ghosts'
		// Add more demonic summoning spells as needed
	],

	healingSpellCategories: [
		'self healing',
		'area healing spells'
		// Add more healing spell categories as needed
	],

	selfHealingSpells: [
		'healing orb',
		'life drain',
		'life leach'
		// Add more self healing spells as needed
	],

	areaHealingSpells: [
		'healing circle'
		// Add more area healing spells as needed
	],

	protectionSpellCategories: [
		'ward',
		'cloaks',
		'barrier',
		'shield'
		// Add more protection spell categories as needed
	],

	wardSpells: [
		'holy ward',
		'shadow ward',
		'nature ward',
		'fire ward',
		'ice ward',
		'lightning ward',
		'water ward',
		'air ward',
		'earth ward',
		'elemental ward',
		'beast ward',
		'undead ward',
		'demon ward'
		// Add more ward spells as needed
	],

	cloaksSpells: [
		'shadow cloak',
		'nature cloak',
		'fire cloak',
		'ice cloak',
		'lightning cloak',
		'water cloak',
		'air cloak',
		'earth cloak',
		'elemental cloak',
		'beast cloak',
		'undead cloak',
		'demon cloak'
		// Add more cloak spells as needed
	],

	barrierSpells: [
		'holy barrier',
		'shadow barrier',
		'nature barrier',
		'fire barrier',
		'ice barrier',
		'lightning barrier',
		'water barrier',
		'air barrier',
		'earth barrier',
		'elemental barrier',
		'beast barrier',
		'undead barrier',
		'demon barrier'
		// Add more barrier spells as needed
	],

	shieldSpells: [
		'holy shield',
		'shadow shield',
		'nature shield',
		'fire shield',
		'ice shield',
		'lightning shield',
		'water shield',
		'air shield',
		'earth shield',
		'elemental shield',
		'beast shield',
		'undead shield',
		'demon shield'
		// Add more shield spells as needed
	],

	enchantmentSpellCategories: [
		'weapon enchantments',
		'armor enchantments',
		'accessory enchantments',
		'trinket enchantments',
		'spellbook enchantments'
		// Add more enchantment spell categories as needed
	],

	weaponEnchantmentCategories: [
		'cursed',
		'enhancement',
		'amplification',
		'skill'
		// Add more weapon enchantment categories as needed
	],

	cursedWeaponEnchantments: [
		'unlucky strike',
		'poison cloud',
		'heal target',
		'reflect'
		// Add more cursed weapon enchantments as needed
	],

	enhancementWeaponEnchantments: [
		'speed',
		'strength',
		'dexterity',
		'damage'
		// Add more enhancement weapon enchantments as needed
	],

	amplificationWeaponEnchantments: [
		'strengthen',
		'weightless',
		'wind up'
		// Add more amplification weapon enchantments as needed
	],

	skillWeaponEnchantments: [
		// Add more skill weapon enchantments as needed
	],

	armorEnchantmentCategories: [
		// Add more armor enchantment categories as needed
	],

	accessoryEnchantmentCategories: [
		// Add more accessory enchantment categories as needed
	],

	trinketEnchantmentCategories: [
		// Add more trinket enchantment categories as needed
	],

	spellbookEnchantmentCategories: [
		// Add more spellbook enchantment categories as needed
	],

	illusionSpellCategories: [
		// Add more illusion spell categories as needed
	],

	curseSpellCategories: [
		// Add more curse spell categories as needed
	],

	alterationSpellCategories: [
		// Add more alteration spell categories as needed
	],

	ancientSpellCategories: [
		// Add more ancient spell categories as needed
	],

	potions: [
		// Add more potions as needed
	],

	consumables: [
		// Add more / as needed
	],

	socialStanding: [
		// Add more / as needed
	],

	faction: [
		// Add more / as needed
	],

	factions: [
		// Add more / as needed
	],

	factionLeader: [
		// Add more / as needed
	],

	factionMember: [
		// Add more / as needed
	],

	alliance: [
		// Add more / as needed
	],

	guild: [
		// Add more / as needed
	],

	guilds: [
		// Add more / as needed
	],

	guildLeader: [
		// Add more / as needed
	],

	guildMember: [
		// Add more / as needed
	],

	races: [
		'human',
		'elf',
		'beastkin',
		'elemental',
		'undead',
		'dwarf',
		'orc',
		'gnome',
		'demon',
		'lizardman',
		'halfling',
		'tiefling',
		'aasimar',
		'angel',
		'shapeshifter',
		'fiend',
		'voidling',
		'merfolk',
		'Android',
		'Arachnid',
		'Bee-men',
		'Birdmaids',
		'Cats',
		'Centaurs',
		'Chimeras',
		'Cyclops',
		'Dagon',
		'Dragons (Semi-Dragons, Vouive, etc.)',
		'Demi-gods',
		'Dolls',
		'Dogs',
		'Dream-Eaters',
		'Dryads',
		'Fairies',
		'Fernirs',
		'Genies',
		'Ghosts',
		'Giants',
		'Goddesses',
		'Golems',
		'Hybrids (Unspecific)',
		'Hydra-people',
		'Hyenas',
		'Ifrits',
		'Incubi',
		'Jiangshis',
		'Lamias',
		'Leprechauns',
		'Low-Level Lilims',
		'Mandrakes',
		'Mists',
		'Monarchs',
		'Monstrosities',
		'Mimics',
		'Minotaurs',
		'Myconids',
		'Nymphs',
		'Ogres',
		'Oni',
		'Ordinary Livestock (Goat, Cow, Pig, etc)',
		'Ordinary Sea Creatures (Fish, Snails, Shrimp, etc)',
		'Penguins',
		'Pixies',
		'Phantoms',
		'Puppets',
		'Rabbits',
		'Salamanders',
		'Sasquatches',
		'Satyrs',
		'Skeletons',
		'Slimes',
		'Spirits',
		'Succubi',
		'Treants',
		'Vampires',
		'Will o Wisps',
		'Witches',
		'Zombies'
		// Add more races as needed
	],

	genders: [
		'male',
		'female',
		'non-binary'
		// Add more genders as needed
	],

	ages: [
		{ newborn: '0-2 years' },
		{ infant: '2 years' },
		{ child: '3-11 years' },
		{ adolescence: '12-18 years' },
		{ 'early adult': '19-25 years' },
		{ 'middle adult': '26-65 years' },
		{ 'late adult': '65-500 years' },
		{ ancient: '500+' }
		// Add more ages as needed
	],

	heights: [
		{ 'very short': '0-3 ft' },
		{ short: '3-4 ft' },
		{ medium: '4-5 ft' },
		{ tall: '5-6 ft' },
		{ 'very tall': '6+ ft' }
		// Add more heights as needed
	],

	weights: [
		'light',
		'medium',
		'average',
		'heavy',
		'very heavy'
		// Add more weights as needed
	],

	weaponCategories: [
		'bladed',
		'blunt',
		'ranged',
		'magic'
		// Add more weapon categories as needed
	],

	bladedWeapons: [
		'sword',
		'dagger',
		'spiked mace',
		'axe',
		'spear',
		'claw'
		// Add more melee weapons as needed
	],

	bluntWeapons: [
		'hammer',
		'non-spiked mace',
		'flail',
		'whip',
		'club'
		// Add more blunt weapons as needed
	],

	rangedWeapons: [
		'bow',
		'crossbow',
		'throwing dagger',
		'throwing knife',
		'throwing star',
		'throwing spear',
		'throwing axe',
		'ninja star',
		'boom stick',
		'firework rocket',
		'longbow',
		'shortbow',
		'sling'
		// Add more ranged weapons as needed
	],

	magicWeapons: [
		'staff',
		'wand',
		'scroll',
		'spellbook',
		'enchanted weapons'
		// Add more magic weapons as needed
	],

	armorCategories: [
		'non-armor',
		'light',
		'medium',
		'heavy',
		'magic'
		// Add more armor categories as needed
	],

	nonArmor: [
		'clothing',
		'robes'
		// Add more non-armor as needed
	],

	lightArmor: [
		'leather',
		'hide'
		// Add more light armor as needed
	],

	mediumArmor: [
		'chainmail',
		'scaled',
		'ringed'
		// Add more medium armor as needed
	],

	heavyArmor: [
		'plate'
		// Add more heavy armor as needed
	],

	magicArmor: [
		'enchanted armor',
		'mage robes'
		// Add more magic armor as needed
	],

	accessories: [
		'rings',
		'trinkets',
		'necklace',
		'earrings',
		'belt'
		// Add more accessories as needed
	],

	metals: [
		'iron',
		'steel',
		'mithril',
		'adamant',
		'titanium',
		'copper',
		'brass',
		'bronze',
		'pig iron',
		'dragonite',
		'celestial steel'
		// Add more metals as needed
	],

	trinkets: [
		'necklaces',
		'earrings',
		'rings',
		'belts',
		'bracelets',
		'charms'
		// Add more trinkets as needed
	],

	necklaces: [
		// Add more necklaces as needed
	],

	earrings: [
		// Add more earrings as needed
	],

	rings: [
		// Add more rings as needed
	],

	belts: [
		// Add more belts as needed
	],

	bracelets: [
		// Add more bracelets as needed
	],

	charms: [
		// Add more charms as needed
	],

	classes: [
		'warrior',
		'paladin',
		'ranger',
		'sorcerer',
		'druid',
		'barbarian',
		'monk',
		'bard',
		'mage',
		'rogue',
		'cleric'
		//Add more classes categories as needed
	],

	items: {
		torch: {
			name: 'Torch',
			description:
				'A wooden torch wrapped in oil-soaked rags. Provides light in dark places.',
			price: 10
		},
		health_potion: {
			name: 'Health Potion',
			description: 'A small vial of red liquid that restores 25 health.',
			type: 'consumable',
			effect: (target) => {
				target.stats.health = Math.min(100, target.stats.health + 25); // Assuming 100 is max health
			},
			price: 25
		},
		rusty_sword: {
			name: 'Rusty Sword',
			description: 'A simple, but effective, rusty sword.',
			type: 'weapon',
			equipSlot: 'weapon',
			stats: { attack: 2 },
			price: 20
		},
		leather_armor: {
			name: 'Leather Armor',
			description: 'A sturdy set of boiled leather armor.',
			type: 'armor',
			equipSlot: 'chest',
			stats: { defense: 3 },
			price: 35
		}
		// Add more items as needed
	}
};

// Populate dynamic data
gameData.destructionSpells = {
	fire: gameData.fireSpells,
	ice: gameData.iceSpells,
	lightning: gameData.lightningSpells,
	water: gameData.waterSpells,
	air: gameData.airSpells,
	earth: gameData.earthSpells
};
gameData.forbiddenSummoningSpells = [
	...gameData.primordialSummoningSpells,
	...gameData.demonicSummoningSpells,
	...gameData.divineSummoningSpells
];

const player = {
	name: '',
	class: '',
	race: '',
	gender: '',
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
	spells: [],
	potions: [],
	weapons: [],
	armor: [],
	rings: [],
	trinkets: [],
	consumables: [],
	stats: {
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
	}
};

const gameState = {
	time: 8, // Start at 8:00 AM
	day: 1,
	isNight: () => gameState.time >= 20 || gameState.time < 6,
	currentEnemy: null // Will hold the enemy object during combat
};

const npcs = {
	old_man_gideon: {
		name: 'Gideon',
		description:
			'A weathered old man with a long white beard sits on a tree stump, whittling a piece of wood.',
		dialogue: [
			"Well, hello there, traveler. It's not often I see a new face in these woods.",
			"Be careful if you're heading north. There's a dark cave up that way. I'd recommend getting a torch if you plan to explore it.",
			"The village to the east is usually welcoming, but they've been on edge lately."
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
			'A gruff and burly man with massive muscules who is very passionate about blacksmithing.',
		dialogue: [
			`Great, another ${playerRace}, and a ${playerClass} at that. Are you here to actully buy something or are you just planing on waisting my time?`,
			"Make it quick, time is money and I don't have too much of either to spare."
		],
		dialogueIndex: 0
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
			xp: 10 // experience points
		}
	}
};

const locations = {
	forest: {
		description:
			"You are in a dense forest. You can go 'north', 'east', 'west', or 'south'.",
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
		}
	},
	cave: {
		description: () => {
			if (!player.inventory.includes('torch')) {
				return "You are in a dark cave. It's too dark. You can go 'back' to the forest.";
			} else {
				return "You are in a dark cave. You have a torch so you can 'proceed', or go 'back' to the forest.";
			}
		},
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
			"You are inside the village. Where do you go? There's the 'market', 'shop', 'inn', 'temple', 'stables', 'bar', or 'adventurers guild'. You can also go 'back' to the village entrance.",
		actions: {
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
		actions: { back: () => (player.location = 'inside village') }
	},
	shop: {
		description:
			'You are at the general shop. You can go back to the village.',
		npcs: ['elara_the_shopkeeper'],
		inventory: {
			torch: { current: 5, max: 5 },
			health_potion: { current: 10, max: 10 },
			rusty_sword: { current: 1, max: 1 },
			leather_armor: { current: 1, max: 1 }
		},
		lastRestockDay: 1,
		actions: {
			back: () => travel('inside village', 0)
		}
	},
	inn: {
		description: 'You are at the cozy inn. You can go back to the village.',
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
		actions: { back: () => (player.location = 'inside village') }
	},
	stables: {
		description: 'You are at the stables. You can go back to the village.',
		actions: { back: () => (player.location = 'inside village') }
	},
	bar: {
		description:
			'You are at the noisy bar. You can go back to the village.',
		actions: { back: () => (player.location = 'inside village') }
	},
	'adventurers guild': {
		description:
			'You are at the adventurers guild. You can go back to the village.',
		actions: { back: () => (player.location = 'inside village') }
	},
	'old abandoned mine': {
		description:
			"You are in an old abandoned mine. You can go 'back' to the cave.",
		actions: {
			back: () => travel('cave', 1)
		}
	},
	dungeon: {
		description:
			"You are at the entrance of a dark dungeon. You can 'enter' or go 'back' to the forest.",
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
		actions: { back: () => travel('forest', 1) }
	}
};

function displayLocation() {
	// If in combat, don't display location info, stay in combat loop
	if (gameState.currentEnemy) {
		promptCombatAction();
		return;
	}

	const location = locations[player.location];
	if (!location) {
		console.log(`Error: Location "${player.location}" not found!`);
		player.location = 'forest'; // Reset to a default location
		displayLocation();
		return;
	}

	console.log(`\n--- Day ${gameState.day}, ${gameState.time}:00 ---`);

	const description =
		typeof location.description === 'function'
			? location.description()
			: location.description;
	console.log(description);

	// Display NPCs in the location
	if (location.npcs && location.npcs.length > 0) {
		console.log('\nAlso here:');
		location.npcs.forEach((npcId) => {
			const npc = npcs[npcId];
			if (npc) {
				console.log(`- ${npc.description}`);
			}
		});
		console.log("You can 'talk to <name>' to interact with them.");
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
	if (location.name === 'inn')
		console.log("You can 'sleep' here to pass the time.");

	if (player.inventory.length > 0) {
		console.log("You can 'use <item>' or 'equip <item>'.");
	}
	if (Object.values(player.equipment).some((item) => item)) {
		console.log("Check your 'equipment' or 'unequip <slot>'.");
		console.log("You can check your 'inventory' at any time.");
	}

	console.log(''); // Add a blank line for spacing
	promptAction();
}

async function promptPlayerInfo() {
	const ask = (question) =>
		new Promise((resolve) => rl.question(question, resolve));

	const firstName = await ask('What is your first name? ');
	const lastName = await ask('What is your last name? ');
	player.name = `${firstName} ${lastName}`;
	console.log(`Welcome, ${player.name}!`);

	const genderOptions = gameData.genders.join(', ');
	player.gender = await ask(`What is your gender? (${genderOptions}): `);
	console.log(`Your gender is ${player.gender}.`);

	const ageOptions = gameData.ages
		.map((age) => Object.keys(age)[0])
		.join(', ');
	player.age = await ask(`What is your age category? (${ageOptions}): `);
	console.log(`You are in the age category of ${player.age}.`);

	const heightOptions = gameData.heights
		.map((h) => Object.keys(h)[0])
		.join(', ');
	player.height = await ask(`What is your height? (${heightOptions}): `);
	console.log(`Your height is ${player.height}.`);

	const weightOptions = gameData.weights.join(', ');
	player.weight = await ask(`What is your weight? (${weightOptions}): `);
	console.log(`Your weight is considered ${player.weight}.`);

	console.log('\nCharacter creation complete!\n');
	displayLocation();
}

function promptAction() {
	rl.question('What do you do? ', (action) => {
		handleAction(action.toLowerCase().trim());
	});
}

function handleAction(action) {
	const currentLocation = locations[player.location];
	const [command, ...args] = action.split(' ');
	const argument = args.join(' ');

	// Check for movement/location-specific actions first
	if (
		currentLocation.actions &&
		currentLocation.actions[command] &&
		args.length === 0
	) {
		currentLocation.actions[command]();
		displayLocation();
		return;
	}

	// Handle multi-word commands like "buy health potion"
	if (command === 'buy') {
		handleBuy(argument);
		displayLocation();
		return;
	}

	if (command === 'use') {
		handleUse(argument);
		displayLocation();
		return;
	}

	if (command === 'inventory' || command === 'i') {
		displayInventory();
		displayLocation();
		return;
	}

	if (command === 'equip') {
		handleEquip(argument);
		displayLocation();
		return;
	}

	if (command === 'unequip') {
		handleUnequip(argument);
		displayLocation();
		return;
	}
	// Check for interaction actions like "talk to <npc>"
	if (action.startsWith('talk to ')) {
		const npcName = action.substring(8); // Get the name after "talk to "
		const npcId = currentLocation.npcs?.find(
			(id) => npcs[id].name.toLowerCase() === npcName
		);

		if (npcId) {
			const npc = npcs[npcId];
			// Display dialogue and cycle to the next line
			console.log(
				`\n[${npc.name}]: "${npc.dialogue[npc.dialogueIndex]}"`
			);
			npc.dialogueIndex = (npc.dialogueIndex + 1) % npc.dialogue.length;
		} else {
			console.log(`There is no one here by the name of '${npcName}'.`);
		}
		displayLocation();
		return;
	}

	if (command === 'stats' || command === 'c') {
		displayPlayerStats();
		displayLocation();
		return;
	}

	if (command === 'equipment' || command === 'e') {
		displayEquipment();
		displayLocation();
		return;
	}

	// If no valid action is found
	if (action) {
		// Avoids showing "Invalid action" on empty input
		console.log('Invalid action.');
	}
	displayLocation();
}

function handleBuy(itemName) {
	const shopLocation = locations[player.location];
	if (!shopLocation.inventory) {
		return console.log('There is nothing to buy here.');
	}

	const itemId = Object.keys(gameData.items).find(
		(id) => gameData.items[id].name.toLowerCase() === itemName
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
	player.inventory.push(itemId);
	console.log(
		`You bought a ${item.name} for ${item.price} gold. You have ${player.stats.gold} gold remaining.`
	);
}

function handleUse(itemName) {
	const itemId = Object.keys(gameData.items).find(
		(id) => gameData.items[id].name.toLowerCase() === itemName
	);

	if (!itemId || !player.inventory.includes(itemId)) {
		return console.log(`You don't have a '${itemName}' in your inventory.`);
	}

	const item = gameData.items[itemId];
	if (item.type !== 'consumable' || !item.effect) {
		return console.log(`You can't use the ${item.name} like that.`);
	}

	// Use the item
	item.effect(player);
	console.log(
		`You used the ${item.name}. Your health is now ${player.stats.health}.`
	);

	// Remove from inventory
	const itemIndex = player.inventory.indexOf(itemId);
	player.inventory.splice(itemIndex, 1);
}

function displayInventory() {
	console.log('\n--- Inventory ---');
	if (player.inventory.length === 0) {
		console.log('Your inventory is empty.');
	} else {
		const itemCounts = {};
		player.inventory.forEach((itemId) => {
			itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
		});

		Object.keys(itemCounts).forEach((itemId) => {
			const item = gameData.items[itemId];
			console.log(`- ${item.name} (x${itemCounts[itemId]})`);
		});
	}
	console.log(`Gold: ${player.stats.gold}`);
	console.log('-----------------\n');
}

function handleEquip(itemName) {
	const itemId = Object.keys(gameData.items).find(
		(id) => gameData.items[id].name.toLowerCase() === itemName
	);

	if (!itemId || !player.inventory.includes(itemId)) {
		return console.log(`You don't have a '${itemName}' in your inventory.`);
	}

	const itemToEquip = gameData.items[itemId];
	const slot = itemToEquip.equipSlot;

	if (!slot) {
		return console.log(`You cannot equip the ${itemToEquip.name}.`);
	}

	// Unequip current item in that slot, if any
	const currentItemId = player.equipment[slot];
	if (currentItemId) {
		player.inventory.push(currentItemId);
		const currentItem = gameData.items[currentItemId];
		console.log(
			`You unequip the ${currentItem.name} and put it in your inventory.`
		);
	}

	// Equip the new item
	player.equipment[slot] = itemId;
	const itemIndex = player.inventory.indexOf(itemId);
	player.inventory.splice(itemIndex, 1);

	console.log(`You equip the ${itemToEquip.name}.`);
}

function handleUnequip(slot) {
	if (!player.equipment.hasOwnProperty(slot)) {
		return console.log(`'${slot}' is not a valid equipment slot.`);
	}

	const itemId = player.equipment[slot];
	if (!itemId) {
		return console.log(`You have nothing equipped in the ${slot} slot.`);
	}

	const item = gameData.items[itemId];
	player.equipment[slot] = null;
	player.inventory.push(itemId);

	console.log(`You unequip the ${item.name} and place it in your inventory.`);
}

function displayEquipment() {
	console.log('\n--- Equipment ---');
	const effectiveStats = getEffectiveStats();

	for (const slot in player.equipment) {
		const itemId = player.equipment[slot];
		const itemName = itemId ? gameData.items[itemId].name : '[Empty]';
		console.log(
			`${slot.charAt(0).toUpperCase() + slot.slice(1)}: ${itemName}`
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
	}
}

function travel(destination, timeCost) {
	player.location = destination;
	if (timeCost > 0) {
		advanceTime(timeCost);
	}
}

function getEffectiveStats() {
	// Start with a copy of base stats
	const effectiveStats = { ...player.stats };

	// Add stats from equipped items
	for (const slot in player.equipment) {
		const itemId = player.equipment[slot];
		if (itemId) {
			const itemStats = gameData.items[itemId].stats;
			for (const stat in itemStats) {
				effectiveStats[stat] =
					(effectiveStats[stat] || 0) + itemStats[stat];
			}
		}
	}
	return effectiveStats;
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
		`\nYour HP: ${playerBaseStats.health}/${playerStats.maxHealth} | ${enemy.name} HP: ${enemy.stats.health}/${enemy.stats.maxHealth}`
	);
	rl.question('Combat: [a]ttack, [u]se item, [f]lee? ', (action) => {
		handleCombatAction(action.toLowerCase().trim());
	});
}

function handleCombatAction(action) {
	const playerStats = getEffectiveStats();
	const enemy = gameState.currentEnemy;

	if (action === 'a' || action === 'attack') {
		// Player's turn
		let playerDamage = Math.max(
			1,
			playerStats.attack - enemy.stats.defense
		); // Always do at least 1 damage
		enemy.stats.health -= playerDamage;
		console.log(`You attack the ${enemy.name} for ${playerDamage} damage.`);

		if (enemy.stats.health <= 0) {
			return winCombat();
		}
	} else if (action.startsWith('u') || action.startsWith('use')) {
		const itemName = action.split(' ').slice(1).join(' ');
		if (!itemName) {
			console.log('Use what? (e.g., use health potion)');
			return promptCombatAction();
		}
		handleUse(itemName); // handleUse already prints messages
	} else if (action === 'f' || action === 'flee') {
		console.log('You manage to escape from the battle!');
		return endCombat(true); // Fleeing ends combat
	} else {
		console.log(
			'Invalid combat action. The enemy takes the opportunity to strike!'
		);
	}

	// Enemy's turn (if player didn't win or flee)
	let enemyDamage = Math.max(1, enemy.stats.attack - playerStats.defense);
	player.stats.health -= enemyDamage;
	console.log(`The ${enemy.name} attacks you for ${enemyDamage} damage.`);

	if (player.stats.health <= 0) {
		return loseCombat();
	}

	promptCombatAction(); // Continue the fight
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
	endCombat(false);
}

function loseCombat() {
	console.log('\nYou have been defeated. Your vision fades to black...');
	console.log('--- GAME OVER ---');
	rl.close();
}

function endCombat(fled) {
	gameState.currentEnemy = null;
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

startGame();

rl.on('close', () => {
	console.log('Thanks for playing!');
	process.exit(0);
});
