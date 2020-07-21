import React from "react";
import { Box } from "rimble-ui";
import { drizzleConnect } from "@drizzle/react-plugin";
import WrongNetwork from "./components/WrongNetwork";
import TxStartModal from "./components/TxStartModal";
import TxPendingModal from "./components/TxPendingModal";
import TxSuccessModal from "./components/TxSuccessModal";
import TxErrorModal from "./components/TxErrorModal";
import TxLowBalanceModal from "./components/TxLowBalanceModal";
import TxModalsDebug from "./TxModalsDebug";
import {
  toggleWrongNetworkModal,
  toggleTxStartModal,
  toggleTxPendingModal,
  toggleTxSuccessModal,
  toggleTxErrorModal,
  toggleTxLowBalanceModal,
  callTxGasPrice
} from "../redux/actions";
import { getProgressAlertById } from "../redux/selectors";

const TxModalsContainer = ({
  drizzle,
  address,
  rimble,
  store,
  externalData,
  toggleWrongNetworkModal,
  toggleTxStartModal,
  toggleTxPendingModal,
  toggleTxSuccessModal,
  toggleTxErrorModal,
  toggleTxLowBalanceModal,
  getPercentComplete,
  getTimeToCompletionString,
  calculateTxFee,
  callTxGasPrice
}) => {
  return (
    <Box>
      {process.env.NODE_ENV === "development" && <TxModalsDebug />}
      <WrongNetwork
        isOpen={rimble.showWrongNetworkModal}
        toggleModal={() => {
          toggleWrongNetworkModal(false);
        }}
      />
      {/* Only show when there is a currentTxId value */}
      {rimble.currentTxId && (
        <>
          <TxStartModal
            isOpen={rimble.showTxStartModal}
            toggleModal={() => {
              toggleTxStartModal(false);
            }}
            address={address}
            transaction={getProgressAlertById(
              store,
              rimble.currentTxId.stackId
            )}
            externalData={externalData}
            calculateTxFee={calculateTxFee}
            getTimeToCompletionString={getTimeToCompletionString}
          />

          <TxPendingModal
            isOpen={rimble.showTxPendingModal}
            toggleModal={() => {
              toggleTxPendingModal(false);
            }}
            address={address}
            price={"5.4"}
            transactionFee={"0.42"}
            estimatedTime={120}
            transaction={getProgressAlertById(
              store,
              rimble.currentTxId.stackId
            )}
            getPercentComplete={getPercentComplete}
            getTimeToCompletionString={getTimeToCompletionString}
            externalData={externalData}
            calculateTxFee={calculateTxFee}
          />

          <TxSuccessModal
            isOpen={rimble.showTxSuccessModal}
            toggleModal={() => {
              toggleTxSuccessModal(false);
            }}
            transaction={getProgressAlertById(
              store,
              rimble.currentTxId.stackId
            )}
            callTxGasPrice={callTxGasPrice}
            drizzle={drizzle}
          />
        </>
      )}
      <TxErrorModal
        isOpen={rimble.showTxErrorModal}
        toggleModal={() => {
          toggleTxErrorModal();
        }}
      />
      <TxLowBalanceModal
        isOpen={rimble.showTxLowBalanceModal}
        toggleModal={() => {
          toggleTxLowBalanceModal();
        }}
        address={address}
      />
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
    store: state,
    externalData: state.externalData
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
    callTxGasPrice: value => dispatch(callTxGasPrice(value))
  };
};

export default drizzleConnect(
  TxModalsContainer,
  mapStateToProps,
  mapDispatchToProps
);
