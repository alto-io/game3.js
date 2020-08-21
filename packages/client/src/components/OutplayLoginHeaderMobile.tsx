import React, { Component } from "react";
import { Flex, Button, Link } from "rimble-ui";

class OutplayLoginHeaderMobile extends Component {
  render () {
    return (
      <>
        <Flex justifyContent={"space-between"} p={3} bg={"white"}>
          <Link title={ "Back to Home" }>LOGO HERE</Link>
      
          <Button>Connect your Wallet</Button>

           {/* Navbar Hamburger Here  */}
        </Flex>
      </>
    )
  }
}

export default OutplayLoginHeaderMobile;