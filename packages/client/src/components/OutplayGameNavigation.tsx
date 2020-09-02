import React, { Component } from "react";
import styled from "styled-components";
import { Flex, Box } from "rimble-ui";
import { navigateTo } from '../helpers/utilities';

const StyledLinkContainer = styled(Box)`
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  transition: 300ms ease;
  width: 100%;  

  span {
    color: #a8a8a8;
    font-weight: bold;
  }

  span:hover {
    color: #0093d5;
    text-decoration: none;
    
  }

  @media screen and (min-width: 768px) {
    text-align: center;
  }

  @media screen and (min-width: 1024px) {
    width: 968px;
  }
`;

const StyledSpan = styled.span`
  margin-left: 0.5rem;
  cursor: pointer;
`;

const StyledNavigation = styled(Flex)`
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  flex-direction: column;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  width: 100%;

  span {
    font-size: 1.266rem;
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    margin-bottom: 4.375rem;

    span {
      font-size: 1rem;
    }
  }
`;

class OutplayGameNavigation extends Component {

  render() {
    return(
      <StyledNavigation>
        <StyledLinkContainer
          mx={3}
          borderRadius={1}
        > 
          <StyledSpan  onClick={() => navigateTo('/')}>&#10229; Back to Home</StyledSpan> 
        </StyledLinkContainer>   
      </StyledNavigation>
    )
  }
}

export default OutplayGameNavigation;