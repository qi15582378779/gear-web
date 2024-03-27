import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { HelloWorld as HW, IDL } from '@/programs/types/hello_world';
import { PROGRAM_IDS } from '@/programs/constants';
import { PublicKey } from '@solana/web3.js';

export class HelloWorld {
    public idl: any;
    public programId: PublicKey;
    public provider: anchor.AnchorProvider;

    private _program: Program<HW>;

    constructor(provider: anchor.AnchorProvider) {
        this.idl = JSON.parse(JSON.stringify(IDL));
        // Get the programId according to the network.
        this.programId = new PublicKey(PROGRAM_IDS["devnet"].HelloWorld);
        this.provider = provider;
        this._program = new Program(this.idl, this.programId, provider) as Program<HW>;
    }

    /**
     * @instruction initialize
     * @param data
     * @returns transaction signature
     */
    public async initialize(data: string): Promise<string> {
        let helloworldPda = await this.getHelloWorldPda();
        const tx = await this._program.methods
            .initialize(data)
            .accounts({
                helloWorld: helloworldPda,
                authority: this.provider.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .rpc();
        return tx;
    }

    /**
     * @instruction update
     * @param data string
     * @returns transaction signature
     */
    public async update(data: string): Promise<string> {
        let helloworldPda = await this.getHelloWorldPda();
        const tx = await this._program.methods
            .update(data)
            .accounts({
                helloWorld: helloworldPda,
                authority: this.provider.publicKey
            })
            .rpc();
        return tx;
    }

    /**
     * @account HelloWorld
     * @returns authority publicKey
     * @returns data string
     */
    public async getAccountState(): Promise<any> {
        try {
            let padPubKey = await this.getHelloWorldPda();
            let accountState = await this._program.account.helloWorld.fetch(padPubKey);
            return accountState
        } catch (e: any) {
            console.error("getParams error", e.message);
        }
    };

    public async getHelloWorldPda() {
        const [publicKey] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('hello-world')], this.programId);
        return publicKey;
    }
}
