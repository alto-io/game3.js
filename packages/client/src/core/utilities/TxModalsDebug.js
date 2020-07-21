import React from "react";
import { Box, Button, Heading } from "rimble-ui";
import { drizzleConnect } from "@drizzle/react-plugin";

import {
  toggleWrongNetworkModal,
  toggleTxStartModal,
  toggleTxPendingModal,
  toggleTxSuccessModal,
  toggleTxErrorModal,
  toggleTxLowBalanceModal,
  toggleTxActivityModal,
  setCurrentTxId,
  addProgressAlert,
  updateProgressAlertRemainingTime,
  updateProgressAlertTxFee
} from "../redux/actions";

const TxModalsContainer = ({
  rimble,
  toggleWrongNetworkModal,
  toggleTxStartModal,
  toggleTxPendingModal,
  toggleTxSuccessModal,
  toggleTxErrorModal,
  toggleTxLowBalanceModal,
  toggleTxActivityModal,
  setCurrentTxId,
  addProgressAlert,
  updateProgressAlertRemainingTime,
  updateProgressAlertTxFee
}) => {
  const handleWrongNetwork = () => {
    toggleWrongNetworkModal(!rimble.showWrongNetworkModal);
  };

  const handleTxStartModal = () => {
    addProgressAlert({
      token: {
        id: "DevConAttendance",
        name: "Conference ticket",
        ethPrice: "5.63",
        image: "conference.png"
      }
    });
    updateProgressAlertRemainingTime({
      txHash: "0x123",
      content: {}
    });
    updateProgressAlertTxFee({
      txHash: "0x123",
      content: {}
    });
    setCurrentTxId(0);
    toggleTxStartModal(!rimble.showTxStartModal);
  };

  const handleTxPendingModal = () => {
    addProgressAlert({
      token: {
        id: "DevConAttendance",
        name: "Conference ticket",
        ethPrice: "5.63",
        image: "conference.png",
        tokenId: 99,
        contractAddress:
          "https://rinkeby.etherscan.io/address/0xb0a4ba3e61f4610d7c3f498a08acd24fd585f056",
        txHash:
          "https://rinkeby.etherscan.io/tx/0x632c1a2f1002cdb2d7e11c18c314a1732d89f616613f89f0ea86b8973b0edcca",
        gasUsed: 89021,
        cumulativeGasUsed: 143204
      }
    });
    updateProgressAlertRemainingTime({
      txHash: "0x123",
      content: {}
    });
    updateProgressAlertTxFee({
      txHash: "0x123",
      content: {}
    });
    setCurrentTxId(0);
    toggleTxPendingModal(!rimble.showTxPendingModal);
  };

  const handleTxSuccessModal = () => {
    addProgressAlert({
      token: {
        id: "DevConAttendance",
        name: "Conference ticket",
        ethPrice: "5.63",
        image: "conference.png",
        successTitle: "You're going to DevCon!",
        successInstructions:
          "Just show this ticket token in your wallet when you arrive at the conference venue.",
        tokenId: 99,
        contractAddress: "0xb0a4ba3e61f4610d7c3f498a08acd24fd585f056",
        txHash:
          "0x632c1a2f1002cdb2d7e11c18c314a1732d89f616613f89f0ea86b8973b0edcca",
        gasUsed: 89021,
        cumulativeGasUsed: 143204
      }
    });
    updateProgressAlertRemainingTime({
      txHash: "0x123",
      content: {}
    });
    updateProgressAlertTxFee({
      txHash: "0x123",
      content: {}
    });
    setCurrentTxId(0);
    toggleTxSuccessModal(!rimble.showTxSuccessModal);
  };

  const handleTxErrorModal = () => {
    toggleTxErrorModal(!rimble.showTxErrorModal);
  };

  const handleTxLowBalanceModal = () => {
    toggleTxLowBalanceModal(!rimble.showTxLowBalanceModal);
  };

  const handleTxActivityModal = () => {
    toggleTxActivityModal(!rimble.showTxActivityModal);
  };

  const handleSetCurrentTxId = () => {
    setCurrentTxId(0);
  };

  return (
    <Box m={3}>
      <Heading as={"h4"}>TxModal Debug</Heading>
      <Box
        p={3}
        borderColor={"gray"}
        borderWidth={1}
        borderRadius={3}
        borderStyle={"solid"}
      >
        <Button size={"small"} onClick={handleWrongNetwork} mr={3} mb={3}>
          Toggle Wrong Network modal
        </Button>

        {/* Figure out how to dispatch action that changes the modal visible property */}
        <Button size={"small"} onClick={handleTxStartModal} mr={3} mb={3}>
          Toggle Confirm Purchase modal
        </Button>
        <Button size={"small"} onClick={handleTxPendingModal} mr={3} mb={3}>
          Toggle Sending Ticket modal
        </Button>
        <Button size={"small"} onClick={handleTxSuccessModal} mr={3} mb={3}>
          Toggle Transaction Success modal
        </Button>
        <Button size={"small"} onClick={handleTxErrorModal} mr={3} mb={3}>
          Toggle Transaction Error modal
        </Button>
        <Button size={"small"} onClick={handleTxLowBalanceModal} mr={3} mb={3}>
          Toggle Low Balance modal
        </Button>
        <Button size={"small"} onClick={handleTxActivityModal} mr={3} mb={3}>
          Toggle Tx Activity modal
        </Button>

        <Button size={"small"} onClick={handleSetCurrentTxId} mr={3} mb={3}>
          Set CurrentTxId
        </Button>
      </Box>
    </Box>
  );
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts,
    rimble: state.txModals,
    store: state
  };
};
const mapDispatchToProps = dispatch => {
  return {
    toggleWrongNetworkModal: value => dispatch(toggleWrongNetworkModal(value)),
    toggleTxStartModal: value => dispatch(toggleTxStartModal(value)),
    toggleTxPendingModal: value => dispatch(toggleTxPendingModal(value)),
    toggleTxSuccessModal: value => dispatch(toggleTxSuccessModal(value)),
    toggleTxErrorModal: value => dispatch(toggleTxErrorModal(value)),
    toggleTxLowBalanceModal: value => dispatch(toggleTxLowBalanceModal(value)),
    toggleTxActivityModal: value => dispatch(toggleTxActivityModal(value)),
    setCurrentTxId: value => dispatch(setCurrentTxId(value)),
    addProgressAlert: value => dispatch(addProgressAlert(value)),
    updateProgressAlertRemainingTime: value =>
      dispatch(updateProgressAlertRemainingTime(value)),
    updateProgressAlertTxFee: value => dispatch(updateProgressAlertTxFee(value))
  };
};

export default drizzleConnect(
  TxModalsContainer,
  mapStateToProps,
  mapDispatchToProps
);
