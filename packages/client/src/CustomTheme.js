import { theme as rimbleTheme } from "rimble-ui";

const CustomTheme = {
  ...rimbleTheme,
  colors: {
    ...rimbleTheme.colors,
    primary: '#4E1750',
    opYellow: '#FFB600',
    opSeaGreen: '#06DF9B',
    opMagenta: '#FF007B',
    opPurple: '#AF5EFF',
    opBlue: '#0093D5',
    opSkyBlue: '#A1DBE7',
  },
  fonts: {
    ...rimbleTheme.fonts.serif,
    sansSerif: '"Apercu Light", sans-serif',
  },
  buttonSizes: {
    ...rimbleTheme.buttonSizes,
    small : {
      fontSize: '0.75rem',
      height: '2rem',
      minWidth: '2rem',
      letterSpacing: '0.4px',
      padding: '0 1rem',
    },
  }
};

export default CustomTheme;
