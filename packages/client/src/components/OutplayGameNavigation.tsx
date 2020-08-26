import React, { Component } from "react";
import styled from "styled-components";
import { Flex, Box, Link } from "rimble-ui";

const StyledLinkContainer = styled(Box)`
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  width: 100%;  

  a {
    color: #a8a8a8;
  }
  a:hover {
    color: #0093d5;
    text-decoration: none;
    transition: 300ms ease;
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
`;

const StyledNavigation = styled(Flex)`
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  flex-direction: column;
  margin-bottom: 2rem;
  width: 100%;

  a {
    font-size: 1.266rem;
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    margin-bottom: 4.375rem;

    a {
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
          <Link
            to={"/"}
            p={3}
          >
            &#10229; <StyledSpan>Back to Home</StyledSpan> 
          </Link>
        </StyledLinkContainer>   
      </StyledNavigation>
    )
  }
}

export default OutplayGameNavigation;