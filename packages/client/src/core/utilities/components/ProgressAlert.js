import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Flex, Text, Button, Image } from "rimble-ui";
import styled from "styled-components";
import transferringIcon from "./multipleTxIcon.svg";
import ProgressBar from "./ProgressBar";

function ProgressAlert({
  progressAlert,
  toggleProgressAlert,
  getPercentComplete,
  getTimeToCompletionString
}) {
  const [progress, setProgress] = useState(null); // percent of estimated time elapsed // KEEP!
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState(null); // keep
  const [delay] = useState(1000); // set "tick" time for timer

  const { status } = progressAlert;
  const { startTime, timeEstimate } = progressAlert.remainingTime;

  // Calls functions to update time and percent values
  useInterval(
    () => {
      const percentComplete = getPercentComplete({ startTime, timeEstimate });
      setProgress(percentComplete);

      const timeString = getTimeToCompletionString({ startTime, timeEstimate });
      setEstimatedCompletionTime(timeString);
    },
    !progressAlert.completed && progress < 100 && status === "pending"
      ? delay
      : null // Stop timer when conditions aren't true
  );

  return (
    <StyledProgressAlert>
      <Box>
        <ProgressBar className={status} height={"8px"} percent={progress} />
      </Box>
      <Flex p={3} alignItems={"center"} justifyContent={"space-between"}>
        <Flex alignItems={"center"}>
          <Flex
            bg="#DADADA"
            borderRadius={"50%"}
            height={"32px"}
            width={"32px"}
            justifyContent={"center"}
            alignItems={"center"}
            mr={3}
          >
            <Text fontSize={"12px"}>{progress}%</Text>
          </Flex>

          <Flex flexDirection={"column"}>
            <Text fontWeight={"600"} color={"#fff"}>
              Sending you a {progressAlert.content.token.name}
            </Text>

            <Text fontSize={"12px"} color={"#BCBCBC"}>
              {estimatedCompletionTime}
            </Text>
          </Flex>
        </Flex>

        {status === "error" && (
          <Button.Outline
            mainColor={"white"}
            onClick={e => {
              toggleProgressAlert(progressAlert.id);
            }}
          >
            Acknowledge
          </Button.Outline>
        )}
      </Flex>
    </StyledProgressAlert>
  );
}

const StyledProgressAlert = styled(Box)`
  & {
    background: ${props => props.theme.colors.primary};
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
  }
`;

// Duplicated in TxActivityModal so that each component can manage progress
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const MultipleProgressAlerts = ({ count, toggleTxActivityModal }) => {
  return (
    <StyledProgressAlert>
      <Flex p={3} alignItems={"center"} justifyContent={"space-between"}>
        <Flex alignItems={"center"}>
          <Flex
            height={"32px"}
            width={"32px"}
            justifyContent={"center"}
            alignItems={"center"}
            mr={3}
          >
            <Image src={transferringIcon} />
          </Flex>

          <Flex flexDirection={"column"}>
            <Text fontWeight={"600"} color={"#fff"}>
              Transferring {count} tickets
            </Text>
          </Flex>
        </Flex>

        <Button.Outline
          mainColor={"white"}
          onClick={() => {
            toggleTxActivityModal(true);
          }}
        >
          Track
        </Button.Outline>
      </Flex>
    </StyledProgressAlert>
  );
};

ProgressAlert.propTypes = {
  progressAlert: PropTypes.shape({
    message: PropTypes.string,
    timeEstime: PropTypes.number,
    error: PropTypes.shape({
      message: PropTypes.string
    }),
    transaction: PropTypes.shape({
      txHash: PropTypes.string
    })
  }),
  toggleProgressAlert: PropTypes.func
};

export default ProgressAlert;
