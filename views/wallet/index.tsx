import styled from 'styled-components';
import * as BufferLayout from 'buffer-layout';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction, Transaction, Keypair, SystemProgram } from '@solana/web3.js';
import { createInitializeMintInstruction, TOKEN_PROGRAM_ID, MINT_SIZE, getMinimumBalanceForRentExemptMint, createMint, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/hooks';
import { message } from 'antd';

declare var Uint8Array: any;
const Wallet = () => {
  const { connected, wallet, publicKey, disconnect, sendTransaction } = useWallet();
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

  const sign = async () => {
    try {
      const encodedMessage = new TextEncoder().encode('12121');
      // const msg = await signMessage(encodedMessage);
    } catch (e) {}
  };

  const createMintToken = async () => {
    try {
      // const feePayer = Keypair.fromSecretKey(bs58.decode('AEULR9sgCeMJ42QbQk4KbVhHN8eWY9Yxu5JrduVobcSDQigSNZZY8RQkkwFtCQu84Jdy84BYUp6TPWqgHmaxxms'));
      // let mintPubkey = await createMint(connection, feePayer, publicKey!, publicKey, 9);
      // console.log(`mint: ${mintPubkey.toBase58()}`);
      const mint = Keypair.generate();
      console.log(`mint: ${mint.publicKey.toBase58()}`);
      const transaction = new Transaction();

      transaction.add(
        // create mint account
        SystemProgram.createAccount({
          fromPubkey: publicKey!,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports: await getMinimumBalanceForRentExemptMint(connection),
          programId: TOKEN_PROGRAM_ID
        }),
        createInitializeMintInstruction(
          mint.publicKey, // mint pubkey
          9, // decimals
          publicKey!, // mint authority
          publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
          TOKEN_PROGRAM_ID
        )
      );
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();
      const signature: any = await sendTransaction(transaction, connection, { signers: [mint] });
      const res = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log('tx:::', res);
    } catch (e: any) {
      console.error('error', e.reason || e.message || 'error');
    }
  };

  const createTokenAccount = async () => {
    try {
      const mintPubkey = new PublicKey('6a8VyQRxFEMUBp9mZTazGURKJZL8e6cMb315K3Bq5Xdh');
      const ownerPubkey = new PublicKey('DBiFqs7oK5UkW73ShtinHxPxbrVoCEFgJrEkDN7Swxzn');
      let transaction = new Transaction();
      let ata = await getAssociatedTokenAddress(
        mintPubkey, // mint
        ownerPubkey // owner
      );
      console.log('============token account: ', ata.toBase58());
      transaction.add(
        // create token account
        createAssociatedTokenAccountInstruction(
          publicKey!, // payer
          ata, // ata
          ownerPubkey!, // owner
          mintPubkey // mint
        )
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();

      const signature: any = await sendTransaction(transaction, connection, { minContextSlot });
      const res = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log('tx:::', res);
    } catch (e: any) {
      console.error('error', e.reason || e.message || 'error');
    }
  };

  const mintToken = async () => {
    try {
      // Users
      const PAYER_PUBKEY = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
      const RECEIVER_PUBKEY = new PublicKey('DjWdezJvbqyw1K6RvvhmWUw8Wu2QavHxTajyzgXq7MbU');

      // Mint and token accounts
      const TOKEN_MINT_ACCOUNT = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
      const SOURCE_TOKEN_ACCOUNT = new PublicKey('H9zPKof4XG2iwNrDh6A9ruuerNx6rLCqT6LEYD3VC1Hd');
      const DESTINATION_TOKEN_ACCOUNT = new PublicKey('AYSoVVXUoVtsvDx1YK453GsoxjUZKn5PuRMseAL43mtV');

      let programId = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
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
          { pubkey: SOURCE_TOKEN_ACCOUNT, isSigner: false, isWritable: true },
          { pubkey: DESTINATION_TOKEN_ACCOUNT, isSigner: false, isWritable: true }
        ],
        programId: TOKEN_MINT_ACCOUNT,
        data
      });

      // console.log('instruction', instruction);
      transaction.add(instruction);

      // transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
      // console.log('transaction.recentBlockhash', transaction.recentBlockhash);

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

  const transferToken = async () => {
    try {
      // Users
      const PAYER_PUBKEY = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
      const RECEIVER_PUBKEY = new PublicKey('DjWdezJvbqyw1K6RvvhmWUw8Wu2QavHxTajyzgXq7MbU');

      // Mint and token accounts
      const TOKEN_MINT_ACCOUNT = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
      const SOURCE_TOKEN_ACCOUNT = new PublicKey('H9zPKof4XG2iwNrDh6A9ruuerNx6rLCqT6LEYD3VC1Hd');
      const DESTINATION_TOKEN_ACCOUNT = new PublicKey('AYSoVVXUoVtsvDx1YK453GsoxjUZKn5PuRMseAL43mtV');

      let programId = new PublicKey('9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89');
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
          { pubkey: SOURCE_TOKEN_ACCOUNT, isSigner: false, isWritable: true },
          { pubkey: DESTINATION_TOKEN_ACCOUNT, isSigner: false, isWritable: true }
        ],
        programId: TOKEN_PROGRAM_ID,
        data
      });

      // console.log('instruction', instruction);
      transaction.add(instruction);

      // transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
      // console.log('transaction.recentBlockhash', transaction.recentBlockhash);

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

      // tokenAccounts.value.forEach((e) => {
      //   console.log(`pubkey: ${e.pubkey.toBase58()}`);
      //   const accountInfo = AccountLayout.decode(e.account.data);
      //   console.log('accountInfo', accountInfo, accountInfo.amount);
      //   console.log(`mint: ${new PublicKey(accountInfo.mint)}`);
      //   // console.log(`amount: ${BufferLayout.u64.fromBuffer(accountInfo.amount)}`);
      // });

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
      <div className="content">
        {connected && <Button onClick={getBalance}>获取余额</Button>}
        {connected && <Button onClick={sign}>签名</Button>}
        {connected && <Button onClick={disconnect}>断开连接</Button>}
      </div>
      <div className="content">
        {connected && <Button onClick={createMintToken}>Create Mint account</Button>}
        {connected && <Button onClick={createTokenAccount}>Create Token Account</Button>}
        {connected && <Button onClick={mintToken}>Mint Token</Button>}
        {connected && <Button onClick={transferToken}>Transfer Token</Button>}
      </div>

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
  .content {
    display: flex;
  }
`;
const Button = styled.button`
  width: 150px;
  height: 40px;
  margin: 20px 0;
`;

export default Wallet;
