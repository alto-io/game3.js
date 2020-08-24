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
  ${'' /* width: 275px;
  height: 175px; */}
  width: 275px;
  height: 175px;
  
  @media screen and (min-width: 425px) {
    ${'' /* width: 375px;
    height: 275px; */}
    min-width: 375px;
    min-height: 275px;
  }

  @media screen and (min-width: 640px) {
    min-width: 275px;
    min-height: 175px;
  }

`;

const ShadowImage = styled(Image)`
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  height: auto;
  width: 100%;
`;

const RainbowImage = ({ src }) => {
  return (
    <RainbowBorder borderRadius={3}>
      <ShadowImage
        border={"none"}
        borderWidth={0}
        borderColor={"white"}
        overflow={"hidden"}
        bg={"white"}
        src={src}
        className="thistheimage"
      />
    </RainbowBorder>
  );
};

export default RainbowImage;
