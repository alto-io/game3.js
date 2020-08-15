import React from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import { Box, Flex, Text, Link } from "rimble-ui";

class DashboardView extends React.Component<any, any> {

    render() {

        return (
            <Box maxWidth={"1180px"} p={3} mx={"auto"}>
            <Text my={4} />
                <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
                Coming Soon!
                </Flex>
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
  
  export default drizzleConnect(DashboardView, mapStateToProps);