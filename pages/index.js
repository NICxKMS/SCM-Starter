import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [tokenName, setTokenName] = useState(undefined);
  const [tokenAbbreviation, setTokenAbbreviation] = useState(undefined);
  const [total, setTotal] = useState(undefined);
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const getTotal = async () => {
    setTotal((await atm.getTotal()).toNumber());
  };

  const getTokenName = async () => {
    if (atm) {
      setTokenName((await atm.getTokenName()));
    }
  };

  const getTokenAbbreviation = async () => {
    if (atm) {
      setTokenAbbreviation(await atm.getTokenAbbrv());
    }
  };

  const mint = async () => {
    if (atm && mintAmount > 0) {
      let tx = await atm.mint(mintAmount);
      await tx.wait();
      getTotal();
    }
  };

  const burn = async () => {
    if (atm && burnAmount > 0) {
      let tx = await atm.burn(burnAmount);
      await tx.wait();
      getTotal();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }
    
    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }
    if (balance === undefined) {
      getBalance();
    }

    if (tokenName === undefined) {
      getTokenName();
      getTotal();
    }

    if (tokenAbbreviation === undefined) {
      getTokenAbbreviation();
    }
    getTotal();

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Token Name: {tokenName}</p>
        <p>Token Abbreviation: {tokenAbbreviation}</p>
        <p>Total Mined Till date Balance: {total}</p>
        <p>Your Balance: {balance}</p>
        <div>
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(Number(e.target.value))}
            placeholder="Amount to mint"
          />
          <button onClick={mint}>Mint</button>
        </div>
        <div>
          <input
            type="number"
            value={burnAmount}
            onChange={(e) => setBurnAmount(Number(e.target.value))}
            placeholder="Amount to burn"
          />
          <button onClick={burn}>Burn</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
        `}
      </style>
    </main>
  );
}
