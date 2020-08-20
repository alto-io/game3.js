const cardBg = {
  colors: {
    yellow: '#ffb600', 
    magenta: '#ff007b', 
    purple: '#af5eff',
    seaGreen: '#06df9b'
  }
}

export const GAME_DETAILS = [
  {
    name: "World of Mines",
    image: "wom.gif",
    color: cardBg.colors.yellow,
    type: "unity",
    button: "Play",
    route: "wom"
  },
  {
    name: "TOSIOS",
    image: "tosios.gif",
    color: cardBg.colors.magenta,
    type: "pixijs",
    button: "Play",
    route: "new",
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
    type: "teaser"
  },

];