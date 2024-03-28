import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { GearProtocol, IDL } from '@/programs/types/gear_protocol';
import { PROGRAM_IDS } from '@/programs/constants';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { findMasterEditionPda, findMetadataPda, mplTokenMetadata, MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
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
   * @notice The instruction createGear.
   * @param name The name of gear NFT.
   * @param symbol The synmbol of gear NFT.
   * @param uri The tokenURI of gear NFT.
   * @param price Amount the caller need to pay.
   * @param path Request encrypted path.
   * @returns Transaction signature
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
   * @notice The instruction callGear
   * @param gearAddress The mint (NFT) address
   * @returns Transaction signature
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

  /**
   * @notice The instruction claim.
   * @param gearAddress The mint (NFT) address.
   * @returns Transaction signature.
  */
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
   * @notice Get pad gearAccount state.
   * @param gearAddress The mint (NFT) address.
   * @returns authority publicKey
   * @returns data string
   */
  public async getGearState(gearAddress: PublicKey): Promise<any> {
    let padPubKey = await this.getGearPda(gearAddress);
    let state = await this._program.account.gear.fetch(padPubKey);
    return state
  };

  /**
   * @notice Get the claimable amount of denom token.
   * @param gearAddress The mint (NFT) address.
  */
  public async getClaimableAmount(gearAddress: PublicKey): Promise<string> {
    const padPubKey = await this.getGearPda(gearAddress);
    console.log('====padPubKey', padPubKey.toBase58());
    let pdaInfo = await this._program.account.gear.getAccountInfo(padPubKey)
    const rent = await this.provider.connection.getMinimumBalanceForRentExemption(pdaInfo?.data.byteLength!)
    const res = await this.provider.connection.getBalance(padPubKey);
    return ((res - rent) / LAMPORTS_PER_SOL).toString();
  }

  /**
   * @notice Get the gearAccount pda address.
   * @param mint The mint address.
  */
  public async getGearPda(mint: PublicKey): Promise<PublicKey> {
    const [gearAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
      [mint.toBuffer()],
      this.programId
    );
    return gearAccount;
  }
}
