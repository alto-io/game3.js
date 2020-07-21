import React from "react";
import { Image, Box, Loader } from "rimble-ui";
import metaMaskIcon from "./../../../images/icon-metamask.svg";

const MetaMaskLoader = () => {
  return (
    <Box position={"relative"} height={"2em"} width={"2em"} mr={3}>
      <Box position={"absolute"} top={"0"} left={"0"}>
        <Loader size={"2em"} />
      </Box>
      <Box position={"absolute"} top={"9px"} left={"0px"}>
        <Image src={metaMaskIcon} height={"22px"} />
      </Box>
    </Box>
  );
};

export default MetaMaskLoader;
