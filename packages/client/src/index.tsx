import * as React from "react";
import * as ReactDOM from "react-dom";

import DrizzleLoader from "./components/DrizzleLoader";
import * as serviceWorker from './serviceWorker';

// Theming for look and feel

import { ThemeProvider } from "styled-components";
import CustomTheme from "./CustomTheme";
import './index.css';
import ScreenSizeProvider from "./components/ScreenSizeProvider";

// import { createGlobalStyle } from "styled-components";
// import { globalStyle } from "./styles";

// const GlobalStyle = createGlobalStyle`
//   ${globalStyle}
// `;

declare global {
  // tslint:disable-next-line
  interface Window {
    blockies: any;
  }
}

ReactDOM.render(
  <>
    {/*<GlobalStyle/>*/}
    <ThemeProvider theme={CustomTheme}>
      <ScreenSizeProvider>
        <DrizzleLoader />
      </ScreenSizeProvider>
    </ThemeProvider>
  </>,
  document.getElementById("root"),
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
