import React, { Component } from "react";
import { Card, Heading, Flex, Box, Button, Text } from "rimble-ui";
import RainbowImage from "./RainbowImage";


class PlayerTournamentResults extends Component {
  render() {
    return(
      <Card px={3} py={4}>
        <Heading as={"h2"}>Your Tournament Results</Heading>

        <Flex>
          <RainbowImage />
          <Box ml={3}>
            <Text>Game Name - Tournament Name</Text>
            <Heading as={"h3"}>Message Here</Heading>
            <Button>Button Here</Button>
          </Box>
        </Flex>
      </Card>
    )
  }
}

export default PlayerTournamentResults;
