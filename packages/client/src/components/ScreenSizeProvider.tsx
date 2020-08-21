import React, { Component } from "react";

const screenSizeContext = React.createContext({});

class ScreenSizeProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth <= 768
    }
  }

    componentDidMount () {
      window.addEventListener('resize', this.handleResize)

      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768
      })
    }

    componentDidUnMount () {
      window.removeEventListener('resize', this.handleResize)
    }

    render() {
      return (
        <screenSizeContext.Provider value={ {state: this.state } }>
          { this.props.children }
        </screenSizeContext.Provider>
      )
    }

    handleResize = () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <=  768
      })
    }
}

export default ScreenSizeProvider;