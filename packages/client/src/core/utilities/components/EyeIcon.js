import React from "react";
import { Flex, Image } from "rimble-ui";
import eyeIcon from "./../../../images/icon-eye.svg";

const EyeIcon = () => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      ml={2}
      p={1}
      borderRadius={"50%"}
      bg={"#d3c6d3"}
    >
      <Image src={eyeIcon} />
    </Flex>
  );
};

export default EyeIcon;
