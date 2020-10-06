const cardBg = {
  colors: {
    yellow: '#ffb600', 
    magenta: '#ff007b', 
    purple: '#af5eff',
    seaGreen: '#06df9b'
  }
}

export const DEFAULT_GAME_DIMENSION = {
  width: 950,
  height: 550
}

export const ORIENTATION_ANY = 'any'
export const ORIENTATION_PORTRAIT = 'portrait'
export const ORIENTATION_LANDSCAPE = 'landscape'

export const GAME_DETAILS = [
  {
    name: "World of Mines",
    image: "wom.gif",
    color: cardBg.colors.yellow,
    type: "unity",
    button: "Play",
    route: "wom",
    screenOrientation: ORIENTATION_LANDSCAPE,
  },
  {
    name: "TOSIOS",
    image: "tosios.gif",
    color: cardBg.colors.magenta,
    type: "pixijs",
    button: "Play",
    route: "new",
    screenOrientation: ORIENTATION_ANY,
    options: {
      mode: "score attack",
      roomMap: "small",
      roomMaxPlayers: "1",
      roomName: ""
    }
  },
  {
    name: "Battle Racers",
    image: "br.gif",
    color: cardBg.colors.purple,
    button: "Coming Soon",
    type: "teaser",
    screenOrientation: ORIENTATION_ANY,
  },
  {
    name: "Flappy Bird Open-Source",
    image: "flappybird.gif",
    color: cardBg.colors.seaGreen,
    type: "unity",
    button: "Play",
    route: "flappybird",
    screenOrientation: ORIENTATION_PORTRAIT,
  },

];