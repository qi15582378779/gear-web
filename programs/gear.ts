import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { GearProtocol, IDL } from '@/programs/types/gear_protocol';
import { PROGRAM_IDS } from '@/programs/constants';
import { PublicKey } from '@solana/web3.js';

export class Gear {
    public idl: any;
    public programId: PublicKey;
    public program: Program<GearProtocol>;

    constructor(provider: anchor.AnchorProvider) {
        this.idl = JSON.parse(JSON.stringify(IDL));
        // Get the programId according to the network.
        this.programId = new PublicKey(PROGRAM_IDS["devnet"].Gear);
        this.program = new Program(this.idl, this.programId, provider) as Program<GearProtocol>;
    }

    public async getGearPda() {
        const [publicKey] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(this.programId.toBase58())], this.programId);
        return publicKey;
    }
}
