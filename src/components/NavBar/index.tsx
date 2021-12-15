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
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      setWeb3Status(Web3Status.CONNECTED);
      const address = accounts[0];
      setAccountAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
      return;
    }
    setWeb3Status(Web3Status.NOT_CONNECTED);
    setAccountAddress(`Connect`);
  };

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

  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) {
      setWeb3Status(Web3Status.NOT_FOUND);
      return;
    }
    /**
     * @see https://docs.metamask.io/guide/ethereum-provider.html#chain-ids
     */
    window.ethereum
      .request({
        method: `wallet_switchEthereumChain`,
        params: [{ chainId: isProductionEnv() ? `0x1` : `0x4` }],
      })
      .catch(console.error);

    metamaskStatus(new ethers.providers.Web3Provider(ethereum));
  }, []);

  const connectHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (web3Status === Web3Status.NOT_FOUND) {
      setNotification({
        show: true,
        isError: true,
        title: `Oops, Can't See Metamask Installed`,
        description: `You need to have metamask installed to connect, For help visit our Discord`,
      });
      return;
    }
    if (web3Status === Web3Status.CONNECTED) return;
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
