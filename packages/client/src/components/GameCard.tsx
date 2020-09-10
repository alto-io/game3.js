import React from "react";
import { Card, Button, Flex, Box, Text } from "rimble-ui";
import styled from "styled-components";
import RainbowImage from "./RainbowImage";
import { navigate } from '@reach/router';
import qs from 'querystringify';

function GameCard({
  game
}) {

  const StyledGameCard = styled(Card)`
    background: ${game.color};
    border-radius: 10px;
    box-shadow: 4px 6px 12px rgba(0,0,0,0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    margin: 0;
    padding: 1rem 1.5rem;
  `

  const StyledButton = styled(Button)`
    font-family: 'Apercu Light';
    font-size: 1rem;
    letter-spacing: 0.5px;
    margin: 1.625rem 0;
    text-transform: uppercase;

    @media screen and (min-width: 1024px) {
      font-size: 0.825rem;
      letter-spacing: 1.25px;
    }
  `

  const handleCreateRoomClick = () => {
    switch (game.name) {
      case "World of Mines":
        navigate(`/game/wom`);
      break;
      case "Flappy Bird Open-Source":
        navigate(`/game/flappybird`);
      break;

      case "TOSIOS":
        game.options.playerName = "You";
        navigate(`/game/new${qs.stringify(game.options, true)}`);
      break;
    }
  };

  return (
    <Box width={[1, 1/2, 1/2, 1/3 ]} p={3}>
      <StyledGameCard>
        <Flex justifyContent={"center"} mt={3} mb={4}>
          <RainbowImage src={"images/" + game.image} />
        </Flex>

        <Flex justifyContent={"center"} mt={3} mb={4}>
            <Text fontWeight={600} lineHeight={"1em"} fontSize={[4, 3, 3]}>
                {game.name}
            </Text>
        </Flex>

        <StyledButton
          type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
          name={"recepient"} // set the name to the method's argument key
          onClick={handleCreateRoomClick}
        >
            {game.button}
        </StyledButton>
      </StyledGameCard>
    </Box>
  );
}

export default GameCard;
