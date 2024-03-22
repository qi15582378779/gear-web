import { Connection, PublicKey } from '@solana/web3.js';
import { Provider, AnchorProvider, Program } from '@project-serum/anchor';
// import idl from '@/abi/nft_social_media.json';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { createProgram } from '@/utils/utils';

export interface Workspace {
  wallet: AnchorWallet;
  connection: Connection;
  provider: Provider;
  program: Program;
}

const preflightCommitment = 'confirmed';
const commitment = 'confirmed';
const programId = new PublicKey('5NjgwpGKcNsR5TNWSmCFTjR4PZ6kjZ4YqncqYJZccxFk');

export default function useWorkspace() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { connected } = useWallet();

  const provider = useMemo(() => {
    if (wallet) {
      return new AnchorProvider(connection, wallet, {
        commitment,
        preflightCommitment
      });
    } else {
      return null;
    }
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (provider) {
      // @ts-ignore
      return createProgram(provider);
    } else {
      return null;
    }
  }, [provider]);

  const workspace = useMemo(() => {
    if (wallet && program && connected) {
      return {
        connection,
        program,
        programId,
        wallet
      };
    } else {
      return null;
    }
  }, [connection, program, wallet, connected]);

  return workspace;
}
