// Checks for MetaMask
const GeneralUtil = {
  hasMetaMask: () => {
    let hasMetaMask = false;

    if (typeof window.ethereum !== "undefined") {
      hasMetaMask = typeof window.ethereum.isMetaMask !== "undefined";
    }

    return hasMetaMask;
  },
  // Current device is Android
  isAndroid: () => {
    const isAndroid = /android/i.test(navigator.userAgent) ? true : false;

    return isAndroid;
  },

  // Current device is iOS
  isIos() {
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        ? true
        : false;

    return isIos;
  }
};

export default GeneralUtil;
