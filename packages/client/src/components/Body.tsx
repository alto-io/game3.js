import React, { useState, useEffect } from "react";
import Play from "./Play";
import TournamentView from "./TournamentView";
import CreateTourneyView from "./CreateTourneyView";
import DashboardView from './DashboardView';
import WalletView from './WalletView';

import OutplayNavigation from "./OutplayNavigation";
import JoinPromptModal from "./JoinPromptModal";
import { Box, Flex } from "rimble-ui";

function Body({ drizzle, drizzleState, store, contractMethodSendWrapper, account, accountValidated, connectAndValidateAccount }) {
  const [address, setAddress] = useState(null);
  const [route, setRoute] = useState("Play");
  const [isOpen, setIsOpen] = useState(false);
  const [isContractOwner, setIsContractOwner] = useState(false);

  useEffect(() => {
    if (drizzleState) {
      setAddress(drizzleState.accounts["0"]);
    }
  }, [drizzleState]);

  const preflightCheck = () => {
    if (window.ethereum) {
      window.ethereum.enable();
    }
  };

  const handleOpenModal = e => {
    setIsOpen(true);
  }

  const handleCloseModal = e => {
    setIsOpen(false);
  }

  const handleSetIsContractOwner = (bool) => {
    setIsContractOwner(bool);
  }

  return (
    <Box height={"100%"}>
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        height={"100%"}
      >
        <OutplayNavigation 
          drizzle={drizzle}
          drizzleState={drizzleState}
          setRoute={setRoute} 
          route={route} 
          handleOpenModal={handleOpenModal}
          account={account}
          accountValidated={accountValidated}
          isContractOwner={isContractOwner}/>
        {
          {
            Play: 
              <Play
                account={account}
                accountValidated={accountValidated}
                drizzle={drizzle}
                drizzleState={drizzleState}
                handleSetIsContractOwner={handleSetIsContractOwner}
              />,
            TournamentView: 
              <TournamentView 
                store={store}
                drizzle={drizzle}
                setRoute={setRoute}
                account={account}
                accountValidated={accountValidated}
                connectAndValidateAccount={connectAndValidateAccount}
                />,
            CreateTourneyView: 
            <CreateTourneyView 
              store={store}
              drizzle={drizzle}
              contractMethodSendWrapper={contractMethodSendWrapper}
              setRoute={setRoute} />,
            DashboardView: 
            <DashboardView
              account={account}
              accountValidated={accountValidated}
              store={store}
              drizzle={drizzle}
              setRoute={setRoute}/>,
            WalletView: 
            <WalletView 
              store={store}
              drizzle={drizzle}
              setRoute={setRoute} />,
          }[route]
        }
      </Flex>

      <JoinPromptModal 
        isOpen={isOpen}
        connectAndValidateAccount={connectAndValidateAccount}
        handleCloseModal={handleCloseModal}
        modalText={"You need to be logged in to view the dashboard"}
      />
    </Box>
  );
}

export default Body;