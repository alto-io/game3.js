"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_TITLE = 'Game3.js';
// General
exports.WS_PORT = 3001;
exports.ROOM_NAME = 'game'; // Colyseus Room<T>'s name (no need to change)
exports.ROOM_REFRESH = 3000;
exports.DEBUG = false;
// GAME NAMES
exports.TOSIOS = 'tosios';
exports.WOM = 'wom';
exports.FP = 'fp';
// GAME IMAGES
exports.TOSIOS_IMG = 'tosios.gif';
exports.WOM_IMG = 'wom.gif';
exports.FP_IMG = 'flappybird.gif';
// Game
exports.MAPS_NAMES = ['small', 'gigantic'];
exports.ROOM_PLAYERS_MIN = 1;
exports.ROOM_PLAYERS_MAX = 16;
exports.ROOM_PLAYERS_SCALES = [1, 2, 4, 8, 16];
exports.ROOM_NAME_MAX = 16;
exports.PLAYER_NAME_MAX = 16;
exports.LOG_LINES_MAX = 5;
exports.LOBBY_DURATION = 1000 * 10; // 10 seconds
exports.GAME_DURATION = 1000 * 90; // 90 seconds
exports.GAME_MODES = ['score attack', 'deathmatch', 'team deathmatch'];
// Background
exports.BACKGROUND_COLOR = '#25131A';
// Tile (rectangle)
exports.TILE_SIZE = 32;
// Player (circle)
exports.PLAYER_SIZE = 32;
exports.PLAYER_SPEED = 3;
exports.PLAYER_MAX_LIVES = 3;
exports.PLAYER_WEAPON_SIZE = 12; // The bigger, the further away a bullet will be shot from.
// Monster
exports.MONSTERS_COUNT = 3;
exports.MONSTER_SIZE = 32;
exports.MONSTER_SPEED_PATROL = 0.75;
exports.MONSTER_SPEED_CHASE = 1.25;
exports.MONSTER_SIGHT = 128;
exports.MONSTER_LIVES = 3;
exports.MONSTER_IDLE_DURATION_MIN = 1000;
exports.MONSTER_IDLE_DURATION_MAX = 3000;
exports.MONSTER_PATROL_DURATION_MIN = 1000;
exports.MONSTER_PATROL_DURATION_MAX = 3000;
exports.MONSTER_ATTACK_BACKOFF = 3000;
// Props (rectangle)
exports.FLASKS_COUNT = 3;
exports.FLASK_SIZE = 24;
// Bullet (circle)
exports.BULLET_SIZE = 4;
exports.BULLET_SPEED = 12;
exports.BULLET_RATE = 400; // The bigger, the slower.
exports.GAME_ID_ARRAY = [
    {
        "value": "",
        "label": "-- Select --"
    },
    {
        "value": "wom",
        "label": "World of Mines"
    },
    {
        "value": "fp",
        "label": "Flappy Bird"
    },
    {
        "value": "tosios",
        "label": "TOSIOS"
    },
];
exports.WOM_COUNTRIES_ARRAY = [
    {
        "value": "Tourney",
        "label": "None"
    },
    {
        "value": "Russia",
        "label": "Russia"
    },
    {
        "value": "Mongolia",
        "label": "Mongolia"
    },
    {
        "value": "China",
        "label": "China"
    },
    {
        "value": "North Korea",
        "label": "North Korea"
    },
    {
        "value": "South Korea",
        "label": "South Korea"
    },
    {
        "value": "Japan",
        "label": "Japan"
    },
    {
        "value": "Kazakhstan",
        "label": "Kazakhstan"
    },
    {
        "value": "Uzbekistan",
        "label": "Uzbekistan"
    },
    {
        "value": "Turkmenistan",
        "label": "Turkmenistan"
    },
    {
        "value": "Afghanistan",
        "label": "Afghanistan"
    },
    {
        "value": "Pakistan",
        "label": "Pakistan"
    },
    {
        "value": "Kyrgyzstan",
        "label": "Kyrgyzstan"
    },
    {
        "value": "Tajikistan",
        "label": "Tajikistan"
    },
    {
        "value": "India",
        "label": "India"
    },
    {
        "value": "Nepal",
        "label": "Nepal"
    },
    {
        "value": "Bhutan",
        "label": "Bhutan"
    },
    {
        "value": "Bangladesh",
        "label": "Bangladesh"
    },
    {
        "value": "Myanmar",
        "label": "Myanmar"
    },
    {
        "value": "Thailand",
        "label": "Thailand"
    },
    {
        "value": "Malaysia",
        "label": "Malaysia"
    },
    {
        "value": "Lao People's Democratic Republic",
        "label": "Lao People's Democratic Republic"
    },
    {
        "value": "Vietnam",
        "label": "Vietnam"
    },
    {
        "value": "Cambodia",
        "label": "Cambodia"
    },
    {
        "value": "Indonesia",
        "label": "Indonesia"
    },
    {
        "value": "Brunei Darussalam",
        "label": "Brunei Darussalam"
    },
    {
        "value": "Taiwan",
        "label": "Taiwan"
    },
    {
        "value": "Philippines",
        "label": "Philippines"
    },
    {
        "value": "Papua New Guinea",
        "label": "Papua New Guinea"
    },
    {
        "value": "Australia",
        "label": "Australia"
    },
    {
        "value": "New Zealand",
        "label": "New Zealand"
    },
    {
        "value": "New Caledonia",
        "label": "New Caledonia"
    },
    {
        "value": "Fiji",
        "label": "Fiji"
    },
    {
        "value": "Vanuatu",
        "label": "Vanuatu"
    },
    {
        "value": "Solomon Islands",
        "label": "Solomon Islands"
    },
    {
        "value": "Timor-Leste",
        "label": "Timor-Leste"
    },
    {
        "value": "Sri Lanka",
        "label": "Sri Lanka"
    },
    {
        "value": "Iran",
        "label": "Iran"
    },
    {
        "value": "Iraq",
        "label": "Iraq"
    },
    {
        "value": "Saudi Arabia",
        "label": "Saudi Arabia"
    },
    {
        "value": "Oman",
        "label": "Oman"
    },
    {
        "value": "United Arab Emirates",
        "label": "United Arab Emirates"
    },
    {
        "value": "Yemen",
        "label": "Yemen"
    },
    {
        "value": "Qatar",
        "label": "Qatar"
    },
    {
        "value": "Kuwait",
        "label": "Kuwait"
    },
    {
        "value": "Azerbaijan",
        "label": "Azerbaijan"
    },
    {
        "value": "Armenia",
        "label": "Armenia"
    },
    {
        "value": "Georgia",
        "label": "Georgia"
    },
    {
        "value": "Turkey",
        "label": "Turkey"
    },
    {
        "value": "Ukraine",
        "label": "Ukraine"
    },
    {
        "value": "Belarus",
        "label": "Belarus"
    },
    {
        "value": "Lithuania",
        "label": "Lithuania"
    },
    {
        "value": "Latvia",
        "label": "Latvia"
    },
    {
        "value": "Estonia",
        "label": "Estonia"
    },
    {
        "value": "Poland",
        "label": "Poland"
    },
    {
        "value": "Czech Republic",
        "label": "Czech Republic"
    },
    {
        "value": "Slovakia",
        "label": "Slovakia"
    },
    {
        "value": "Hungary",
        "label": "Hungary"
    },
    {
        "value": "Romania",
        "label": "Romania"
    },
    {
        "value": "Moldova",
        "label": "Moldova"
    },
    {
        "value": "Bulgaria",
        "label": "Bulgaria"
    },
    {
        "value": "Greece",
        "label": "Greece"
    },
    {
        "value": "Syria",
        "label": "Syria"
    },
    {
        "value": "Jordan",
        "label": "Jordan"
    },
    {
        "value": "Lebanon",
        "label": "Lebanon"
    },
    {
        "value": "Israel",
        "label": "Israel"
    },
    {
        "value": "Palestinian Territories",
        "label": "Palestinian Territories"
    },
    {
        "value": "Cyprus",
        "label": "Cyprus"
    },
    {
        "value": "Finland",
        "label": "Finland"
    },
    {
        "value": "Sweden",
        "label": "Sweden"
    },
    {
        "value": "Norway",
        "label": "Norway"
    },
    {
        "value": "Germany",
        "label": "Germany"
    },
    {
        "value": "Denmark",
        "label": "Denmark"
    },
    {
        "value": "Austria",
        "label": "Austria"
    },
    {
        "value": "Italy",
        "label": "Italy"
    },
    {
        "value": "Slovenia",
        "label": "Slovenia"
    },
    {
        "value": "Croatia",
        "label": "Croatia"
    },
    {
        "value": "Bosnia and Herzegovina",
        "label": "Bosnia and Herzegovina"
    },
    {
        "value": "Montenegro",
        "label": "Montenegro"
    },
    {
        "value": "Serbia",
        "label": "Serbia"
    },
    {
        "value": "Macedonia",
        "label": "Macedonia(FYROM)"
    },
    {
        "value": "Albania",
        "label": "Albania"
    },
    {
        "value": "Kosovo",
        "label": "Kosovo"
    },
    {
        "value": "France",
        "label": "France"
    },
    {
        "value": "Belgium",
        "label": "Belgium"
    },
    {
        "value": "Netherlands",
        "label": "Netherlands"
    },
    {
        "value": "Switzerland",
        "label": "Switzerland"
    },
    {
        "value": "Luxembourg",
        "label": "Luxembourg"
    },
    {
        "value": "United Kingdom",
        "label": "United Kingdom"
    },
    {
        "value": "Ireland",
        "label": "Ireland"
    },
    {
        "value": "Spain",
        "label": "Spain"
    },
    {
        "value": "Portugal",
        "label": "Portugal"
    },
    {
        "value": "Svalbard and Jan Mayen",
        "label": "Svalbard and Jan Mayen"
    },
    {
        "value": "Egypt",
        "label": "Egypt"
    },
    {
        "value": "Libya",
        "label": "Libya"
    },
    {
        "value": "Tunisia",
        "label": "Tunisia"
    },
    {
        "value": "Algeria",
        "label": "Algeria"
    },
    {
        "value": "Morocco",
        "label": "Morocco"
    },
    {
        "value": "Western Sahara",
        "label": "Western Sahara"
    },
    {
        "value": "Mauritania",
        "label": "Mauritania"
    },
    {
        "value": "Senegal",
        "label": "Senegal"
    },
    {
        "value": "Gambia",
        "label": "Gambia"
    },
    {
        "value": "Mali",
        "label": "Mali"
    },
    {
        "value": "Niger",
        "label": "Niger"
    },
    {
        "value": "Chad",
        "label": "Chad"
    },
    {
        "value": "Cameroon",
        "label": "Cameroon"
    },
    {
        "value": "Equatorial Guinea",
        "label": "Equatorial Guinea"
    },
    {
        "value": "Gabon",
        "label": "Gabon"
    },
    {
        "value": "Guinea-Bissau",
        "label": "Guinea-Bissau"
    },
    {
        "value": "Guinea",
        "label": "Guinea"
    },
    {
        "value": "Sierra Leone",
        "label": "Sierra Leone"
    },
    {
        "value": "Burkina Faso",
        "label": "Burkina Faso"
    },
    {
        "value": "Nigeria",
        "label": "Nigeria"
    },
    {
        "value": "Benin",
        "label": "Benin"
    },
    {
        "value": "Togo",
        "label": "Togo"
    },
    {
        "value": "Ghana",
        "label": "Ghana"
    },
    {
        "value": "Cote d'Ivoire",
        "label": "Cote d'Ivoire"
    },
    {
        "value": "Liberia",
        "label": "Liberia"
    },
    {
        "value": "Sudan",
        "label": "Sudan"
    },
    {
        "value": "Ethiopia",
        "label": "Ethiopia"
    },
    {
        "value": "South Sudan",
        "label": "South Sudan"
    },
    {
        "value": "Eritrea",
        "label": "Eritrea"
    },
    {
        "value": "Somalia",
        "label": "Somalia"
    },
    {
        "value": "Djibouti",
        "label": "Djibouti"
    },
    {
        "value": "Kenya",
        "label": "Kenya"
    },
    {
        "value": "Uganda",
        "label": "Uganda"
    },
    {
        "value": "Tanzania",
        "label": "Tanzania"
    },
    {
        "value": "Mozambique",
        "label": "Mozambique"
    },
    {
        "value": "Malawi",
        "label": "Malawi"
    },
    {
        "value": "Central African Republic",
        "label": "Central African Republic"
    },
    {
        "value": "Democratic Republic of Congo",
        "label": "Democratic Republic of Congo"
    },
    {
        "value": "Rwanda",
        "label": "Rwanda"
    },
    {
        "value": "Burundi",
        "label": "Burundi"
    },
    {
        "value": "Republic of Congo",
        "label": "Republic of Congo"
    },
    {
        "value": "Angola",
        "label": "Angola"
    },
    {
        "value": "Zambia",
        "label": "Zambia"
    },
    {
        "value": "Namibia",
        "label": "Namibia"
    },
    {
        "value": "Botswana",
        "label": "Botswana"
    },
    {
        "value": "Zimbabwe",
        "label": "Zimbabwe"
    },
    {
        "value": "South Africa",
        "label": "South Africa"
    },
    {
        "value": "Lesotho",
        "label": "Lesotho"
    },
    {
        "value": "Swaziland",
        "label": "Swaziland"
    },
    {
        "value": "Madagascar",
        "label": "Madagascar"
    },
    {
        "value": "Iceland",
        "label": "Iceland"
    },
    {
        "value": "Greenland",
        "label": "Greenland"
    },
    {
        "value": "Canada",
        "label": "Canada"
    },
    {
        "value": "United States",
        "label": "United States"
    },
    {
        "value": "United States(Alaska)",
        "label": "United States(Alaska)"
    },
    {
        "value": "Mexico",
        "label": "Mexico"
    },
    {
        "value": "Guatemala",
        "label": "Guatemala"
    },
    {
        "value": "Belize",
        "label": "Belize"
    },
    {
        "value": "Honduras",
        "label": "Honduras"
    },
    {
        "value": "El Salvador",
        "label": "El Salvador"
    },
    {
        "value": "Nicaragua",
        "label": "Nicaragua"
    },
    {
        "value": "Costa Rica",
        "label": "Costa Rica"
    },
    {
        "value": "Panama",
        "label": "Panama"
    },
    {
        "value": "Cuba",
        "label": "Cuba"
    },
    {
        "value": "Bahamas",
        "label": "Bahamas"
    },
    {
        "value": "Jamaica",
        "label": "Jamaica"
    },
    {
        "value": "Haiti",
        "label": "Haiti"
    },
    {
        "value": "Dominican Republic",
        "label": "Dominican Republic"
    },
    {
        "value": "Puerto Rico",
        "label": "Puerto Rico"
    },
    {
        "value": "Colombia",
        "label": "Colombia"
    },
    {
        "value": "Venezuela",
        "label": "Venezuela"
    },
    {
        "value": "Ecuador",
        "label": "Ecuador"
    },
    {
        "value": "Guyana",
        "label": "Guyana"
    },
    {
        "value": "Suriname",
        "label": "Suriname"
    },
    {
        "value": "French Guiana",
        "label": "French Guiana"
    },
    {
        "value": "Brazil",
        "label": "Brazil"
    },
    {
        "value": "Peru",
        "label": "Peru"
    },
    {
        "value": "Bolivia",
        "label": "Bolivia"
    },
    {
        "value": "Paraguay",
        "label": "Paraguay"
    },
    {
        "value": "Argentina",
        "label": "Argentina"
    },
    {
        "value": "Trinidad and Tobago",
        "label": "Trinidad and Tobago"
    },
    {
        "value": "Chile",
        "label": "Chile"
    },
    {
        "value": "Uruguay",
        "label": "Uruguay"
    },
    {
        "value": "Falkland Islands",
        "label": "Falkland Islands"
    },
    {
        "value": "French Southern and Antarctic Lands",
        "label": "French Southern and Antarctic Lands"
    }
];
//# sourceMappingURL=constants.js.map