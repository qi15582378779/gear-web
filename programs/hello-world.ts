import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { HelloWorld as HW, IDL } from '@/programs/types/hello_world';
import { PROGRAM_IDS } from '@/programs/constants';
import { PublicKey } from '@solana/web3.js';

export class HelloWorld {
    public idl: any;
    public programId: PublicKey;
    public program: Program<HW>;

    constructor(provider: anchor.AnchorProvider) {
        this.idl = JSON.parse(JSON.stringify(IDL));
        // Get the programId according to the network.
        this.programId = new PublicKey(PROGRAM_IDS["devnet"].HelloWorld);
        this.program = new Program(this.idl, this.programId, provider) as Program<HW>;
    }

    public async getHelloWorldPda() {
        const [publicKey] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('hello-world')], this.programId);
        return publicKey;
    }
}
