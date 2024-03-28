import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { GearProtocol, IDL } from '@/programs/types/gear_protocol';
import { PROGRAM_IDS } from '@/programs/constants';
import { PublicKey } from '@solana/web3.js';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    findMasterEditionPda,
    findMetadataPda,
    mplTokenMetadata,
    MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

export class Gear {
    public idl: any;
    public programId: PublicKey;
    public provider: anchor.AnchorProvider;

    private _program: Program<GearProtocol>;

    constructor(provider: anchor.AnchorProvider) {
        this.idl = JSON.parse(JSON.stringify(IDL));
        // Get the programId according to the network.
        this.programId = new PublicKey(PROGRAM_IDS["devnet"].Gear);
        this.provider = provider;
        this._program = new Program(this.idl, this.programId, provider) as Program<GearProtocol>;
    }

    /**
     * @instruction createGear
     * @param name string
     * @param symbol string
     * @param uri string
     * @returns transaction signature
     */
    public async createGear(name: string, symbol: string, uri: string, price: number, path: string): Promise<any> {

        const umi = createUmi(this.provider.connection)
            .use(walletAdapterIdentity(this.provider.wallet))
            .use(mplTokenMetadata());

        const mint = anchor.web3.Keypair.generate();
        console.log("mint address=", mint.publicKey.toBase58());

        // Derive the gear account
        const gearAccount = await this.getGearPda(mint.publicKey);
        console.log('gearAccount address=', gearAccount.toBase58())

        // Derive the associated token address account for the mint
        const associatedTokenAccount = await getAssociatedTokenAddress(
            mint.publicKey,
            this.provider.publicKey
        );
        console.log("associatedTokenAccount address=", associatedTokenAccount.toBase58());

        // Derive the metadata account
        let metadataAccount = findMetadataPda(umi, {
            mint: publicKey(mint.publicKey),
        })[0];
        console.log("metadataAccount address=", metadataAccount);

        //Derive the master edition pda
        let masterEditionAccount = findMasterEditionPda(umi, {
            mint: publicKey(mint.publicKey),
        })[0];
        console.log("masterEditionAccount address=", masterEditionAccount);

        const tx = await this._program.methods
            .createGear(name, symbol, uri, price, path)
            .accounts({
                signer: this.provider.publicKey,
                gearAccount: gearAccount,
                mint: mint.publicKey,
                associatedTokenAccount,
                metadataAccount: metadataAccount,
                masterEditionAccount: masterEditionAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([mint])
            .rpc({ skipPreflight: true });
        return { gearAddress: mint.publicKey, tx };
    }

    /**
     * @instruction callGear
     * @param gearAddress string
     * @returns transaction signature
     */
    public async callGear(gearAddress: string): Promise<string> {
        const mintPubKey = new PublicKey(gearAddress);
        const gearPda = await this.getGearPda(mintPubKey);
        const tx = await this._program.methods
            .callGear()
            .accounts({
                nft: mintPubKey,
                gear: gearPda,
                user: this.provider.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .rpc();
        return tx
    }

    public async claim(gearAddress: string): Promise<string> {
        const mintPubKey = new PublicKey(gearAddress);
        const gearPda = await this.getGearPda(mintPubKey)
        const tx = await this._program.methods
            .claim()
            .accounts({
                signer: this.provider.publicKey,
                nft: mintPubKey,
                gear: gearPda,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .rpc();
        // console.log(`claim token from gear tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
        return tx;
    }

    /**
     * @account HelloWorld
     * @returns authority publicKey
     * @returns data string
     */
    public async getGearState(mint: PublicKey): Promise<any> {
        let padPubKey = await this.getGearPda(mint);
        let state = await this._program.account.gear.fetch(padPubKey);
        return state
    };

    public async getGearPda(mint: PublicKey): Promise<PublicKey> {
        const [gearAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
            [mint.toBuffer()],
            this.programId
        );
        return gearAccount;
    }
}
