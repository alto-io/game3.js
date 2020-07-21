const shortenAddress = address => {
  address = address.slice(0, 5) + "..." + address.slice(address.length - 4);
  return address;
};

export default shortenAddress;
