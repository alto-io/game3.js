import React from "react";
import { Flex, Text } from "rimble-ui";

const ProgressPercentCircle = ({ percent }, props) => {
  return (
    <Flex
      bg={"pink"}
      borderRadius={"50%"}
      height={"32px"}
      width={"32px"}
      justifyContent={"center"}
      alignItems={"center"}
      {...props}
    >
      <Text fontSize={"12px"}>{percent}%</Text>
    </Flex>
  );
};

export default ProgressPercentCircle;
