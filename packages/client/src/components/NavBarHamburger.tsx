import React, { Component } from "react";
import { Box, Flex } from "rimble-ui";
import styled from "styled-components";
import { isThisHour } from "date-fns";

const BurgerContainer = styled(Flex)`
  cursor: pointer;
  .active1 {
    transform: rotate(45deg) translate(7px, 3px);
  }

  .active2{
    opacity: 0;
  }

  .active3 {
    transform: rotate(-45deg) translate(7px, -3px);
  }

  z-index: 5;
`

const BurgerDiv = styled(Box)`
  background-color: #212121;
  border-radius:  25px;
  margin: 2px auto;
  width: 25px;
  height: 3px;
  transition: 300ms ease-in-out;
`
class NavBarHamburger extends Component {
  render() {
    return (
      <>
      <BurgerContainer 
          justifyContent={"center"} 
          alignItems={"center"} 
          flexDirection={"column"}
          onClick={this.props.handleBurger} 
      >
        <BurgerDiv className={this.props.isOpen ? "active1" : ""}></BurgerDiv>
        <BurgerDiv className={this.props.isOpen ? "active2" : ""}></BurgerDiv>
        <BurgerDiv className={this.props.isOpen ? "active3" : ""}></BurgerDiv>
      </BurgerContainer>
      </>
    )
  }
}

export default NavBarHamburger;