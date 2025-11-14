export const DEFAULT_WRESTLER_SEEDS = [
  {
    name: "Alex 'The Ace' Valour",
    gender: 'Male',
    age: 32,
    weightClass: 'Middleweight',
    nationality: 'United States',
    alignment: 'Face',
    gimmick: 'Franchise Player',
    alternateNames: ['The Golden Boy'],
    charisma: 90,
    speakingAbility: 88,
    starPower: 92,
    inRing: {
      brawl: 80,
      speed: 75,
      technical: 85,
      aerial: 70,
      psychology: 88,
      safety: 85
    },
    physical: {
      condition: 85,
      momentum: 70,
      durability: 78
    },
    moveSet: {
      finishers: [
        { name: 'Valor Driver', moveType: 'Slam' },
        { name: 'Ace in the Hole', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 36,
      monthlySalary: 45000
    },
    personality: {
      professionalism: 90,
      motivation: 88,
      friendliness: 80,
      behaviorNotes: ['Locker room leader', 'Mentors younger talent']
    },
    relationships: {
      allies: ["Leo 'Lionheart' Cruz", '"Big Country" Buck Donovan', 'Trevor "The Technician" Reid'],
      rivals: ["Jax 'The Juggernaut' Stone", "Silas 'The Serpent' Retch", 'Bishop Graves'],
      tagPartner: null,
      stable: null
    },
    metadata: {
      morale: 75,
      popularity: 88,
      debutYear: 2010,
      bio: 'Homegrown ace who carries the PGW banner with pride and calm leadership.'
    }
  },
  {
    name: "Eliza 'High-Flyer' Hayes",
    gender: 'Female',
    age: 27,
    weightClass: 'Cruiserweight',
    nationality: 'United States',
    alignment: 'Face',
    gimmick: 'Daredevil',
    charisma: 75,
    speakingAbility: 68,
    starPower: 80,
    inRing: {
      brawl: 50,
      speed: 95,
      technical: 80,
      aerial: 96,
      psychology: 72,
      safety: 83
    },
    physical: {
      condition: 88,
      momentum: 82,
      durability: 70
    },
    moveSet: {
      finishers: [
        { name: 'Skyline Spiral', moveType: 'Top Rope' },
        { name: 'Starfall Clutch', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 30,
      monthlySalary: 27000
    },
    personality: {
      professionalism: 78,
      motivation: 92,
      friendliness: 86,
      behaviorNotes: ['Lives for high spots', 'Constantly studies aerial innovators']
    },
    relationships: {
      allies: ["Mia 'Showtime' Evans", '"Wildcard" Wade Ripley', 'Zara Storm'],
      rivals: ['Cassidy Quinn'],
      tagPartner: "Mia 'Showtime' Evans",
      stable: null
    },
    metadata: {
      morale: 75,
      popularity: 82,
      debutYear: 2016,
      bio: 'Aerial daredevil who thrives on outdoing herself every time the lights hit.'
    }
  },
  {
    name: 'Goliath',
    gender: 'Male',
    age: 38,
    weightClass: 'Super Heavyweight',
    nationality: 'Canada',
    alignment: 'Heel',
    gimmick: 'Monster',
    charisma: 60,
    speakingAbility: 55,
    starPower: 74,
    inRing: {
      brawl: 90,
      speed: 50,
      technical: 50,
      aerial: 30,
      psychology: 70,
      safety: 68
    },
    physical: {
      condition: 80,
      momentum: 65,
      durability: 92
    },
    moveSet: {
      finishers: [
        { name: "Titan's Wrath", moveType: 'Slam' },
        { name: 'Cataclysm Elbow', moveType: 'Strike' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 24,
      monthlySalary: 38000
    },
    personality: {
      professionalism: 68,
      motivation: 70,
      friendliness: 35,
      behaviorNotes: ['Demands dominant booking', 'Prefers short matches']
    },
    relationships: {
      allies: ["Jax 'The Juggernaut' Stone", "Silas 'The Serpent' Retch"],
      rivals: ['"Big Country" Buck Donovan', "Alex 'The Ace' Valour"],
      tagPartner: "Jax 'The Juggernaut' Stone",
      stable: null
    },
    metadata: {
      morale: 75,
      popularity: 70,
      debutYear: 2006,
      bio: 'An unstoppable wall of power who believes fear is the best form of crowd control.'
    }
  },
  {
    name: "Jax 'The Juggernaut' Stone",
    gender: 'Male',
    age: 34,
    weightClass: 'Heavyweight',
    nationality: 'United States',
    alignment: 'Heel',
    gimmick: 'Monster',
    charisma: 70,
    speakingAbility: 64,
    starPower: 78,
    inRing: {
      brawl: 95,
      speed: 60,
      technical: 65,
      aerial: 40,
      psychology: 76,
      safety: 72
    },
    physical: {
      condition: 84,
      momentum: 68,
      durability: 90
    },
    moveSet: {
      finishers: [
        { name: 'Juggernaut Bomb', moveType: 'Slam' },
        { name: 'Stonebreaker Spear', moveType: 'Strike' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 30,
      monthlySalary: 36000
    },
    personality: {
      professionalism: 72,
      motivation: 82,
      friendliness: 42,
      behaviorNotes: ['Thrives on intimidation', 'Demands main-event spotlight']
    },
    relationships: {
      allies: ['Goliath', "Silas 'The Serpent' Retch"],
      rivals: ["Alex 'The Ace' Valour", "Leo 'Lionheart' Cruz", '"Big Country" Buck Donovan'],
      tagPartner: 'Goliath',
      stable: null
    },
    metadata: {
      morale: 75,
      popularity: 76,
      debutYear: 2008,
      bio: 'A wrecking ball of aggression who wants every show built around his dominance.'
    }
  },
  {
    name: 'Johnny Spade',
    gender: 'Male',
    age: 31,
    weightClass: 'Middleweight',
    nationality: 'United States',
    alignment: 'Tweener',
    gimmick: 'No Gimmick Needed',
    charisma: 70,
    speakingAbility: 72,
    starPower: 74,
    inRing: {
      brawl: 70,
      speed: 70,
      technical: 70,
      aerial: 68,
      psychology: 74,
      safety: 80
    },
    physical: {
      condition: 82,
      momentum: 66,
      durability: 76
    },
    moveSet: {
      finishers: [
        { name: 'Spade Splash', moveType: 'Top Rope' },
        { name: 'No Limit Necklock', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Per Appearance',
      durationMonths: 12,
      monthlySalary: 12000
    },
    personality: {
      professionalism: 80,
      motivation: 70,
      friendliness: 78,
      behaviorNotes: ['Versatile utility player', 'Keeps morale loose backstage']
    },
    relationships: {
      allies: ["Kenji 'Codebreak' Tanaka", '"Magic" Marcus Flint'],
      rivals: ["Silas 'The Serpent' Retch"],
      tagPartner: '"Magic" Marcus Flint',
      stable: null
    },
    metadata: {
      morale: 75,
      popularity: 72,
      debutYear: 2011,
      bio: 'Adaptable workhorse who can slide anywhere on the card and deliver.'
    }
  },
  {
    name: "Kenji 'Codebreak' Tanaka",
    gender: 'Male',
    age: 29,
    weightClass: 'Cruiserweight',
    nationality: 'Japan',
    alignment: 'Face',
    gimmick: 'Show Stealer',
    charisma: 80,
    speakingAbility: 74,
    starPower: 86,
    inRing: {
      brawl: 70,
      speed: 90,
      technical: 95,
      aerial: 88,
      psychology: 90,
      safety: 94
    },
    physical: {
      condition: 90,
      momentum: 78,
      durability: 82
    },
    moveSet: {
      finishers: [
        { name: 'Codebreak Kick', moveType: 'Strike' },
        { name: 'Neon Armbar', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 36,
      monthlySalary: 42000
    },
    personality: {
      professionalism: 92,
      motivation: 94,
      friendliness: 76,
      behaviorNotes: ['Meticulous planner', 'Inspires younger high-flyers']
    },
    relationships: {
      allies: ['Trevor "The Technician" Reid', "Mia 'Showtime' Evans"],
      rivals: ['Dante "Ironjaw" Morales'],
      tagPartner: 'Trevor "The Technician" Reid',
      stable: null
    },
    metadata: {
      morale: 75,
      popularity: 84,
      debutYear: 2012,
      bio: 'Precision striker who obsesses over delivering match-of-the-night performances.'
    }
  },
  {
    name: "Leo 'Lionheart' Cruz",
    gender: 'Male',
    age: 30,
    weightClass: 'Middleweight',
    nationality: 'Mexico',
    alignment: 'Face',
    gimmick: 'Hero',
    charisma: 85,
    speakingAbility: 82,
    starPower: 88,
    inRing: {
      brawl: 85,
      speed: 80,
      technical: 75,
      aerial: 78,
      psychology: 86,
      safety: 88
    },
    physical: {
      condition: 88,
      momentum: 76,
      durability: 84
    },
    moveSet: {
      finishers: [
        { name: 'Lionheart Lariat', moveType: 'Strike' },
        { name: 'Roaring Lion Tamer', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 30,
      monthlySalary: 33000
    },
    personality: {
      professionalism: 86,
      motivation: 90,
      friendliness: 88,
      behaviorNotes: ['Beloved locker-room glue', 'Always thanks the crew']
    },
    relationships: {
      allies: ["Alex 'The Ace' Valour", '"Big Country" Buck Donovan', '"Lightning" Luke Lawson'],
      rivals: ["Silas 'The Serpent' Retch", 'Dante "Ironjaw" Morales'],
      tagPartner: null,
      stable: null
    },
    metadata: {
      morale: 75,
      popularity: 86,
      debutYear: 2011,
      bio: 'Fiery crowd favorite whose heart-on-sleeve promos rally the audience.'
    }
  },
  {
    name: "Mia 'Showtime' Evans",
    gender: 'Female',
    age: 26,
    weightClass: 'Lightweight',
    nationality: 'United States',
    alignment: 'Face',
    gimmick: 'Teen Idol',
    charisma: 90,
    speakingAbility: 88,
    starPower: 89,
    inRing: {
      brawl: 65,
      speed: 85,
      technical: 80,
      aerial: 86,
      psychology: 78,
      safety: 84
    },
    physical: {
      condition: 87,
      momentum: 88,
      durability: 72
    },
    moveSet: {
      finishers: [
        { name: 'Showtime Stunner', moveType: 'Strike' },
        { name: 'Spotlight Moonsault', moveType: 'Top Rope' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 30,
      monthlySalary: 32000
    },
    personality: {
      professionalism: 84,
      motivation: 93,
      friendliness: 90,
      behaviorNotes: ['Runs fan outreach events', 'Embraces media obligations']
    },
    relationships: {
      allies: ["Eliza 'High-Flyer' Hayes", 'Zara Storm', '"Big Country" Buck Donovan'],
      rivals: ['Cassidy Quinn', "Victoria 'The Queen' Black"],
      tagPartner: 'Zara Storm',
      stable: null
    },
    metadata: {
      morale: 75,
      popularity: 90,
      debutYear: 2014,
      bio: 'Pop-culture phenom who balances flashy performances with heartfelt fan connection.'
    }
  },
  {
    name: "Silas 'The Serpent' Retch",
    gender: 'Male',
    age: 35,
    weightClass: 'Middleweight',
    nationality: 'United Kingdom',
    alignment: 'Heel',
    gimmick: 'Evil',
    charisma: 85,
    speakingAbility: 80,
    starPower: 83,
    inRing: {
      brawl: 80,
      speed: 70,
      technical: 80,
      aerial: 62,
      psychology: 89,
      safety: 86
    },
    physical: {
      condition: 82,
      momentum: 74,
      durability: 80
    },
    moveSet: {
      finishers: [
        { name: "Serpent's Fang", moveType: 'Submission' },
        { name: 'Venom Strike', moveType: 'Strike' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 24,
      monthlySalary: 34000
    },
    personality: {
      professionalism: 74,
      motivation: 88,
      friendliness: 30,
      behaviorNotes: ['Mind-game specialist', 'Keeps personal circle tight']
    },
    relationships: {
      allies: ["Jax 'The Juggernaut' Stone", 'Riot Reynolds', 'Bishop Graves'],
      rivals: ["Alex 'The Ace' Valour", '"Big Country" Buck Donovan', "Leo 'Lionheart' Cruz"],
      tagPartner: 'Riot Reynolds',
      stable: 'Night Shift'
    },
    metadata: {
      morale: 75,
      popularity: 78,
      debutYear: 2009,
      bio: 'Scheming manipulator who weaponizes whispers and paranoia.'
    }
  },
  {
    name: "Victoria 'The Queen' Black",
    gender: 'Female',
    age: 33,
    weightClass: 'Middleweight',
    nationality: 'United Kingdom',
    alignment: 'Heel',
    gimmick: 'Rich Snob',
    alternateNames: ['Vicky Black'],
    charisma: 95,
    speakingAbility: 92,
    starPower: 91,
    inRing: {
      brawl: 75,
      speed: 70,
      technical: 85,
      aerial: 65,
      psychology: 88,
      safety: 87
    },
    physical: {
      condition: 84,
      momentum: 86,
      durability: 78
    },
    moveSet: {
      finishers: [
        { name: 'Royal Decree', moveType: 'Slam' },
        { name: 'Crown Jewel Clutch', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 36,
      monthlySalary: 41000
    },
    personality: {
      professionalism: 82,
      motivation: 85,
      friendliness: 38,
      behaviorNotes: ['Demands luxurious travel', 'Sharp political instincts']
    },
    relationships: {
      allies: ['Cassidy Quinn', 'Dante "Ironjaw" Morales'],
      rivals: ["Mia 'Showtime' Evans", 'Zara Storm'],
      tagPartner: 'Cassidy Quinn',
      stable: 'Glamour Syndicate'
    },
    metadata: {
      morale: 75,
      popularity: 88,
      debutYear: 2007,
      bio: 'Aristocratic tactician who rules the division through ego and strategy.'
    }
  },
  {
    name: '"Wildcard" Wade Ripley',
    gender: 'Male',
    age: 29,
    weightClass: 'Cruiserweight',
    nationality: 'United States',
    alignment: 'Tweener',
    gimmick: 'Reckless Daredevil',
    charisma: 78,
    speakingAbility: 65,
    starPower: 80,
    inRing: {
      brawl: 68,
      speed: 92,
      technical: 74,
      aerial: 95,
      psychology: 60,
      safety: 55
    },
    physical: {
      condition: 82,
      momentum: 76,
      durability: 62
    },
    moveSet: {
      finishers: [
        { name: 'Crash Landing', moveType: 'Top Rope' },
        { name: 'Wild Shot Knee', moveType: 'Strike' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 18,
      monthlySalary: 22000
    },
    personality: {
      professionalism: 55,
      motivation: 82,
      friendliness: 70,
      behaviorNotes: ['Thrill seeker', 'Needs agent oversight to stay on script']
    },
    relationships: {
      allies: ["Eliza 'High-Flyer' Hayes", 'Zara Storm'],
      rivals: ['Riot Reynolds'],
      tagPartner: 'Zara Storm',
      stable: null
    },
    metadata: {
      morale: 70,
      popularity: 72,
      debutYear: 2015,
      bio: 'Unpredictable stunt machine who can steal the show or derail it in equal measure.'
    }
  },
  {
    name: 'Dante "Ironjaw" Morales',
    gender: 'Male',
    age: 34,
    weightClass: 'Middleweight',
    nationality: 'Brazil',
    alignment: 'Heel',
    gimmick: 'Submission Shooter',
    charisma: 65,
    speakingAbility: 70,
    starPower: 78,
    inRing: {
      brawl: 82,
      speed: 68,
      technical: 92,
      aerial: 40,
      psychology: 88,
      safety: 90
    },
    physical: {
      condition: 90,
      momentum: 68,
      durability: 85
    },
    moveSet: {
      finishers: [
        { name: 'Ironjaw Clutch', moveType: 'Submission' },
        { name: 'Mercy Breaker', moveType: 'Strike' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 30,
      monthlySalary: 38000
    },
    personality: {
      professionalism: 88,
      motivation: 86,
      friendliness: 50,
      behaviorNotes: ['Intense training regimen', 'Keeps to himself on the road']
    },
    relationships: {
      allies: ["Victoria 'The Queen' Black", 'Bishop Graves'],
      rivals: ['Trevor "The Technician" Reid', "Leo 'Lionheart' Cruz", '"Lightning" Luke Lawson'],
      tagPartner: null,
      stable: null
    },
    metadata: {
      morale: 68,
      popularity: 66,
      debutYear: 2008,
      bio: 'Cold-blooded technician who twists limbs and minds with equal intensity.'
    }
  },
  {
    name: '"Big Country" Buck Donovan',
    gender: 'Male',
    age: 36,
    weightClass: 'Heavyweight',
    nationality: 'United States',
    alignment: 'Face',
    gimmick: 'Blue-Collar Powerhouse',
    charisma: 82,
    speakingAbility: 78,
    starPower: 84,
    inRing: {
      brawl: 88,
      speed: 55,
      technical: 68,
      aerial: 35,
      psychology: 75,
      safety: 82
    },
    physical: {
      condition: 83,
      momentum: 80,
      durability: 88
    },
    moveSet: {
      finishers: [
        { name: 'Country Hammer', moveType: 'Slam' },
        { name: 'Rustic Lock', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 24,
      monthlySalary: 32000
    },
    personality: {
      professionalism: 92,
      motivation: 85,
      friendliness: 88,
      behaviorNotes: ['Community outreach staple', 'Eats losses gracefully to help talent']
    },
    relationships: {
      allies: ["Alex 'The Ace' Valour", "Mia 'Showtime' Evans"],
      rivals: ["Silas 'The Serpent' Retch", 'Riot Reynolds', 'Bishop Graves'],
      tagPartner: null,
      stable: null
    },
    metadata: {
      morale: 80,
      popularity: 82,
      debutYear: 2007,
      bio: 'Working-class hero whose handshake and haymaker carry equal weight.'
    }
  },
  {
    name: 'Cassidy Quinn',
    gender: 'Female',
    age: 25,
    weightClass: 'Lightweight',
    nationality: 'United States',
    alignment: 'Heel',
    gimmick: 'Influencer Supreme',
    charisma: 94,
    speakingAbility: 92,
    starPower: 90,
    inRing: {
      brawl: 55,
      speed: 78,
      technical: 70,
      aerial: 60,
      psychology: 74,
      safety: 68
    },
    physical: {
      condition: 86,
      momentum: 88,
      durability: 60
    },
    moveSet: {
      finishers: [
        { name: 'Filter Drop', moveType: 'Strike' },
        { name: 'Cancel Clutch', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 24,
      monthlySalary: 30000
    },
    personality: {
      professionalism: 70,
      motivation: 83,
      friendliness: 40,
      behaviorNotes: ['Demands spotlight', 'Live-streams from gorilla position']
    },
    relationships: {
      allies: ["Victoria 'The Queen' Black", 'Dante "Ironjaw" Morales'],
      rivals: ["Mia 'Showtime' Evans", 'Zara Storm', '"Lightning" Luke Lawson'],
      tagPartner: "Victoria 'The Queen' Black",
      stable: 'Glamour Syndicate'
    },
    metadata: {
      morale: 77,
      popularity: 79,
      debutYear: 2018,
      bio: 'Social-media maven who weaponizes trend cycles to get under everyone’s skin.'
    }
  },
  {
    name: 'Trevor "The Technician" Reid',
    gender: 'Male',
    age: 30,
    weightClass: 'Middleweight',
    nationality: 'United States',
    alignment: 'Face',
    gimmick: 'Pure Wrestling Expert',
    charisma: 72,
    speakingAbility: 68,
    starPower: 76,
    inRing: {
      brawl: 70,
      speed: 82,
      technical: 94,
      aerial: 65,
      psychology: 88,
      safety: 92
    },
    physical: {
      condition: 90,
      momentum: 74,
      durability: 80
    },
    moveSet: {
      finishers: [
        { name: 'Precision Lock', moveType: 'Submission' },
        { name: 'Snapdragon Finale', moveType: 'Slam' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 36,
      monthlySalary: 34000
    },
    personality: {
      professionalism: 95,
      motivation: 90,
      friendliness: 75,
      behaviorNotes: ['Tape-study junkie', 'Always volunteering for clinics']
    },
    relationships: {
      allies: ['Kenji "Codebreak" Tanaka', "Alex 'The Ace' Valour"],
      rivals: ['Dante "Ironjaw" Morales', "Silas 'The Serpent' Retch"],
      tagPartner: 'Kenji "Codebreak" Tanaka',
      stable: null
    },
    metadata: {
      morale: 76,
      popularity: 74,
      debutYear: 2012,
      bio: 'Precision grappler obsessed with elevating the company’s in-ring reputation.'
    }
  },
  {
    name: 'Riot Reynolds',
    gender: 'Male',
    age: 31,
    weightClass: 'Middleweight',
    nationality: 'United States',
    alignment: 'Heel',
    gimmick: 'Hardcore Punk Brawler',
    charisma: 68,
    speakingAbility: 62,
    starPower: 72,
    inRing: {
      brawl: 88,
      speed: 70,
      technical: 60,
      aerial: 55,
      psychology: 62,
      safety: 50
    },
    physical: {
      condition: 78,
      momentum: 70,
      durability: 82
    },
    moveSet: {
      finishers: [
        { name: 'Stage Dive', moveType: 'Top Rope' },
        { name: 'Concrete Riot', moveType: 'Strike' }
      ]
    },
    contract: {
      contractType: 'Per Appearance',
      durationMonths: 12,
      monthlySalary: 12000
    },
    personality: {
      professionalism: 60,
      motivation: 75,
      friendliness: 45,
      behaviorNotes: ['Prefers hardcore spots', 'Needs producer to rein in chaos']
    },
    relationships: {
      allies: ["Silas 'The Serpent' Retch", 'Bishop Graves'],
      rivals: ['"Big Country" Buck Donovan', '"Wildcard" Wade Ripley'],
      tagPartner: "Silas 'The Serpent' Retch",
      stable: 'Night Shift'
    },
    metadata: {
      morale: 72,
      popularity: 68,
      debutYear: 2010,
      bio: 'Hardcore lifer who treats every bout like the main event of a punk festival.'
    }
  },
  {
    name: '"Magic" Marcus Flint',
    gender: 'Male',
    age: 33,
    weightClass: 'Lightweight',
    nationality: 'United States',
    alignment: 'Tweener',
    gimmick: 'Illusionist Showman',
    charisma: 88,
    speakingAbility: 90,
    starPower: 78,
    inRing: {
      brawl: 60,
      speed: 82,
      technical: 72,
      aerial: 85,
      psychology: 70,
      safety: 76
    },
    physical: {
      condition: 85,
      momentum: 66,
      durability: 60
    },
    moveSet: {
      finishers: [
        { name: 'Prestige Trick', moveType: 'Top Rope' },
        { name: 'Sleight of Pain', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Per Appearance',
      durationMonths: 12,
      monthlySalary: 9000
    },
    personality: {
      professionalism: 75,
      motivation: 70,
      friendliness: 85,
      behaviorNotes: ['Keeps locker room loose', 'Always pitching comedic skits']
    },
    relationships: {
      allies: ['Johnny Spade', '"Lightning" Luke Lawson'],
      rivals: ['Bishop Graves'],
      tagPartner: 'Johnny Spade',
      stable: null
    },
    metadata: {
      morale: 74,
      popularity: 70,
      debutYear: 2011,
      bio: 'Charismatic trickster blending comedy, athleticism, and fourth-wall breaking.'
    }
  },
  {
    name: 'Zara Storm',
    gender: 'Female',
    age: 24,
    weightClass: 'Lightweight',
    nationality: 'Australia',
    alignment: 'Face',
    gimmick: 'Pop Idol High Flyer',
    charisma: 92,
    speakingAbility: 85,
    starPower: 88,
    inRing: {
      brawl: 58,
      speed: 94,
      technical: 78,
      aerial: 97,
      psychology: 68,
      safety: 80
    },
    physical: {
      condition: 91,
      momentum: 90,
      durability: 64
    },
    moveSet: {
      finishers: [
        { name: 'Storm Surge', moveType: 'Top Rope' },
        { name: 'Idol Lock', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 30,
      monthlySalary: 28000
    },
    personality: {
      professionalism: 82,
      motivation: 95,
      friendliness: 90,
      behaviorNotes: ['Maintains intense choreography schedule', 'Always media ready']
    },
    relationships: {
      allies: ["Mia 'Showtime' Evans", '"Wildcard" Wade Ripley'],
      rivals: ['Cassidy Quinn', 'Bishop Graves'],
      tagPartner: '"Wildcard" Wade Ripley',
      stable: null
    },
    metadata: {
      morale: 82,
      popularity: 85,
      debutYear: 2019,
      bio: 'Chart-topping idol whose athleticism and charisma are equal parts dazzling.'
    }
  },
  {
    name: 'Bishop Graves',
    gender: 'Male',
    age: 37,
    weightClass: 'Middleweight',
    nationality: 'United States',
    alignment: 'Heel',
    gimmick: 'Cult Mastermind',
    charisma: 86,
    speakingAbility: 93,
    starPower: 85,
    inRing: {
      brawl: 72,
      speed: 60,
      technical: 75,
      aerial: 50,
      psychology: 95,
      safety: 88
    },
    physical: {
      condition: 82,
      momentum: 78,
      durability: 79
    },
    moveSet: {
      finishers: [
        { name: 'Requiem Driver', moveType: 'Slam' },
        { name: 'Graves Consecration', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Written',
      durationMonths: 36,
      monthlySalary: 40000
    },
    personality: {
      professionalism: 82,
      motivation: 76,
      friendliness: 30,
      behaviorNotes: ['Manipulative backstage politicking', 'Keeps disciples close']
    },
    relationships: {
      allies: ["Silas 'The Serpent' Retch", 'Riot Reynolds', 'Dante "Ironjaw" Morales'],
      rivals: ["Alex 'The Ace' Valour", '"Magic" Marcus Flint', '"Lightning" Luke Lawson'],
      tagPartner: null,
      stable: 'Night Shift'
    },
    metadata: {
      morale: 73,
      popularity: 81,
      debutYear: 2005,
      bio: 'Sinister manipulator orchestrating chaos through whispers and indoctrination.'
    }
  },
  {
    name: '"Lightning" Luke Lawson',
    gender: 'Male',
    age: 22,
    weightClass: 'Lightweight',
    nationality: 'United States',
    alignment: 'Face',
    gimmick: 'Underdog Prospect',
    charisma: 79,
    speakingAbility: 74,
    starPower: 80,
    inRing: {
      brawl: 60,
      speed: 93,
      technical: 75,
      aerial: 88,
      psychology: 65,
      safety: 78
    },
    physical: {
      condition: 94,
      momentum: 68,
      durability: 60
    },
    moveSet: {
      finishers: [
        { name: 'Flashpoint Splash', moveType: 'Top Rope' },
        { name: 'Quickstrike Clutch', moveType: 'Submission' }
      ]
    },
    contract: {
      contractType: 'Per Appearance',
      durationMonths: 12,
      monthlySalary: 6000
    },
    personality: {
      professionalism: 85,
      motivation: 97,
      friendliness: 92,
      behaviorNotes: ['Always early to training', 'Soaks up advice from veterans']
    },
    relationships: {
      allies: ["Alex 'The Ace' Valour", 'Zara Storm', '"Magic" Marcus Flint'],
      rivals: ['Bishop Graves', 'Dante "Ironjaw" Morales'],
      tagPartner: null,
      stable: null
    },
    metadata: {
      morale: 78,
      popularity: 74,
      debutYear: 2021,
      bio: 'High-voltage upstart determined to prove he belongs in the main-event conversation.'
    }
  }
];

export default DEFAULT_WRESTLER_SEEDS;
