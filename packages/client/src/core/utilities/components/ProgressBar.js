import React from "react";
import { Flex, Box } from "rimble-ui";
import styled, { css, keyframes } from "styled-components";

const backwardsMoving = keyframes`
  0%{background-position: 0% 50%}
  50%{background-position: 50% 50%}
  100%{background-position: 100% 50%}
`;

const animation = props =>
  css`
    ${backwardsMoving} 2500ms linear infinite
  `;

const StyledProgressBar = styled(Flex)`
  & {
    width: 100%;
    background: linear-gradient(
      270deg,
      #efa59e 0%,
      #f5ccd1 8.3%,
      #f7ceb3 16.6%,
      #eccfa5 25%,
      #b9d8ae 33.3%,
      #97d6e3 41.6%,
      #9fb1e8 50%,
      #97d6e3 58.3%,
      #b9d8ae 66.6%,
      #eccfa5 75%,
      #f7ceb3 83.3%,
      #f5ccd1 91.6%,
      #efa59e 100%
    );
    background-size: 50% 100%;
    transform: matrix(-1, 0, 0, 1, 0, 0);
    animation: ${props => (props.percent < 100 ? animation : `none`)};
    justify-content: flex-start;
    height: ${props => props.height};
  }
  &.error {
    background: ${props => props.theme.colors.danger};
  }
  &.success {
    background: ${props => props.theme.colors.success};
  }
`;

const ProgressBarReveal = styled(Box)`
  background-color: ${props => props.theme.colors.background};
  width: ${props => (props.percent ? `calc(100% - ${props.percent}%)` : 0)};
  height: ${props => props.height};
  transition: all 0.15s ease;
`;
const ProgressBar = props => {
  return (
    <StyledProgressBar {...props}>
      <ProgressBarReveal {...props} />
    </StyledProgressBar>
  );
};
export default ProgressBar;
