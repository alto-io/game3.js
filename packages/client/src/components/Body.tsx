import React, { useState } from "react";
import Play from "./Play";
import TournamentView from "./TournamentView";
import CreateTourneyView from "./CreateTourneyView";
import DashboardView from './DashboardView';
import WalletView from './WalletView';

import OutplayNavigation from "./OutplayNavigation";
import JoinPromptModal from "./JoinPromptModal";
import { Box, Flex } from "rimble-ui";

function Body({ drizzle, drizzleState, store, contractMethodSendWrapper, account, accountValidated, connectAndValidateAccount, route, setRoute, addressModal, connected, web3 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isContractOwner, setIsContractOwner] = useState(false);

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
          address={addressModal}
          connected={connected}
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
                addressModal={addressModal}
                connected={connected}
                web3={web3}
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
              setRoute={setRoute}
              address={addressModal}
              connected={connected}
              />,
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