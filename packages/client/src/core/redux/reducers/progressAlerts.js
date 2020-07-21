import {
  RIMBLE_ADD_PROGRESSALERT,
  RIMBLE_TOGGLE_PROGRESSALERT,
  RIMBLE_SET_PROGRESSALERT_STATUS,
  RIMBLE_SET_PROGRESSALERT_TX_HASH,
  RIMBLE_UPDATE_PROGRESSALERT_CONTENT,
  RIMBLE_UPDATE_PROGRESSALERT_TOKEN,
  RIMBLE_UPDATE_PROGRESSALERT_REMAININGTIME,
  RIMBLE_UPDATE_PROGRESSALERT_TXFEE,
  RIMBLE_RECEIVE_ESTIMATE_TX_GAS,
  RIMBLE_RECEIVED_TX_GAS_PRICE
} from "../actionTypes";

// Initialize rimbleAlert store
const initialRimbleProgressAlert = {
  allIds: [],
  byIds: {}
};

const getIdByTxHash = ({ state, txHash }) => {
  const id = Object.keys(state.byIds).find(keys => {
    return state.byIds[keys].txHash === txHash;
  });

  return id;
};

const getIdByStackTempKey = ({ state, stackTempKey }) => {
  const id = Object.keys(state.byIds).find(keys => {
    return state.byIds[keys].stackTempKey === stackTempKey;
  });

  return id;
};

const getProgressAlertPosition = ({ state, id, txHash, stackTempKey }) => {
  let progressAlertPosition = null;

  if (typeof txHash !== "undefined") {
    progressAlertPosition = getIdByTxHash({ state, txHash });
  } else if (typeof stackTempKey !== "undefined") {
    progressAlertPosition = getIdByStackTempKey({ state, stackTempKey });
  } else {
    progressAlertPosition = id;
  }

  return progressAlertPosition;
};

// Managing progressAlert component's state
export default function(state = initialRimbleProgressAlert, action) {
  switch (action.type) {
    case RIMBLE_ADD_PROGRESSALERT: {
      const { id, content } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            content: {
              token: { ...content.token }
            },
            remainingTime: {
              string: "Calculating remaining time...",
              percent: null,
              seconds: null,
              timeEstimate: null, // waiting for time estimate from API
              startTime: Date.now()
            },
            completed: false,
            status: "unknown",
            txHash: "0x123",
            stackTempKey: "123",
            txFee: {
              txGasEstimate: null
            },
            txGas: {}
          }
        }
      };
    }
    case RIMBLE_TOGGLE_PROGRESSALERT: {
      const { id } = action.payload;
      return {
        ...state,
        byIds: {
          ...state.byIds,
          [id]: {
            ...state.byIds[id],
            completed: !state.byIds[id].completed
          }
        }
      };
    }
    case RIMBLE_SET_PROGRESSALERT_STATUS: {
      const { status, id, txHash, stackTempKey } = action.payload;
      const pa = getProgressAlertPosition({ state, id, txHash, stackTempKey });

      switch (status) {
        case "started":
          return {
            ...state,
            byIds: {
              ...state.byIds,
              [pa]: {
                ...state.byIds[pa],
                status: status,
                remainingTime: {
                  ...state.byIds[pa].remainingTime, // to keep original properties
                  startTime: Date.now() // set new start time for calculating estimated completion time in TxStartModal
                }
              }
            }
          };
        case "pending":
          return {
            ...state,
            byIds: {
              ...state.byIds,
              [pa]: {
                ...state.byIds[pa],
                status: status,
                remainingTime: {
                  ...state.byIds[pa].remainingTime, // to keep original properties
                  startTime: Date.now() // set new start time for progressAlert and TxActivityModal progress bars
                }
              }
            }
          };
        case "success":
          return {
            ...state,
            byIds: {
              ...state.byIds,
              [pa]: {
                ...state.byIds[pa],
                status: status,
                timeEstimate: null,
                completed: true
              }
            }
          };
        case "error":
          return {
            ...state,
            byIds: {
              ...state.byIds,
              [pa]: {
                ...state.byIds[pa],
                status: status,
                timeEstimate: null,
                completed: true
              }
            }
          };
        default:
          return state;
      }
    }
    case RIMBLE_SET_PROGRESSALERT_TX_HASH: {
      const { stackTempKey, txHash, id } = action.payload;
      return {
        ...state,
        byIds: {
          ...state.byIds,
          [id]: {
            ...state.byIds[id],
            txHash: txHash,
            stackTempKey: stackTempKey
          }
        }
      };
    }
    case RIMBLE_UPDATE_PROGRESSALERT_CONTENT: {
      const { content, id, txHash, stackTempKey } = action.payload;

      const pa = getProgressAlertPosition({ state, id, txHash, stackTempKey });

      return {
        ...state,
        byIds: {
          ...state.byIds,
          [pa]: {
            ...state.byIds[pa],
            content: {
              ...state.byIds[pa].content,
              ...content
            }
          }
        }
      };
    }
    case RIMBLE_UPDATE_PROGRESSALERT_TOKEN: {
      const { token, id, txHash, stackTempKey } = action.payload;

      const pa = getProgressAlertPosition({ state, id, txHash, stackTempKey });

      return {
        ...state,
        byIds: {
          ...state.byIds,
          [pa]: {
            ...state.byIds[pa],
            content: {
              ...state.byIds[pa].content,
              token: {
                ...state.byIds[pa].content.token,
                ...token
              }
            }
          }
        }
      };
    }
    case RIMBLE_UPDATE_PROGRESSALERT_REMAININGTIME: {
      const { timeEstimate, id, txHash, stackTempKey } = action.payload;

      const pa = getProgressAlertPosition({ state, id, txHash, stackTempKey });

      return {
        ...state,
        byIds: {
          ...state.byIds,
          [pa]: {
            ...state.byIds[pa],
            remainingTime: {
              ...state.byIds[pa].remainingTime, // to keep original startTime property
              timeEstimate: timeEstimate // 100 seconds, can be updated at any time
            }
          }
        }
      };
    }
    case RIMBLE_UPDATE_PROGRESSALERT_TXFEE: {
      const { id, txHash, stackTempKey } = action.payload;

      const pa = getProgressAlertPosition({ state, id, txHash, stackTempKey });

      return {
        ...state,
        byIds: {
          ...state.byIds,
          [pa]: {
            ...state.byIds[pa],
            txFee: {
              eth: 0.00112
            }
          }
        }
      };
    }
    case RIMBLE_RECEIVE_ESTIMATE_TX_GAS: {
      const { tokenId, txGasEstimate } = action;

      return {
        ...state,
        byIds: {
          ...state.byIds,
          [tokenId]: {
            ...state.byIds[tokenId],
            txFee: {
              txGasEstimate: txGasEstimate
            }
          }
        }
      };
    }
    case RIMBLE_RECEIVED_TX_GAS_PRICE: {
      const { txHash, txGas } = action;
      const pa = getProgressAlertPosition({ state, txHash });

      return {
        ...state,
        byIds: {
          ...state.byIds,
          [pa]: {
            ...state.byIds[pa],
            txFee: {
              ...state.byIds[pa].txFee,
              ...txGas
            }
          }
        }
      };
    }
    default: {
      return state;
    }
  }
}
