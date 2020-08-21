import React, { Component } from "react";
import { Flex, Button, Link, Image } from "rimble-ui";
import styled  from "styled-components";

const StyledButton = styled(Button)`
  font-family: 'Apercu Light';
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`
class OutplayLoginHeaderMobile extends Component {
  render () {
    const {
      handleClickLogo,
      handleConnectAccount,
      logo
    } = this.props;

    return (
      <>
        <Flex justifyContent={"space-between"} p={3} bg={"white"}>
          <Link title={ "Back to Home" }>
            <Image 
                pr={2}
                borderColor={"white"}
                overflow={"hidden"}
                src={logo}
                onClick={handleClickLogo}
            />
          </Link>
      
          <StyledButton 
              color="primary"
              size="small"
              onClick={handleConnectAccount}>
            Connect your Wallet
          </StyledButton>

           {/* Navbar Hamburger Here  */}
        </Flex>
      </>
    )
  }
}

export default OutplayLoginHeaderMobile;