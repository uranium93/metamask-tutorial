import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Notification from '@/components/Notification';
import { isProductionEnv } from '@/service/tools';

// eslint-disable-next-line no-shadow
enum Web3Status {
  'UNKNOWN' = `UNKNOWN`,
  'NOT_CONNECTED' = `NOT_CONNECTED`,
  'NOT_FOUND' = `NOT_FOUND`,
  'CONNECTED' = `CONNECTED`,
}

const initialState = {
  title: ``,
  description: ``,
  show: false,
  isError: false,
};

const NavBar: React.FC<unknown> = () => {
  const [web3Status, setWeb3Status] = useState<Web3Status>(Web3Status.UNKNOWN);
  const [accountAddress, setAccountAddress] = useState(`Connect`);
  const [notification, setNotification] = useState(initialState);

  const handleCloseNotification = () => {
    setNotification(initialState);
  };

  const metamaskStatus = async (provider: ethers.providers.Web3Provider) => {
    // Try to get list if accounts from metamask, return empty [] if not connected
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      setWeb3Status(Web3Status.CONNECTED);
      // First account in the array {index 0} is always the selected account in metamask
      const address = accounts[0];
      setAccountAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
      return;
    }
    setWeb3Status(Web3Status.NOT_CONNECTED);
    setAccountAddress(`Connect`);
  };

  useEffect(() => {
    // Metamask inject "ethereum" object window for each page you visit, If installed.
    const { ethereum } = window;
    // If ethereum is undefined, means metamask is not installed.
    if (!ethereum) {
      setWeb3Status(Web3Status.NOT_FOUND);
      return;
    }
    /**
     * @summary Request metamask to ask user to switch network.
     * @see https://docs.metamask.io/guide/ethereum-provider.html#chain-ids
     */
    window.ethereum
      .request({
        method: `wallet_switchEthereumChain`,
        params: [{ chainId: isProductionEnv() ? `0x1` : `0x4` }],
      })
      .catch(console.error);

    // Check if metamask is connected to update UI status, if connected display wallet address
    metamaskStatus(new ethers.providers.Web3Provider(ethereum));
  }, []);

  /**
   * @summary Account events
   * @event accountChanged User changed account
   * @event chainChanged User changed chain Exp: ETH mainnet => Fantom mainnet
   */
  useEffect(() => {
    window.ethereum?.on(`accountsChanged`, (accounts) => {
      if (accounts.length) {
        setWeb3Status(Web3Status.CONNECTED);
        const address = accounts[0];
        setAccountAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
        return;
      }
      setWeb3Status(Web3Status.NOT_CONNECTED);
      setAccountAddress(`Connect`);
    });
    window.ethereum?.on(`chainChanged`, () => {
      window.location.reload();
    });
  }, []);

  const connectHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    /**
     * @description if metamask is not found, show a meaningful message to user via
     * via setNotification state and return (break executing the code)
     */
    if (web3Status === Web3Status.NOT_FOUND) {
      setNotification({
        show: true,
        isError: true,
        title: `Metamask not found`,
        description: `Please install metamask and reload the page.`,
      });
      return;
    }
    /**
     * @description if metamask is already connected return (break code)
     * the way we know if metamask is connected is by checking if there's an account
     * is by requesting the list of accounts connected with our app {listAccounts}
     */
    if (web3Status === Web3Status.CONNECTED) return;
    /**
     * @description call {eth_requestAccounts} rpc metamask api which tell metamask to
     * request connecting with our application (Authorization) [User have to approve by clicking confirm]
     */
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send(`eth_requestAccounts`, []);
      const address = (await provider.listAccounts())[0];
      setAccountAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
      setNotification({
        show: true,
        isError: false,
        title: `Connected`,
        description: `Hope you brought some pizza 🍕🍕`,
      });
    } catch (error) {
      setNotification({
        isError: true,
        show: true,
        title: `Couldn't Connect with metamask`,
        description: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row justify-between items-center ">
      <Notification
        isError={notification.isError}
        title={notification.title}
        description={notification.description}
        show={notification.show}
        onClose={handleCloseNotification}
      />
      <div className="w-full flex justify-between items-center p-3 lg:p-5">
        <h2 className=" text-2xl">Connect Metamask Tutorial</h2>
        <button className="block" type="submit" onClick={connectHandler}>
          <span className="hover:bg-indigo-400 text-lg py-2 px-6 border border-indigo-500 cursor-pointer rounded-xl">
            {accountAddress || `Connect`}
          </span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
