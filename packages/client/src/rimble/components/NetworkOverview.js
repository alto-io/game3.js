import React from "react";
import { Box, Flex, Text } from "rimble-ui";

class NetworkOverview extends React.Component {
  getNetworkCircleColor = () => {
    let circleColor = "#333";
    if (this.props.network) {
      switch (this.props.network.id) {
        case 1:
          circleColor = "#56b3ae";
          break;
        case 2:
          circleColor = "#000";
          break;
        case 3:
          circleColor = "#ed5a8d";
          break;
        case 4:
          circleColor = "#efc35c";
          break;
        case 42:
          circleColor = "#6a5ff6";
          break;
        default:
          circleColor = "#ccc";
      }
    }

    return circleColor;
  };

  render() {
    const networkCircle = {
      borderRadius: "50%",
      backgroundColor: this.getNetworkCircleColor(),
      height: "1em",
      width: "1em"
    };

    return (
      <Flex alignItems={"center"}>
        <Box style={networkCircle} mr={2} />
        <Text style={{ textTransform: "capitalize" }}>
          {this.props.network.name}
        </Text>
      </Flex>
    );
  }
}

export default NetworkOverview;
