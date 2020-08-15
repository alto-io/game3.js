import React from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import { Box, Flex, Text, Link } from "rimble-ui";

class WalletView extends React.Component<any, any> {

    render() {

        return (
          <Box>
            Coming Soon!
          </Box>
        );
      }

}
/*
 * Export connected component.
 */
const mapStateToProps = state => {
    return {
    };
  };
  
  export default drizzleConnect(WalletView, mapStateToProps);