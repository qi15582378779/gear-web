import { Connection } from '@solana/web3.js';
import { Provider, AnchorProvider, Program } from '@project-serum/anchor';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { HelloWorld } from '@/programs'

export interface Workspace {
  wallet: AnchorWallet;
  connection: Connection;
  provider: Provider;
  program: Program;
}

const preflightCommitment = 'confirmed';
const commitment = 'confirmed';

export function useWorkspaceHW() {
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

  const ins = useMemo(() => {
    if (provider) {
      // @ts-ignore
      return new HelloWorld(provider!);
    } else {
      return null;
    }
  }, [provider]);

  // const program = useMemo(() => {
  //   if (ins) {
  //     // @ts-ignore
  //     return ins.program;
  //   } else {
  //     return null;
  //   }
  // }, [ins]);

  const workspace = useMemo(() => {
    if (wallet && connected && ins) {
      return {
        connection,
        program: ins.program,
        programId: ins.programId,
        wallet
      };
    } else {
      return null;
    }
  }, [connection, wallet, connected, ins]);

  return workspace;
}

export function useWorkspaceGear() {
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

  const ins = useMemo(() => {
    if (provider) {
      // @ts-ignore
      return new HelloWorld(provider!);
    } else {
      return null;
    }
  }, [provider]);

  // const program = useMemo(() => {
  //   if (ins) {
  //     // @ts-ignore
  //     return ins.program;
  //   } else {
  //     return null;
  //   }
  // }, [ins]);

  const workspace = useMemo(() => {
    if (wallet && connected && ins) {
      return {
        connection,
        program: ins.program,
        programId: ins.programId,
        wallet
      };
    } else {
      return null;
    }
  }, [connection, wallet, connected, ins]);

  return workspace;
}