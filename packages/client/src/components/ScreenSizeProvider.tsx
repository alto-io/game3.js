import React, { Component, createContext } from "react";

export const ScreenSizeContext = createContext({});

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

    componentWillUnmount () {
      window.removeEventListener('resize', this.handleResize)
    }

    handleResize = () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <=  768
      })
    }

    render() {
      return (
        <ScreenSizeContext.Provider value={ {...this.state} }>
          { this.props.children }
        </ScreenSizeContext.Provider>
      )
    }
}

export default ScreenSizeProvider;