import React, { useState, useEffect, createContext } from "react";

// shares the state to multiple components
const screenSizeContext = createContext({});

// provider context to store the state and the logic
const ScreenSizeProvider = ({ children }) => {
    // set state of width, height, and breakpoint
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
    // no dependencies so the useEffect would run when the component  mounts and not when it updates
    useEffect(()=>{
      // updates the states
      const handleWindowResize = () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
        setIsMobile(window.innerWidth < 768);
      }
  
      // add listener to window
      window.addEventListener("resize", handleWindowResize);

      // remove listener so it wont constantly be called
      return () => window.removeEventListener("resize", handleWindowResize);
    },[])
  
    // store the values inside the provider
    return (
      <screenSizeContext.Provider value={{ screenWidth, screenHeight, isMobile }}>
        {children}
      </screenSizeContext.Provider>
    );
}

export default ScreenSizeProvider;