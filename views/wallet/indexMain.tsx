import styled from 'styled-components';
import * as anchor from '@project-serum/anchor';
import * as BufferLayout from 'buffer-layout';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { AccountLayout, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createTransferInstruction, createAssociatedTokenAccountInstruction, createMint } from '@solana/spl-token';

import React, { FC, useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { useWorkspace } from '@/hooks';
import { getPostPda } from '@/utils/utils';

declare var Uint8Array: any;
const Wallet = () => {
  const { connected, wallet, publicKey, disconnect, signTransaction, signMessage, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [devTokenBalance, setDevTokenBalance] = useState(0);
  const [account, setAccount] = useState('');
  const workspace = useWorkspace();

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

  const initHelloWorld = async () => {
    if (!workspace) return;
    let helloworldPda = await getPostPda();
    const tx = await workspace.program.methods
      .initialize('Hello My Friend!')
      .accounts({
        helloWorld: helloworldPda,
        authority: account,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();
    console.log('Your transaction signature', tx);
  };

  const getAccountState = async () => {
    try {
      if (!workspace) return;
      let padPubKey = await getPostPda();
      let accountState = await workspace.program.account.helloWorld.fetch(padPubKey);
      console.log('accountState---', accountState);
    } catch (e: any) {
      console.error('getParams error', e.message);
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
      const transaction = new Transaction();
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
          { pubkey: new PublicKey('AYSoVVXUoVtsvDx1YK453GsoxjUZKn5PuRMseAL43mtV'), isSigner: false, isWritable: true },
          { pubkey: new PublicKey('H9zPKof4XG2iwNrDh6A9ruuerNx6rLCqT6LEYD3VC1Hd'), isSigner: false, isWritable: true }, // 替换为接收者的公钥
          { pubkey: publicKey as PublicKey, isSigner: true, isWritable: false }
        ],
        programId: TOKEN_PROGRAM_ID,
        // data: Buffer.from([3, ...new Uint8Array(100)])
        data
      });

      console.log('instruction', instruction);
      transaction.add(instruction);

      transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
      console.log('transaction.recentBlockhash', transaction.recentBlockhash);

      // console.log('transaction.feePayer', transaction.feePayer);
      // transaction.feePayer = payerPublicKey;

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();

      const signature: any = await sendTransaction(transaction, connection, { minContextSlot });
      console.log('transactionSignature:::', signature);
      // const tx = await connection.sendRawTransaction(transactionSignature.serialize());
      // console.log('tx:::', tx);
      console.log('explorer---', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      const { context, value } = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log('context:::', context);
      console.log('result:::', !value.err ? 'success' : 'error');
      message.success(!value.err ? 'success' : 'fail');
    } catch (e: any) {
      console.error('error', e.reason || e.message || 'error');
    }
  };

  const transferSOL1 = async () => {
    try {
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: new PublicKey('EqYfeHEE2o4tF8m3dY26CRW74wscdh1nzyZ21VQfajfb'),
          lamports: 1 * 10 ** 9
        })
      );

      // console.log('transaction.feePayer', transaction.feePayer);
      // transaction.feePayer = payerPublicKey;

      const signature: any = await sendTransaction(transaction, connection);
      const rawTransaction = transaction.serialize();
      console.log('signature:::', rawTransaction);

      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
      });
      console.log('txid', txid);

      const latestBlockHash = await connection.getLatestBlockhash();

      const result = await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      });

      console.log('result', result);

      // const tx = await connection.sendRawTransaction(transaction.serialize());
      // console.log('tx', tx);
      // const { context, value } = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      // console.log('context:::', context);
      // console.log('result:::', !value.err ? 'success' : 'error');
      // message.success(!value.err ? 'success' : 'fail');
    } catch (e: any) {
      console.error('error', e.reason || e.message || 'error');
    }
  };

  const transferSOL = async () => {
    try {
      let programId = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey!,
          toPubkey: new PublicKey('EqYfeHEE2o4tF8m3dY26CRW74wscdh1nzyZ21VQfajfb'),
          lamports: 1 * 10 ** 9
        })
      );

      // console.log('transaction.feePayer', transaction.feePayer);
      // transaction.feePayer = payerPublicKey;

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();

      const signature: any = await sendTransaction(transaction, connection, { minContextSlot });
      console.log('signature:::', signature);
      // const tx = await connection.sendRawTransaction(transaction.serialize());
      // console.log('tx', tx);
      const { context, value } = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log('context:::', context);
      console.log('result:::', !value.err ? 'success' : 'error');
      message.success(!value.err ? 'success' : 'fail');
    } catch (e: any) {
      console.error('error', e.reason || e.message || 'error');
    }
  };

  const createTokenAccount = async () => {
    try {
      let transaction = new Transaction();
      // transaction.add(
      //   SystemProgram.createAccount({
      //     fromPubkey: feePayer.publicKey,
      //     newAccountPubkey: tokenAccount.publicKey,
      //     space: ACCOUNT_SIZE,
      //     lamports: await getMinimumBalanceForRentExemptAccount(connection),
      //     programId: TOKEN_PROGRAM_ID
      //   })
      // );
      // const transactionSignature: any = await sendTransaction(transaction, connection);
      // console.log('transactionSignature:::', transactionSignature);
      // const tx = await connection.sendRawTransaction(transactionSignature.serialize());
      // console.log('tx:::', tx);
    } catch (e: any) {
      console.error('error', e.message);
    }
  };

  const onSendSPLTransaction = useCallback(
    async (toPubkey: string, amount: number) => {
      if (!toPubkey || !amount) return;
      try {
        // if (!publicKey || !signTransaction) throw new WalletNotConnectedError()
        // const toPublicKey = new PublicKey(toPubkey);
        // const mint = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
        // const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey as any, mint, publicKey!, signTransaction!);
        // const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey as any, mint, toPublicKey!, signTransaction!);
        // const transaction = new Transaction().add(
        //   createTransferInstruction(
        //     fromTokenAccount.address, // source
        //     toTokenAccount.address, // dest
        //     publicKey,
        //     amount * LAMPORTS_PER_SOL,
        //     [],
        //     TOKEN_PROGRAM_ID
        //   )
        // );
        // const blockHash = await connection.getRecentBlockhash();
        // transaction.feePayer = await publicKey;
        // transaction.recentBlockhash = await blockHash.blockhash;
        // const signed = await signTransaction(transaction);
        // await connection.sendRawTransaction(signed.serialize());
        // toast.success('Transaction sent', {
        //   id: toastId
        // });
      } catch (error: any) {}
    },
    [publicKey, sendTransaction, connection]
  );

  const getTokenAccount = async () => {
    try {
      // const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
      let programId = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
      // const accountAddress = 'EqYfeHEE2o4tF8m3dY26CRW74wscdh1nzyZ21VQfajfb';
      const accountAddress = 'DBiFqs7oK5UkW73ShtinHxPxbrVoCEFgJrEkDN7Swxzn';

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey as any, programId, new PublicKey(accountAddress));

      console.log('toTokenAccount', toTokenAccount);
      console.log(`pubkey: ${toTokenAccount.address.toBase58()}`);
    } catch (e: any) {
      console.error('error', e, e.message);
    }
  };

  const getBaseInfo = async () => {
    try {
      // 获取Solana账户信息
      const accountInfo = await connection.getAccountInfo(publicKey!);
      console.log('getAccountInfo---12', accountInfo);

      const accountAddress = publicKey!.toBase58();
      // const accountAddress = 'EqYfeHEE2o4tF8m3dY26CRW74wscdh1nzyZ21VQfajfb';
      // 解析Token账户信息
      let mintToken = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');

      // let tokenAccount = await getAccount(connection, new PublicKey(accountAddress), 'finalized', programId);
      // console.log('tokenAccount:222', tokenAccount);

      // const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey!, { mint: publicKey! });

      const tokenAccounts = await connection.getTokenAccountsByOwner(
        new PublicKey(accountAddress), // owner here
        {
          mint: mintToken
        }
      );
      console.log('tokenAccounts', tokenAccounts);
      // const tokenAccounts = await connection.getTokenAccountInfo(connection, accountInfo!.owner);
      // const tokenAccounts = await TokenAccountsFilter(connection, accountInfo!.owner);

      console.log('filteredTokenAccounts', tokenAccounts.value.length > 0 ? tokenAccounts.value[0].pubkey.toBase58() : '');

      tokenAccounts.value.forEach((e) => {
        console.log(`pubkey: ${e.pubkey.toBase58()}`);
        const accountInfo = AccountLayout.decode(e.account.data);
        console.log('accountInfo', accountInfo, accountInfo.amount);
        console.log(`mint: ${new PublicKey(accountInfo.mint)}`);
        // console.log(`amount: ${BufferLayout.u64.fromBuffer(accountInfo.amount)}`);
      });

      // // 筛选出与当前账户地址匹配的Token账户
      // const filteredTokenAccounts = tokenAccounts.value.filter((account: any) => {
      //   console.log('publicKey!.toBase58()', account.pubkey.toBase58(), publicKey!.toBase58());
      //   return account.pubkey.toBase58() === accountAddress;
      // });

      // // 打印Token账户信息
      // console.log('filteredTokenAccounts', filteredTokenAccounts);
    } catch (e: any) {}
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

    // connection.getAccountInfo(publicKey).then((info: any) => {
    //   console.log('getAccountInfo', info);
    //   // setBalance(info.lamports);
    // });

    getBaseInfo();
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
      {connected && <Button onClick={initHelloWorld}>initHelloWorld</Button>}
      {connected && <Button onClick={getAccountState}>getAccountState</Button>}
      {connected && <Button onClick={transferSOL}>发送SQL</Button>}
      {connected && <Button onClick={createTokenAccount}>createTokenAccount</Button>}
      {connected && <Button onClick={getTokenAccount}>getTokenAccount</Button>}
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
