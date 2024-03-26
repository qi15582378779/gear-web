import * as anchor from '@project-serum/anchor';
import { BN, Program } from '@project-serum/anchor';

// import ProgramIDL from '@/abi/nft_social_media.json';
import { HelloWorld } from '@/idl/hello_world';
import { PublicKey } from '@solana/web3.js';

import { IDL } from '@/idl/hello_world';

const PROGRAM_ID = new PublicKey('5NjgwpGKcNsR5TNWSmCFTjR4PZ6kjZ4YqncqYJZccxFk');

// 创建一个provider所在链的program实例
export function createProgram(provider: anchor.AnchorProvider): anchor.Program<HelloWorld> {
  const idl = JSON.parse(JSON.stringify(IDL));
  // const programId = ProgramIDL.metadata.address;
  const programId = '5NjgwpGKcNsR5TNWSmCFTjR4PZ6kjZ4YqncqYJZccxFk';
  const program = new Program(idl, programId, provider) as Program<HelloWorld>;

  console.log('program', program);
  return program;
}

export const getPostPda = async () => {
  const [publicKey] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('hello-world')], PROGRAM_ID);
  console.log("========publicKey: ", publicKey.toBase58())
  return publicKey;
};
