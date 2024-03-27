import * as anchor from '@project-serum/anchor';
import { PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, MINT_SIZE, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";

export class SPLToken {
    public programId: PublicKey;
    public connection: anchor.web3.Connection;

    constructor(connection: anchor.web3.Connection, programId: string) {
        this.connection = connection;
        this.programId = new PublicKey(programId);
    }

    public async createMintTokenTransaction(creator: PublicKey) {
        try {
            const mint = Keypair.generate();
            console.log(`mint: ${mint.publicKey.toBase58()}`);
            const transaction = new Transaction();

            transaction.add(
                // create mint account
                SystemProgram.createAccount({
                    fromPubkey: creator!,
                    newAccountPubkey: mint.publicKey,
                    space: MINT_SIZE,
                    lamports: await getMinimumBalanceForRentExemptMint(this.connection),
                    programId: TOKEN_PROGRAM_ID
                }),
                createInitializeMintInstruction(
                    mint.publicKey, // mint pubkey
                    9, // decimals
                    creator!, // mint authority
                    creator, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
                    TOKEN_PROGRAM_ID
                )
            );

            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight }
            } = await this.connection.getLatestBlockhashAndContext();

            const signature: any = await sendTransaction(transaction, this.connection, {
                signers: [mint]
            });
            const res = await this.connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature
            });
            return res;
        } catch (e: any) {
            console.error("error", e.reason || e.message || "error");
        }
    };

    public createTokenAccount() {
        try {
            const mintPubkey = new PublicKey("6a8VyQRxFEMUBp9mZTazGURKJZL8e6cMb315K3Bq5Xdh");
            const ownerPubkey = new PublicKey("DBiFqs7oK5UkW73ShtinHxPxbrVoCEFgJrEkDN7Swxzn");
            let transaction = new Transaction();
            let ata = await getAssociatedTokenAddress(
                mintPubkey, // mint
                ownerPubkey // owner
            );
            console.log("============token account: ", ata.toBase58());
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
            const res = await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature
            });
            console.log("tx:::", res);
        } catch (e: any) {
            console.error("error", e.reason || e.message || "error");
        }
    };

    public getTokenAccount() {
        try {
            // const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
            let programId = new PublicKey("9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89");
            // const accountAddress = 'EqYfeHEE2o4tF8m3dY26CRW74wscdh1nzyZ21VQfajfb';
            const accountAddress = "DBiFqs7oK5UkW73ShtinHxPxbrVoCEFgJrEkDN7Swxzn";

            const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey as any, programId, new PublicKey(accountAddress));

            console.log("toTokenAccount", toTokenAccount);
            console.log(`pubkey: ${toTokenAccount.address.toBase58()}`);
        } catch (e: any) {
            console.error("error", e, e.message);
        }
    };

    public getTokenBalance() {
        try {
            if (publicKey !== null) {
                // get all token accounts
                const balance = await connection.getBalance(publicKey);
                console.log("balance", balance, publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);

                // get balances
                const RAY_TOKEN_MINT = "AYSoVVXUoVtsvDx1YK453GsoxjUZKn5PuRMseAL43mtV";
                let tokenAcs: any = await connection.getTokenAccountBalance(new PublicKey(RAY_TOKEN_MINT));
                console.log("tokenAccs", tokenAcs, tokenAcs.value.uiAmount || 0);
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
            console.error("getBalance error", e.message);
        }
    };

    public transferToken() {
        try {
            // Users
            const PAYER_PUBKEY = new PublicKey("9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89");
            const RECEIVER_PUBKEY = new PublicKey("DjWdezJvbqyw1K6RvvhmWUw8Wu2QavHxTajyzgXq7MbU");

            // Mint and token accounts
            const TOKEN_MINT_ACCOUNT = new PublicKey("9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89");
            const SOURCE_TOKEN_ACCOUNT = new PublicKey("H9zPKof4XG2iwNrDh6A9ruuerNx6rLCqT6LEYD3VC1Hd");
            const DESTINATION_TOKEN_ACCOUNT = new PublicKey("AYSoVVXUoVtsvDx1YK453GsoxjUZKn5PuRMseAL43mtV");

            let programId = new PublicKey("9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89");
            const transaction = new Transaction();

            // 创建一个 buffer layout 来描述转账指令的数据
            const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction"), BufferLayout.nu64("amount")]);

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
                    {
                        pubkey: SOURCE_TOKEN_ACCOUNT,
                        isSigner: false,
                        isWritable: true
                    },
                    {
                        pubkey: DESTINATION_TOKEN_ACCOUNT,
                        isSigner: false,
                        isWritable: true
                    }
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
            console.log("transactionSignature:::", signature);
            // const tx = await connection.sendRawTransaction(transactionSignature.serialize());
            // console.log('tx:::', tx);
            console.log("explorer---", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
            const { context, value } = await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature
            });
            console.log("context:::", context);
            console.log("result:::", !value.err ? "success" : "error");
            message.success(!value.err ? "success" : "fail");
        } catch (e: any) {
            console.error("error", e.reason || e.message || "error");
        }
    };
}
