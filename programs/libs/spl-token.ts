import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";

export class SPLToken {
    public mint: PublicKey;
    public provider: anchor.Provider;

    constructor(provider: anchor.Provider, mint: PublicKey) {
        this.provider = provider;
        this.mint = mint;
    }

    public async createTokenAccount() {
        try {
            if (!this.provider) throw Error("Invalid provider");
            let transaction = new Transaction();
            let ata = await getAssociatedTokenAddress(
                this.mint, // mint
                this.provider.publicKey! // owner
            );
            console.log("============token account: ", ata.toBase58());
            transaction.add(
                // create token account
                createAssociatedTokenAccountInstruction(
                    this.provider.publicKey!, // payer
                    ata, // ata
                    this.provider.publicKey!, // owner
                    this.mint // mint
                )
            );

            // const {
            //     context: { slot: minContextSlot },
            //     value: { blockhash, lastValidBlockHeight }
            // } = await connection.getLatestBlockhashAndContext();

            // const signature: any = await sendTransaction(transaction, connection, { minContextSlot });
            // const res = await connection.confirmTransaction({
            //     blockhash,
            //     lastValidBlockHeight,
            //     signature
            // });

            const res = await this.provider.sendAndConfirm!(transaction)
            console.log("tx:::", res);
        } catch (e: any) {
            console.error("error", e.reason || e.message || "error");
        }
    };

    public async getTokenAccount() {
        // try {
        //     // const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
        //     let programId = new PublicKey("9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89");
        //     // const accountAddress = 'EqYfeHEE2o4tF8m3dY26CRW74wscdh1nzyZ21VQfajfb';
        //     const accountAddress = "DBiFqs7oK5UkW73ShtinHxPxbrVoCEFgJrEkDN7Swxzn";

        //     const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, publicKey as any, programId, new PublicKey(accountAddress));

        //     console.log("toTokenAccount", toTokenAccount);
        //     console.log(`pubkey: ${toTokenAccount.address.toBase58()}`);
        // } catch (e: any) {
        //     console.error("error", e, e.message);
        // }
    };

    public async getTokenBalance() {
        // try {
        //     if (publicKey !== null) {
        //         // get all token accounts
        //         const balance = await connection.getBalance(publicKey);
        //         console.log("balance", balance, publicKey);
        //         setBalance(balance / LAMPORTS_PER_SOL);

        //         // get balances
        //         const RAY_TOKEN_MINT = "AYSoVVXUoVtsvDx1YK453GsoxjUZKn5PuRMseAL43mtV";
        //         let tokenAcs: any = await connection.getTokenAccountBalance(new PublicKey(RAY_TOKEN_MINT));
        //         console.log("tokenAccs", tokenAcs, tokenAcs.value.uiAmount || 0);
        //         setDevTokenBalance(tokenAcs.value.uiAmount || 0);
        //         // let rayTokenAddress: PublicKey;
        //         // tokenAcs
        //         //   // .filter((acc: any) => acc.accountInfo.mint.toBase58() === RAY_TOKEN_MINT)
        //         //   .map(async (acc: any) => {
        //         //     rayTokenAddress = acc.pubkey;
        //         //     console.log('acc', rayTokenAddress, acc);

        //         //     const accBalance = await connection.getTokenAccountBalance(rayTokenAddress);
        //         //     const rayBal = accBalance.value.uiAmount || 0;
        //         //     // setRayBalance(rayBal);
        //         //   });
        //     }
        // } catch (e: any) {
        //     console.error("getBalance error", e.message);
        // }
    };

    public async transferToken() {
        // try {
        //     // Users
        //     const PAYER_PUBKEY = new PublicKey("9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89");
        //     const RECEIVER_PUBKEY = new PublicKey("DjWdezJvbqyw1K6RvvhmWUw8Wu2QavHxTajyzgXq7MbU");

        //     // Mint and token accounts
        //     const TOKEN_MINT_ACCOUNT = new PublicKey("9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89");
        //     const SOURCE_TOKEN_ACCOUNT = new PublicKey("H9zPKof4XG2iwNrDh6A9ruuerNx6rLCqT6LEYD3VC1Hd");
        //     const DESTINATION_TOKEN_ACCOUNT = new PublicKey("AYSoVVXUoVtsvDx1YK453GsoxjUZKn5PuRMseAL43mtV");

        //     let programId = new PublicKey("9t7A8kkRRTPV391tvKWw5FfEhr6UwtcD2ijbAbJ2fs89");
        //     const transaction = new Transaction();

        //     // 创建一个 buffer layout 来描述转账指令的数据
        //     const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction"), BufferLayout.nu64("amount")]);

        //     // 创建一个包含转账指令和转账金额的 buffer
        //     const data = Buffer.alloc(dataLayout.span);
        //     dataLayout.encode(
        //         {
        //             instruction: 3, // 转账指令的编号
        //             amount: 100 * LAMPORTS_PER_SOL // 转账金额，转换为 lamports
        //         },
        //         data
        //     );

        //     const instruction = new TransactionInstruction({
        //         keys: [
        //             {
        //                 pubkey: SOURCE_TOKEN_ACCOUNT,
        //                 isSigner: false,
        //                 isWritable: true
        //             },
        //             {
        //                 pubkey: DESTINATION_TOKEN_ACCOUNT,
        //                 isSigner: false,
        //                 isWritable: true
        //             }
        //         ],
        //         programId: TOKEN_PROGRAM_ID,
        //         data
        //     });

        //     // console.log('instruction', instruction);
        //     transaction.add(instruction);

        //     // transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
        //     // console.log('transaction.recentBlockhash', transaction.recentBlockhash);

        //     // console.log('transaction.feePayer', transaction.feePayer);
        //     // transaction.feePayer = payerPublicKey;

        //     const {
        //         context: { slot: minContextSlot },
        //         value: { blockhash, lastValidBlockHeight }
        //     } = await connection.getLatestBlockhashAndContext();

        //     const signature: any = await sendTransaction(transaction, connection, { minContextSlot });
        //     console.log("transactionSignature:::", signature);
        //     // const tx = await connection.sendRawTransaction(transactionSignature.serialize());
        //     // console.log('tx:::', tx);
        //     console.log("explorer---", `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        //     const { context, value } = await connection.confirmTransaction({
        //         blockhash,
        //         lastValidBlockHeight,
        //         signature
        //     });
        //     console.log("context:::", context);
        //     console.log("result:::", !value.err ? "success" : "error");
        //     message.success(!value.err ? "success" : "fail");
        // } catch (e: any) {
        //     console.error("error", e.reason || e.message || "error");
        // }
    };
}
