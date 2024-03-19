import styled from 'styled-components';
import * as BufferLayout from 'buffer-layout';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js';

import React, { FC, useCallback, useEffect, useState } from 'react';

declare var Uint8Array: any;
const Wallet = () => {
  const { connected, wallet, publicKey, disconnect, signMessage, sendTransaction } = useWallet();
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

  const sign = async () => {
    try {
      const encodedMessage = new TextEncoder().encode('12121');
      // const msg = await signMessage(encodedMessage);
    } catch (e) {}
  };

  const action = async () => {
    try {
      let programId = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
      const transaction = new Transaction();

      // 创建一个新的交易指令
      // const transferInstruction = new solanaWeb3.TransactionInstruction({
      //   keys: [
      //     {pubkey: wallet.publicKey, isSigner: true, isWritable: true},
      //     {pubkey: '接收者的公钥', isSigner: false, isWritable: true}, // 替换为接收者的公钥
      //   ],
      //   programId: TOKEN_PROGRAM_ID,
      //   data: Buffer.from([3, ...new Uint8Array(8)]), // 3是transfer方法的指令编号
      // });

      // 创建一个 buffer layout 来描述转账指令的数据
      const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), BufferLayout.nu64('amount')]);

      // 创建一个包含转账指令和转账金额的 buffer
      const data = Buffer.alloc(dataLayout.span);
      dataLayout.encode(
        {
          instruction: 3, // 转账指令的编号
          amount: 100 * LAMPORTS_PER_SOL // 转账金额，转换为 lamports
        },
        data
      );

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: publicKey as PublicKey, isSigner: true, isWritable: true },
          { pubkey: new PublicKey('EqYfeHEE2o4tF8m3dY26CRW74wscdh1nzyZ21VQfajfb'), isSigner: false, isWritable: true } // 替换为接收者的公钥
        ],
        programId,
        // data: Buffer.from([3, ...new Uint8Array(100)])
        data
      });

      console.log('instruction', instruction);
      transaction.add(instruction);

      transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
      console.log('transaction.recentBlockhash', transaction.recentBlockhash);

      // console.log('transaction.feePayer', transaction.feePayer);
      // transaction.feePayer = payerPublicKey;

      const transactionSignature: any = await sendTransaction(transaction, connection);
      console.log('transactionSignature:::', transactionSignature);
      const tx = await connection.sendRawTransaction(transactionSignature.serialize());
      console.log('tx:::', tx);
    } catch (e: any) {
      console.error('error', e.reason || e.message || 'error');
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
      {connected && <Button onClick={sign}>签名</Button>}
      {connected && <Button onClick={action}>发送交易</Button>}
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
