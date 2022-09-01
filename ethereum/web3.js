import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  //Inside the browser and metamask is present.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  //Inside the server or metamask is not present.
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/f1e91fc1f23f4fb6b16fc41801233fde"
  );
  web3 = new Web3(provider);
}

export default web3;
