import React, { Component } from "react";

const screenSizeContext = React.createContext({});

class ScreenSizeProvider extends Component {
  mobileWidth: number;

  constructor(props) {
    super(props);
    this.state = {}

    this.mobileWidth = 728;
  }

}

export default ScreenSizeProvider;