import React, { Component } from "react";
import { Box, Flex } from "rimble-ui";
import styled from "styled-components";
import { isThisHour } from "date-fns";

const BurgerContainer = styled(Flex)`
  cursor: pointer;
`

const BurgerDiv = styled(Box)`
  background-color: #212121;
  border-radius:  25px;
  margin: 2px auto;
  width: 25px;
  height: 3px;
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
        <BurgerDiv></BurgerDiv>
        <BurgerDiv></BurgerDiv>
        <BurgerDiv></BurgerDiv>
      </BurgerContainer>
      </>
    )
  }
}

export default NavBarHamburger;