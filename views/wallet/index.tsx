import styled from 'styled-components';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import React, { FC, useCallback, useEffect, useState } from 'react';

const Wallet = () => {
  const { connected, wallet, publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [devTokenBalance, setDevTokenBalance] = useState(0);
  const [account, setAccount] = useState('');

  const getBalance = async () => {
    try {
      if (publicKey !== null) {
        // get all token accounts
        const balance = await connection.getBalance(publicKey);
        console.log('balance', balance, publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);

        // get balances
        const RAY_TOKEN_MINT = 'AYSoVVXUoVtsvDx1YK453GsoxjUZKn5PuRMseAL43mtV';
        let tokenAcs: any = await connection.getTokenAccountBalance(new PublicKey(RAY_TOKEN_MINT));
        console.log('tokenAccs', tokenAcs, tokenAcs.value.uiAmount || 0);
        setDevTokenBalance(tokenAcs.value.uiAmount || 0);
        // let rayTokenAddress: PublicKey;
        // tokenAcs
        //   // .filter((acc: any) => acc.accountInfo.mint.toBase58() === RAY_TOKEN_MINT)
        //   .map(async (acc: any) => {
        //     rayTokenAddress = acc.pubkey;
        //     console.log('acc', rayTokenAddress, acc);

        //     const accBalance = await connection.getTokenAccountBalance(rayTokenAddress);
        //     const rayBal = accBalance.value.uiAmount || 0;
        //     // setRayBalance(rayBal);
        //   });
      }
    } catch (e: any) {
      console.error('getBalance error', e.message);
    }
  };

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      'confirmed'
    );

    connection.getAccountInfo(publicKey).then((info: any) => {
      console.log('getAccountInfo', info);
      // setBalance(info.lamports);
    });
  }, [connection, publicKey]);

  useEffect(() => {
    if (wallet && publicKey) {
      console.log('wallet', wallet);
      console.log('wallet address', wallet.adapter);
      // const _publicKey: any = new ublicKey();
      setAccount(publicKey.toBase58());
      console.log('publicKey', publicKey);
      // console.log('publicKey', _publicKey.toString());
    }
  }, [wallet, publicKey]);
  return (
    <Main>
      <h1>测试Solana连接钱包</h1>
      <h2>钱包状态：{connected ? '已连接' : '未连接'}</h2>
      <h2>钱包地址：{account}</h2>
      <h2>sol 余额：{balance}</h2>
      <h2>dev Token 余额：{devTokenBalance}</h2>
      {connected && <Button onClick={getBalance}>获取余额</Button>}
      {connected && <Button onClick={disconnect}>断开连接</Button>}
      <WalletMultiButton />
    </Main>
  );
};

const Main = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1,
  h2 {
    margin-bottom: 20px;
  }
`;
const Button = styled.button`
  width: 150px;
  height: 40px;
  margin: 20px 0;
`;

export default Wallet;
