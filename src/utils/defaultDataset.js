export const DEFAULT_DATASET_ID = "default-fiction";

export const DEFAULT_COMPANY = {
  id: "pgw-proving-ground-wrestling",
  datasetId: DEFAULT_DATASET_ID,
  name: "Proving Ground Wrestling",
  shortName: "PGW",
  size: "A",
  style: "Hybrid Indie",
  prestige: 68,
  riskLevel: 45,
  publicImage: 70,
  finances: 450000,
  headquarters: "Chicago, Illinois, USA",
  status: "Active",
  description: "A rising hybrid indie promotion where hungry talent prove themselves on the biggest independent stage."
};

export const DEFAULT_WRESTLERS = [
  {
    "id": "pgw-alex-the-ace-valour",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Alex 'The Ace' Valour",
    "shortName": "Alex Valour",
    "displayName": "Alex 'The Ace' Valour",
    "gender": "Male",
    "age": 32,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Franchise Player",
    "status": "Active",
    "pushLevel": "Main Event",
    "injuryStatus": "Healthy",
    "overallRating": 83,
    "charisma": 90,
    "speakingAbility": 88,
    "starPower": 92,
    "inRing": {
      "brawl": 80,
      "speed": 75,
      "technical": 85,
      "aerial": 70,
      "psychology": 88,
      "safety": 85
    },
    "physical": {
      "condition": 85,
      "momentum": 70,
      "durability": 78
    },
    "role": {
      "disposition": "Face",
      "archetype": "Franchise Player",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Valor Driver",
    "finisherPrimaryType": "slam",
    "finisherSecondaryName": "Ace in the Hole",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Valor Driver",
          "moveType": "Slam"
        },
        {
          "name": "Ace in the Hole",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 36,
      "monthlySalary": 45000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 90,
      "motivation": 88,
      "friendliness": 80,
      "behaviorNotes": [
        "Locker room leader",
        "Mentors younger talent"
      ]
    },
    "relationships": {
      "allies": [
        "Leo 'Lionheart' Cruz",
        "\"Big Country\" Buck Donovan",
        "Trevor \"The Technician\" Reid"
      ],
      "rivals": [
        "Jax 'The Juggernaut' Stone",
        "Silas 'The Serpent' Retch",
        "Bishop Graves"
      ],
      "tagPartner": null,
      "stable": null
    },
    "metadata": {
      "morale": 75,
      "popularity": 88,
      "debutYear": 2010,
      "bio": "Homegrown ace who carries the PGW banner with pride and calm leadership.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-eliza-high-flyer-hayes",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Eliza 'High-Flyer' Hayes",
    "shortName": "Eliza Hayes",
    "displayName": "Eliza 'High-Flyer' Hayes",
    "gender": "Female",
    "age": 27,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Cruiserweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Daredevil",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 79,
    "charisma": 75,
    "speakingAbility": 68,
    "starPower": 80,
    "inRing": {
      "brawl": 50,
      "speed": 95,
      "technical": 80,
      "aerial": 96,
      "psychology": 72,
      "safety": 83
    },
    "physical": {
      "condition": 88,
      "momentum": 82,
      "durability": 70
    },
    "role": {
      "disposition": "Face",
      "archetype": "Daredevil",
      "primaryDivision": "Cruiserweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Skyline Spiral",
    "finisherPrimaryType": "top_rope",
    "finisherSecondaryName": "Starfall Clutch",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Skyline Spiral",
          "moveType": "Top Rope"
        },
        {
          "name": "Starfall Clutch",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 30,
      "monthlySalary": 27000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 78,
      "motivation": 92,
      "friendliness": 86,
      "behaviorNotes": [
        "Lives for high spots",
        "Constantly studies aerial innovators"
      ]
    },
    "relationships": {
      "allies": [
        "Mia 'Showtime' Evans",
        "\"Wildcard\" Wade Ripley",
        "Zara Storm"
      ],
      "rivals": [
        "Cassidy Quinn"
      ],
      "tagPartner": "Mia 'Showtime' Evans",
      "stable": null
    },
    "metadata": {
      "morale": 75,
      "popularity": 82,
      "debutYear": 2016,
      "bio": "Aerial daredevil who thrives on outdoing herself every time the lights hit.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-goliath",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Goliath",
    "shortName": "Goliath",
    "displayName": "Goliath",
    "gender": "Male",
    "age": 38,
    "nationality": "Canada",
    "hometown": "Various Cities",
    "disposition": "Heel",
    "alignment": "Heel",
    "weightClass": "Super Heavyweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Monster",
    "status": "Active",
    "pushLevel": "Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 62,
    "charisma": 60,
    "speakingAbility": 55,
    "starPower": 74,
    "inRing": {
      "brawl": 90,
      "speed": 50,
      "technical": 50,
      "aerial": 30,
      "psychology": 70,
      "safety": 68
    },
    "physical": {
      "condition": 80,
      "momentum": 65,
      "durability": 92
    },
    "role": {
      "disposition": "Heel",
      "archetype": "Monster",
      "primaryDivision": "Super Heavyweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Titan's Wrath",
    "finisherPrimaryType": "slam",
    "finisherSecondaryName": "Cataclysm Elbow",
    "finisherSecondaryType": "strike",
    "moveSet": {
      "finishers": [
        {
          "name": "Titan's Wrath",
          "moveType": "Slam"
        },
        {
          "name": "Cataclysm Elbow",
          "moveType": "Strike"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 24,
      "monthlySalary": 38000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 68,
      "motivation": 70,
      "friendliness": 35,
      "behaviorNotes": [
        "Demands dominant booking",
        "Prefers short matches"
      ]
    },
    "relationships": {
      "allies": [
        "Jax 'The Juggernaut' Stone",
        "Silas 'The Serpent' Retch"
      ],
      "rivals": [
        "\"Big Country\" Buck Donovan",
        "Alex 'The Ace' Valour"
      ],
      "tagPartner": "Jax 'The Juggernaut' Stone",
      "stable": null
    },
    "metadata": {
      "morale": 75,
      "popularity": 70,
      "debutYear": 2006,
      "bio": "An unstoppable wall of power who believes fear is the best form of crowd control.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-jax-the-juggernaut-stone",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Jax 'The Juggernaut' Stone",
    "shortName": "Jax Stone",
    "displayName": "Jax 'The Juggernaut' Stone",
    "gender": "Male",
    "age": 34,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Heel",
    "alignment": "Heel",
    "weightClass": "Heavyweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Monster",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 70,
    "charisma": 70,
    "speakingAbility": 64,
    "starPower": 78,
    "inRing": {
      "brawl": 95,
      "speed": 60,
      "technical": 65,
      "aerial": 40,
      "psychology": 76,
      "safety": 72
    },
    "physical": {
      "condition": 84,
      "momentum": 68,
      "durability": 90
    },
    "role": {
      "disposition": "Heel",
      "archetype": "Monster",
      "primaryDivision": "Heavyweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Juggernaut Bomb",
    "finisherPrimaryType": "slam",
    "finisherSecondaryName": "Stonebreaker Spear",
    "finisherSecondaryType": "strike",
    "moveSet": {
      "finishers": [
        {
          "name": "Juggernaut Bomb",
          "moveType": "Slam"
        },
        {
          "name": "Stonebreaker Spear",
          "moveType": "Strike"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 30,
      "monthlySalary": 36000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 72,
      "motivation": 82,
      "friendliness": 42,
      "behaviorNotes": [
        "Thrives on intimidation",
        "Demands main-event spotlight"
      ]
    },
    "relationships": {
      "allies": [
        "Goliath",
        "Silas 'The Serpent' Retch"
      ],
      "rivals": [
        "Alex 'The Ace' Valour",
        "Leo 'Lionheart' Cruz",
        "\"Big Country\" Buck Donovan"
      ],
      "tagPartner": "Goliath",
      "stable": null
    },
    "metadata": {
      "morale": 75,
      "popularity": 76,
      "debutYear": 2008,
      "bio": "A wrecking ball of aggression who wants every show built around his dominance.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-johnny-spade",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Johnny Spade",
    "shortName": "Johnny Spade",
    "displayName": "Johnny Spade",
    "gender": "Male",
    "age": 31,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Tweener",
    "alignment": "Tweener",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "No Gimmick Needed",
    "status": "Active",
    "pushLevel": "Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 72,
    "charisma": 70,
    "speakingAbility": 72,
    "starPower": 74,
    "inRing": {
      "brawl": 70,
      "speed": 70,
      "technical": 70,
      "aerial": 68,
      "psychology": 74,
      "safety": 80
    },
    "physical": {
      "condition": 82,
      "momentum": 66,
      "durability": 76
    },
    "role": {
      "disposition": "Tweener",
      "archetype": "No Gimmick Needed",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Spade Splash",
    "finisherPrimaryType": "top_rope",
    "finisherSecondaryName": "No Limit Necklock",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Spade Splash",
          "moveType": "Top Rope"
        },
        {
          "name": "No Limit Necklock",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Per Appearance",
      "durationMonths": 12,
      "monthlySalary": 12000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 80,
      "motivation": 70,
      "friendliness": 78,
      "behaviorNotes": [
        "Versatile utility player",
        "Keeps morale loose backstage"
      ]
    },
    "relationships": {
      "allies": [
        "Kenji 'Codebreak' Tanaka",
        "\"Magic\" Marcus Flint"
      ],
      "rivals": [
        "Silas 'The Serpent' Retch"
      ],
      "tagPartner": "\"Magic\" Marcus Flint",
      "stable": null
    },
    "metadata": {
      "morale": 75,
      "popularity": 72,
      "debutYear": 2011,
      "bio": "Adaptable workhorse who can slide anywhere on the card and deliver.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-kenji-codebreak-tanaka",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Kenji 'Codebreak' Tanaka",
    "shortName": "Kenji Tanaka",
    "displayName": "Kenji 'Codebreak' Tanaka",
    "gender": "Male",
    "age": 29,
    "nationality": "Japan",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Cruiserweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Show Stealer",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 87,
    "charisma": 80,
    "speakingAbility": 74,
    "starPower": 86,
    "inRing": {
      "brawl": 70,
      "speed": 90,
      "technical": 95,
      "aerial": 88,
      "psychology": 90,
      "safety": 94
    },
    "physical": {
      "condition": 90,
      "momentum": 78,
      "durability": 82
    },
    "role": {
      "disposition": "Face",
      "archetype": "Show Stealer",
      "primaryDivision": "Cruiserweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Codebreak Kick",
    "finisherPrimaryType": "strike",
    "finisherSecondaryName": "Neon Armbar",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Codebreak Kick",
          "moveType": "Strike"
        },
        {
          "name": "Neon Armbar",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 36,
      "monthlySalary": 42000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 92,
      "motivation": 94,
      "friendliness": 76,
      "behaviorNotes": [
        "Meticulous planner",
        "Inspires younger high-flyers"
      ]
    },
    "relationships": {
      "allies": [
        "Trevor \"The Technician\" Reid",
        "Mia 'Showtime' Evans"
      ],
      "rivals": [
        "Dante \"Ironjaw\" Morales"
      ],
      "tagPartner": "Trevor \"The Technician\" Reid",
      "stable": null
    },
    "metadata": {
      "morale": 75,
      "popularity": 84,
      "debutYear": 2012,
      "bio": "Precision striker who obsesses over delivering match-of-the-night performances.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-leo-lionheart-cruz",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Leo 'Lionheart' Cruz",
    "shortName": "Leo Cruz",
    "displayName": "Leo 'Lionheart' Cruz",
    "gender": "Male",
    "age": 30,
    "nationality": "Mexico",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Hero",
    "status": "Active",
    "pushLevel": "Main Event",
    "injuryStatus": "Healthy",
    "overallRating": 83,
    "charisma": 85,
    "speakingAbility": 82,
    "starPower": 88,
    "inRing": {
      "brawl": 85,
      "speed": 80,
      "technical": 75,
      "aerial": 78,
      "psychology": 86,
      "safety": 88
    },
    "physical": {
      "condition": 88,
      "momentum": 76,
      "durability": 84
    },
    "role": {
      "disposition": "Face",
      "archetype": "Hero",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Lionheart Lariat",
    "finisherPrimaryType": "strike",
    "finisherSecondaryName": "Roaring Lion Tamer",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Lionheart Lariat",
          "moveType": "Strike"
        },
        {
          "name": "Roaring Lion Tamer",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 30,
      "monthlySalary": 33000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 86,
      "motivation": 90,
      "friendliness": 88,
      "behaviorNotes": [
        "Beloved locker-room glue",
        "Always thanks the crew"
      ]
    },
    "relationships": {
      "allies": [
        "Alex 'The Ace' Valour",
        "\"Big Country\" Buck Donovan",
        "\"Lightning\" Luke Lawson"
      ],
      "rivals": [
        "Silas 'The Serpent' Retch",
        "Dante \"Ironjaw\" Morales"
      ],
      "tagPartner": null,
      "stable": null
    },
    "metadata": {
      "morale": 75,
      "popularity": 86,
      "debutYear": 2011,
      "bio": "Fiery crowd favorite whose heart-on-sleeve promos rally the audience.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-mia-showtime-evans",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Mia 'Showtime' Evans",
    "shortName": "Mia Evans",
    "displayName": "Mia 'Showtime' Evans",
    "gender": "Female",
    "age": 26,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Lightweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Teen Idol",
    "status": "Active",
    "pushLevel": "Main Event",
    "injuryStatus": "Healthy",
    "overallRating": 82,
    "charisma": 90,
    "speakingAbility": 88,
    "starPower": 89,
    "inRing": {
      "brawl": 65,
      "speed": 85,
      "technical": 80,
      "aerial": 86,
      "psychology": 78,
      "safety": 84
    },
    "physical": {
      "condition": 87,
      "momentum": 88,
      "durability": 72
    },
    "role": {
      "disposition": "Face",
      "archetype": "Teen Idol",
      "primaryDivision": "Lightweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Showtime Stunner",
    "finisherPrimaryType": "strike",
    "finisherSecondaryName": "Spotlight Moonsault",
    "finisherSecondaryType": "top_rope",
    "moveSet": {
      "finishers": [
        {
          "name": "Showtime Stunner",
          "moveType": "Strike"
        },
        {
          "name": "Spotlight Moonsault",
          "moveType": "Top Rope"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 30,
      "monthlySalary": 32000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 84,
      "motivation": 93,
      "friendliness": 90,
      "behaviorNotes": [
        "Runs fan outreach events",
        "Embraces media obligations"
      ]
    },
    "relationships": {
      "allies": [
        "Eliza 'High-Flyer' Hayes",
        "Zara Storm",
        "\"Big Country\" Buck Donovan"
      ],
      "rivals": [
        "Cassidy Quinn",
        "Victoria 'The Queen' Black"
      ],
      "tagPartner": "Zara Storm",
      "stable": null
    },
    "metadata": {
      "morale": 75,
      "popularity": 90,
      "debutYear": 2014,
      "bio": "Pop-culture phenom who balances flashy performances with heartfelt fan connection.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-silas-the-serpent-retch",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Silas 'The Serpent' Retch",
    "shortName": "Silas Retch",
    "displayName": "Silas 'The Serpent' Retch",
    "gender": "Male",
    "age": 35,
    "nationality": "United Kingdom",
    "hometown": "Various Cities",
    "disposition": "Heel",
    "alignment": "Heel",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Evil",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 79,
    "charisma": 85,
    "speakingAbility": 80,
    "starPower": 83,
    "inRing": {
      "brawl": 80,
      "speed": 70,
      "technical": 80,
      "aerial": 62,
      "psychology": 89,
      "safety": 86
    },
    "physical": {
      "condition": 82,
      "momentum": 74,
      "durability": 80
    },
    "role": {
      "disposition": "Heel",
      "archetype": "Evil",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Serpent's Fang",
    "finisherPrimaryType": "submission",
    "finisherSecondaryName": "Venom Strike",
    "finisherSecondaryType": "strike",
    "moveSet": {
      "finishers": [
        {
          "name": "Serpent's Fang",
          "moveType": "Submission"
        },
        {
          "name": "Venom Strike",
          "moveType": "Strike"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 24,
      "monthlySalary": 34000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 74,
      "motivation": 88,
      "friendliness": 30,
      "behaviorNotes": [
        "Mind-game specialist",
        "Keeps personal circle tight"
      ]
    },
    "relationships": {
      "allies": [
        "Jax 'The Juggernaut' Stone",
        "Riot Reynolds",
        "Bishop Graves"
      ],
      "rivals": [
        "Alex 'The Ace' Valour",
        "\"Big Country\" Buck Donovan",
        "Leo 'Lionheart' Cruz"
      ],
      "tagPartner": "Riot Reynolds",
      "stable": "Night Shift"
    },
    "metadata": {
      "morale": 75,
      "popularity": 78,
      "debutYear": 2009,
      "bio": "Scheming manipulator who weaponizes whispers and paranoia.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-victoria-the-queen-black",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Victoria 'The Queen' Black",
    "shortName": "Victoria Black",
    "displayName": "Victoria 'The Queen' Black",
    "gender": "Female",
    "age": 33,
    "nationality": "United Kingdom",
    "hometown": "Various Cities",
    "disposition": "Heel",
    "alignment": "Heel",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Rich Snob",
    "status": "Active",
    "pushLevel": "Main Event",
    "injuryStatus": "Healthy",
    "overallRating": 82,
    "charisma": 95,
    "speakingAbility": 92,
    "starPower": 91,
    "inRing": {
      "brawl": 75,
      "speed": 70,
      "technical": 85,
      "aerial": 65,
      "psychology": 88,
      "safety": 87
    },
    "physical": {
      "condition": 84,
      "momentum": 86,
      "durability": 78
    },
    "role": {
      "disposition": "Heel",
      "archetype": "Rich Snob",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Royal Decree",
    "finisherPrimaryType": "slam",
    "finisherSecondaryName": "Crown Jewel Clutch",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Royal Decree",
          "moveType": "Slam"
        },
        {
          "name": "Crown Jewel Clutch",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 36,
      "monthlySalary": 41000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 82,
      "motivation": 85,
      "friendliness": 38,
      "behaviorNotes": [
        "Demands luxurious travel",
        "Sharp political instincts"
      ]
    },
    "relationships": {
      "allies": [
        "Cassidy Quinn",
        "Dante \"Ironjaw\" Morales"
      ],
      "rivals": [
        "Mia 'Showtime' Evans",
        "Zara Storm"
      ],
      "tagPartner": "Cassidy Quinn",
      "stable": "Glamour Syndicate"
    },
    "metadata": {
      "morale": 75,
      "popularity": 88,
      "debutYear": 2007,
      "bio": "Aristocratic tactician who rules the division through ego and strategy.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-wildcard-wade-ripley",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "\"Wildcard\" Wade Ripley",
    "shortName": "Wildcard Wade Ripley",
    "displayName": "\"Wildcard\" Wade Ripley",
    "gender": "Male",
    "age": 29,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Tweener",
    "alignment": "Tweener",
    "weightClass": "Cruiserweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Reckless Daredevil",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 75,
    "charisma": 78,
    "speakingAbility": 65,
    "starPower": 80,
    "inRing": {
      "brawl": 68,
      "speed": 92,
      "technical": 74,
      "aerial": 95,
      "psychology": 60,
      "safety": 55
    },
    "physical": {
      "condition": 82,
      "momentum": 76,
      "durability": 62
    },
    "role": {
      "disposition": "Tweener",
      "archetype": "Reckless Daredevil",
      "primaryDivision": "Cruiserweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Crash Landing",
    "finisherPrimaryType": "top_rope",
    "finisherSecondaryName": "Wild Shot Knee",
    "finisherSecondaryType": "strike",
    "moveSet": {
      "finishers": [
        {
          "name": "Crash Landing",
          "moveType": "Top Rope"
        },
        {
          "name": "Wild Shot Knee",
          "moveType": "Strike"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 18,
      "monthlySalary": 22000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 55,
      "motivation": 82,
      "friendliness": 70,
      "behaviorNotes": [
        "Thrill seeker",
        "Needs agent oversight to stay on script"
      ]
    },
    "relationships": {
      "allies": [
        "Eliza 'High-Flyer' Hayes",
        "Zara Storm"
      ],
      "rivals": [
        "Riot Reynolds"
      ],
      "tagPartner": "Zara Storm",
      "stable": null
    },
    "metadata": {
      "morale": 70,
      "popularity": 72,
      "debutYear": 2015,
      "bio": "Unpredictable stunt machine who can steal the show or derail it in equal measure.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-dante-ironjaw-morales",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Dante \"Ironjaw\" Morales",
    "shortName": "Dante Ironjaw Morales",
    "displayName": "Dante \"Ironjaw\" Morales",
    "gender": "Male",
    "age": 34,
    "nationality": "Brazil",
    "hometown": "Various Cities",
    "disposition": "Heel",
    "alignment": "Heel",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Submission Shooter",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 75,
    "charisma": 65,
    "speakingAbility": 70,
    "starPower": 78,
    "inRing": {
      "brawl": 82,
      "speed": 68,
      "technical": 92,
      "aerial": 40,
      "psychology": 88,
      "safety": 90
    },
    "physical": {
      "condition": 90,
      "momentum": 68,
      "durability": 85
    },
    "role": {
      "disposition": "Heel",
      "archetype": "Submission Shooter",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Ironjaw Clutch",
    "finisherPrimaryType": "submission",
    "finisherSecondaryName": "Mercy Breaker",
    "finisherSecondaryType": "strike",
    "moveSet": {
      "finishers": [
        {
          "name": "Ironjaw Clutch",
          "moveType": "Submission"
        },
        {
          "name": "Mercy Breaker",
          "moveType": "Strike"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 30,
      "monthlySalary": 38000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 88,
      "motivation": 86,
      "friendliness": 50,
      "behaviorNotes": [
        "Intense training regimen",
        "Keeps to himself on the road"
      ]
    },
    "relationships": {
      "allies": [
        "Victoria 'The Queen' Black",
        "Bishop Graves"
      ],
      "rivals": [
        "Trevor \"The Technician\" Reid",
        "Leo 'Lionheart' Cruz",
        "\"Lightning\" Luke Lawson"
      ],
      "tagPartner": null,
      "stable": null
    },
    "metadata": {
      "morale": 68,
      "popularity": 66,
      "debutYear": 2008,
      "bio": "Cold-blooded technician who twists limbs and minds with equal intensity.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-big-country-buck-donovan",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "\"Big Country\" Buck Donovan",
    "shortName": "Big Country Buck Donovan",
    "displayName": "\"Big Country\" Buck Donovan",
    "gender": "Male",
    "age": 36,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Heavyweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Blue-Collar Powerhouse",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 71,
    "charisma": 82,
    "speakingAbility": 78,
    "starPower": 84,
    "inRing": {
      "brawl": 88,
      "speed": 55,
      "technical": 68,
      "aerial": 35,
      "psychology": 75,
      "safety": 82
    },
    "physical": {
      "condition": 83,
      "momentum": 80,
      "durability": 88
    },
    "role": {
      "disposition": "Face",
      "archetype": "Blue-Collar Powerhouse",
      "primaryDivision": "Heavyweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Country Hammer",
    "finisherPrimaryType": "slam",
    "finisherSecondaryName": "Rustic Lock",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Country Hammer",
          "moveType": "Slam"
        },
        {
          "name": "Rustic Lock",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 24,
      "monthlySalary": 32000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 92,
      "motivation": 85,
      "friendliness": 88,
      "behaviorNotes": [
        "Community outreach staple",
        "Eats losses gracefully to help talent"
      ]
    },
    "relationships": {
      "allies": [
        "Alex 'The Ace' Valour",
        "Mia 'Showtime' Evans"
      ],
      "rivals": [
        "Silas 'The Serpent' Retch",
        "Riot Reynolds",
        "Bishop Graves"
      ],
      "tagPartner": null,
      "stable": null
    },
    "metadata": {
      "morale": 80,
      "popularity": 82,
      "debutYear": 2007,
      "bio": "Working-class hero whose handshake and haymaker carry equal weight.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-cassidy-quinn",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Cassidy Quinn",
    "shortName": "Cassidy Quinn",
    "displayName": "Cassidy Quinn",
    "gender": "Female",
    "age": 25,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Heel",
    "alignment": "Heel",
    "weightClass": "Lightweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Influencer Supreme",
    "status": "Active",
    "pushLevel": "Main Event",
    "injuryStatus": "Healthy",
    "overallRating": 74,
    "charisma": 94,
    "speakingAbility": 92,
    "starPower": 90,
    "inRing": {
      "brawl": 55,
      "speed": 78,
      "technical": 70,
      "aerial": 60,
      "psychology": 74,
      "safety": 68
    },
    "physical": {
      "condition": 86,
      "momentum": 88,
      "durability": 60
    },
    "role": {
      "disposition": "Heel",
      "archetype": "Influencer Supreme",
      "primaryDivision": "Lightweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Filter Drop",
    "finisherPrimaryType": "strike",
    "finisherSecondaryName": "Cancel Clutch",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Filter Drop",
          "moveType": "Strike"
        },
        {
          "name": "Cancel Clutch",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 24,
      "monthlySalary": 30000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 70,
      "motivation": 83,
      "friendliness": 40,
      "behaviorNotes": [
        "Demands spotlight",
        "Live-streams from gorilla position"
      ]
    },
    "relationships": {
      "allies": [
        "Victoria 'The Queen' Black",
        "Dante \"Ironjaw\" Morales"
      ],
      "rivals": [
        "Mia 'Showtime' Evans",
        "Zara Storm",
        "\"Lightning\" Luke Lawson"
      ],
      "tagPartner": "Victoria 'The Queen' Black",
      "stable": "Glamour Syndicate"
    },
    "metadata": {
      "morale": 77,
      "popularity": 79,
      "debutYear": 2018,
      "bio": "Social-media maven who weaponizes trend cycles to get under everyone’s skin.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-trevor-the-technician-reid",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Trevor \"The Technician\" Reid",
    "shortName": "Trevor The Technician Reid",
    "displayName": "Trevor \"The Technician\" Reid",
    "gender": "Male",
    "age": 30,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Pure Wrestling Expert",
    "status": "Active",
    "pushLevel": "Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 80,
    "charisma": 72,
    "speakingAbility": 68,
    "starPower": 76,
    "inRing": {
      "brawl": 70,
      "speed": 82,
      "technical": 94,
      "aerial": 65,
      "psychology": 88,
      "safety": 92
    },
    "physical": {
      "condition": 90,
      "momentum": 74,
      "durability": 80
    },
    "role": {
      "disposition": "Face",
      "archetype": "Pure Wrestling Expert",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Precision Lock",
    "finisherPrimaryType": "submission",
    "finisherSecondaryName": "Snapdragon Finale",
    "finisherSecondaryType": "slam",
    "moveSet": {
      "finishers": [
        {
          "name": "Precision Lock",
          "moveType": "Submission"
        },
        {
          "name": "Snapdragon Finale",
          "moveType": "Slam"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 36,
      "monthlySalary": 34000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 95,
      "motivation": 90,
      "friendliness": 75,
      "behaviorNotes": [
        "Tape-study junkie",
        "Always volunteering for clinics"
      ]
    },
    "relationships": {
      "allies": [
        "Kenji \"Codebreak\" Tanaka",
        "Alex 'The Ace' Valour"
      ],
      "rivals": [
        "Dante \"Ironjaw\" Morales",
        "Silas 'The Serpent' Retch"
      ],
      "tagPartner": "Kenji \"Codebreak\" Tanaka",
      "stable": null
    },
    "metadata": {
      "morale": 76,
      "popularity": 74,
      "debutYear": 2012,
      "bio": "Precision grappler obsessed with elevating the company’s in-ring reputation.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-riot-reynolds",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Riot Reynolds",
    "shortName": "Riot Reynolds",
    "displayName": "Riot Reynolds",
    "gender": "Male",
    "age": 31,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Heel",
    "alignment": "Heel",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Hardcore Punk Brawler",
    "status": "Active",
    "pushLevel": "Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 66,
    "charisma": 68,
    "speakingAbility": 62,
    "starPower": 72,
    "inRing": {
      "brawl": 88,
      "speed": 70,
      "technical": 60,
      "aerial": 55,
      "psychology": 62,
      "safety": 50
    },
    "physical": {
      "condition": 78,
      "momentum": 70,
      "durability": 82
    },
    "role": {
      "disposition": "Heel",
      "archetype": "Hardcore Punk Brawler",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Stage Dive",
    "finisherPrimaryType": "top_rope",
    "finisherSecondaryName": "Concrete Riot",
    "finisherSecondaryType": "strike",
    "moveSet": {
      "finishers": [
        {
          "name": "Stage Dive",
          "moveType": "Top Rope"
        },
        {
          "name": "Concrete Riot",
          "moveType": "Strike"
        }
      ]
    },
    "contract": {
      "contractType": "Per Appearance",
      "durationMonths": 12,
      "monthlySalary": 12000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 60,
      "motivation": 75,
      "friendliness": 45,
      "behaviorNotes": [
        "Prefers hardcore spots",
        "Needs producer to rein in chaos"
      ]
    },
    "relationships": {
      "allies": [
        "Silas 'The Serpent' Retch",
        "Bishop Graves"
      ],
      "rivals": [
        "\"Big Country\" Buck Donovan",
        "\"Wildcard\" Wade Ripley"
      ],
      "tagPartner": "Silas 'The Serpent' Retch",
      "stable": "Night Shift"
    },
    "metadata": {
      "morale": 72,
      "popularity": 68,
      "debutYear": 2010,
      "bio": "Hardcore lifer who treats every bout like the main event of a punk festival.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-magic-marcus-flint",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "\"Magic\" Marcus Flint",
    "shortName": "Magic Marcus Flint",
    "displayName": "\"Magic\" Marcus Flint",
    "gender": "Male",
    "age": 33,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Tweener",
    "alignment": "Tweener",
    "weightClass": "Lightweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Illusionist Showman",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 76,
    "charisma": 88,
    "speakingAbility": 90,
    "starPower": 78,
    "inRing": {
      "brawl": 60,
      "speed": 82,
      "technical": 72,
      "aerial": 85,
      "psychology": 70,
      "safety": 76
    },
    "physical": {
      "condition": 85,
      "momentum": 66,
      "durability": 60
    },
    "role": {
      "disposition": "Tweener",
      "archetype": "Illusionist Showman",
      "primaryDivision": "Lightweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Prestige Trick",
    "finisherPrimaryType": "top_rope",
    "finisherSecondaryName": "Sleight of Pain",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Prestige Trick",
          "moveType": "Top Rope"
        },
        {
          "name": "Sleight of Pain",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Per Appearance",
      "durationMonths": 12,
      "monthlySalary": 9000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 75,
      "motivation": 70,
      "friendliness": 85,
      "behaviorNotes": [
        "Keeps locker room loose",
        "Always pitching comedic skits"
      ]
    },
    "relationships": {
      "allies": [
        "Johnny Spade",
        "\"Lightning\" Luke Lawson"
      ],
      "rivals": [
        "Bishop Graves"
      ],
      "tagPartner": "Johnny Spade",
      "stable": null
    },
    "metadata": {
      "morale": 74,
      "popularity": 70,
      "debutYear": 2011,
      "bio": "Charismatic trickster blending comedy, athleticism, and fourth-wall breaking.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-zara-storm",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Zara Storm",
    "shortName": "Zara Storm",
    "displayName": "Zara Storm",
    "gender": "Female",
    "age": 24,
    "nationality": "Australia",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Lightweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Pop Idol High Flyer",
    "status": "Active",
    "pushLevel": "Main Event",
    "injuryStatus": "Healthy",
    "overallRating": 82,
    "charisma": 92,
    "speakingAbility": 85,
    "starPower": 88,
    "inRing": {
      "brawl": 58,
      "speed": 94,
      "technical": 78,
      "aerial": 97,
      "psychology": 68,
      "safety": 80
    },
    "physical": {
      "condition": 91,
      "momentum": 90,
      "durability": 64
    },
    "role": {
      "disposition": "Face",
      "archetype": "Pop Idol High Flyer",
      "primaryDivision": "Lightweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Storm Surge",
    "finisherPrimaryType": "top_rope",
    "finisherSecondaryName": "Idol Lock",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Storm Surge",
          "moveType": "Top Rope"
        },
        {
          "name": "Idol Lock",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 30,
      "monthlySalary": 28000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 82,
      "motivation": 95,
      "friendliness": 90,
      "behaviorNotes": [
        "Maintains intense choreography schedule",
        "Always media ready"
      ]
    },
    "relationships": {
      "allies": [
        "Mia 'Showtime' Evans",
        "\"Wildcard\" Wade Ripley"
      ],
      "rivals": [
        "Cassidy Quinn",
        "Bishop Graves"
      ],
      "tagPartner": "\"Wildcard\" Wade Ripley",
      "stable": null
    },
    "metadata": {
      "morale": 82,
      "popularity": 85,
      "debutYear": 2019,
      "bio": "Chart-topping idol whose athleticism and charisma are equal parts dazzling.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-bishop-graves",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "Bishop Graves",
    "shortName": "Bishop Graves",
    "displayName": "Bishop Graves",
    "gender": "Male",
    "age": 37,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Heel",
    "alignment": "Heel",
    "weightClass": "Middleweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Cult Mastermind",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 76,
    "charisma": 86,
    "speakingAbility": 93,
    "starPower": 85,
    "inRing": {
      "brawl": 72,
      "speed": 60,
      "technical": 75,
      "aerial": 50,
      "psychology": 95,
      "safety": 88
    },
    "physical": {
      "condition": 82,
      "momentum": 78,
      "durability": 79
    },
    "role": {
      "disposition": "Heel",
      "archetype": "Cult Mastermind",
      "primaryDivision": "Middleweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Requiem Driver",
    "finisherPrimaryType": "slam",
    "finisherSecondaryName": "Graves Consecration",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Requiem Driver",
          "moveType": "Slam"
        },
        {
          "name": "Graves Consecration",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Written",
      "durationMonths": 36,
      "monthlySalary": 40000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 82,
      "motivation": 76,
      "friendliness": 30,
      "behaviorNotes": [
        "Manipulative backstage politicking",
        "Keeps disciples close"
      ]
    },
    "relationships": {
      "allies": [
        "Silas 'The Serpent' Retch",
        "Riot Reynolds",
        "Dante \"Ironjaw\" Morales"
      ],
      "rivals": [
        "Alex 'The Ace' Valour",
        "\"Magic\" Marcus Flint",
        "\"Lightning\" Luke Lawson"
      ],
      "tagPartner": null,
      "stable": "Night Shift"
    },
    "metadata": {
      "morale": 73,
      "popularity": 81,
      "debutYear": 2005,
      "bio": "Sinister manipulator orchestrating chaos through whispers and indoctrination.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  },
  {
    "id": "pgw-lightning-luke-lawson",
    "datasetId": DEFAULT_DATASET_ID,
    "name": "\"Lightning\" Luke Lawson",
    "shortName": "Lightning Luke Lawson",
    "displayName": "\"Lightning\" Luke Lawson",
    "gender": "Male",
    "age": 22,
    "nationality": "United States",
    "hometown": "Various Cities",
    "disposition": "Face",
    "alignment": "Face",
    "weightClass": "Lightweight",
    "primaryStyle": "Hybrid",
    "secondaryStyle": null,
    "styleBlend": "Hybrid Indie",
    "gimmick": "Underdog Prospect",
    "status": "Active",
    "pushLevel": "Upper Midcard",
    "injuryStatus": "Healthy",
    "overallRating": 77,
    "charisma": 79,
    "speakingAbility": 74,
    "starPower": 80,
    "inRing": {
      "brawl": 60,
      "speed": 93,
      "technical": 75,
      "aerial": 88,
      "psychology": 65,
      "safety": 78
    },
    "physical": {
      "condition": 94,
      "momentum": 68,
      "durability": 60
    },
    "role": {
      "disposition": "Face",
      "archetype": "Underdog Prospect",
      "primaryDivision": "Lightweight",
      "secondaryDivision": null
    },
    "finisherPrimaryName": "Flashpoint Splash",
    "finisherPrimaryType": "top_rope",
    "finisherSecondaryName": "Quickstrike Clutch",
    "finisherSecondaryType": "submission",
    "moveSet": {
      "finishers": [
        {
          "name": "Flashpoint Splash",
          "moveType": "Top Rope"
        },
        {
          "name": "Quickstrike Clutch",
          "moveType": "Submission"
        }
      ]
    },
    "contract": {
      "contractType": "Per Appearance",
      "durationMonths": 12,
      "monthlySalary": 6000,
      "status": "Signed"
    },
    "personality": {
      "professionalism": 85,
      "motivation": 97,
      "friendliness": 92,
      "behaviorNotes": [
        "Always early to training",
        "Soaks up advice from veterans"
      ]
    },
    "relationships": {
      "allies": [
        "Alex 'The Ace' Valour",
        "Zara Storm",
        "\"Magic\" Marcus Flint"
      ],
      "rivals": [
        "Bishop Graves",
        "Dante \"Ironjaw\" Morales"
      ],
      "tagPartner": null,
      "stable": null
    },
    "metadata": {
      "morale": 78,
      "popularity": 74,
      "debutYear": 2021,
      "bio": "High-voltage upstart determined to prove he belongs in the main-event conversation.",
      "homePromotion": "PGW"
    },
    "accolades": [],
    "tags": []
  }
];

export default { DEFAULT_COMPANY, DEFAULT_WRESTLERS, DEFAULT_DATASET_ID };
