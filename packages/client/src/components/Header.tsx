import * as React from "react";
import styled from "styled-components";
import * as PropTypes from "prop-types";
import Blockie from "./Blockie";
import { View } from "./View";
import { ellipseAddress, getChainData } from "../helpers/utilities";
import { transitions } from "../styles";
import { Database } from "'@game3js/common";

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const SActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const SActiveChain = styled(SActiveAccount)`
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`;

const SBlockie = styled(Blockie)`
  margin-right: 10px;
`;

const SBanner = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;


interface IHeaderStyle {
  connected: boolean;
}

const SAddress = styled.p<IHeaderStyle>`
  transition: ${transitions.base};
  font-weight: bold;
  margin: ${({ connected }) => (connected ? "-2px auto 0.7em" : "0")};
`;

const SSession = styled.div<IHeaderStyle>`
  transition: ${transitions.button};
  font-size: 12px;
  font-family: monospace;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`;

const SDisconnect = styled(SSession)`
    position: absolute;
    right: 0;
    top: 20px;
    opacity: ${({ connected }) => (connected ? 1 : 0)};
    visibility: ${({ connected }) => (connected ? "visible" : "hidden")};
    pointer-events: ${({ connected }) => (connected ? "auto" : "none")};
`;

const SConnect = styled(SSession)`
    opacity: ${({ connected }) => (!connected ? 1 : 0)};
    visibility: ${({ connected }) => (!connected ? "visible" : "hidden")};
    pointer-events: ${({ connected }) => (!connected ? "auto" : "none")};
`;

interface IHeaderProps {
  killSession: () => void;
  connectSession: () => void;
  connected: boolean;
  address: string;
  chainId: number;
  playerProfile: Database.PlayerProfile;
}

const Header = (props: IHeaderProps) => {
  const { playerProfile, connected, address, chainId, killSession, connectSession } = props;
  const activeChain = chainId ? getChainData(chainId).name : null;
  return (
    <SHeader {...props}>
      {connected && activeChain ? (
        <SActiveChain>
          <p>{`Connected to`}</p>
          <p>{activeChain}</p>
        </SActiveChain>
      ) : (
        <SActiveChain>
          <p>{playerProfile.username}</p>
        </SActiveChain>
      )}

          {address ? (
            <SActiveAccount>
                <SBlockie address={address} />
                <SAddress connected={connected}>{ellipseAddress(address)}</SAddress>
                <SDisconnect connected={connected} onClick={killSession}>
                  {"Disconnect"}
                </SDisconnect>
            </SActiveAccount>
          ) : (
            <View>
              <SConnect connected={connected} onClick={connectSession}>
                {"Login"}
              </SConnect>
            </View>
          )}

    </SHeader>
  );
};

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  connectSession: PropTypes.func.isRequired,
  address: PropTypes.string,
};

export default Header;
