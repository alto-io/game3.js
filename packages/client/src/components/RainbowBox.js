import styled from "styled-components";
import { Box } from "rimble-ui";

const RainbowBox = styled(Box)`
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
  transform: matrix(-1, 0, 0, 1, 0, 0);
`;

export default RainbowBox;
