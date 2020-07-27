import React from "react";
import { Text } from "rimble-ui";

class ShortHash extends React.Component {
  shortenHash = hash => {
    let shortHash = hash;
    const txStart = shortHash.substr(0, 7);
    const txEnd = shortHash.substr(shortHash.length - 4);
    shortHash = txStart + "..." + txEnd;
    return shortHash;
  };
  render() {
    const shortHash = this.shortenHash(this.props.hash);

    return <Text.span>{shortHash}</Text.span>;
  }
}

export default ShortHash;
