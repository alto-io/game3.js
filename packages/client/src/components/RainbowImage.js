import React from "react";
import { Flex, Image } from "rimble-ui";
import styled from "styled-components";

const RainbowBorder = styled(Flex)`
  background: linear-gradient(
    270deg,
    #efa59e 0%,
    #f5ccd1 17.19%,
    #f7ceb3 33.85%,
    #eccfa5 52.08%,
    #b9d8ae 68.23%,
    #97d6e3 84.37%,
    #9fb1e8 100%
  );
  padding: 1px;
  display: inline-flex;
`;

const ShadowImage = styled(Image)`
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
`;

const RainbowImage = ({ src }) => {
  return (
    <RainbowBorder borderRadius={3}>
      <ShadowImage
        height={"200px"}
        width={"200px"}
        border={"none"}
        borderWidth={0}
        borderColor={"white"}
        overflow={"hidden"}
        bg={"white"}
        src={src}
      />
    </RainbowBorder>
  );
};

export default RainbowImage;
