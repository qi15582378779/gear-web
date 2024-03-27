import { Connection } from '@solana/web3.js';
import { Provider, AnchorProvider } from '@coral-xyz/anchor';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { HelloWorld, Gear } from '@/programs'

export interface Workspace {
  wallet: AnchorWallet;
  connection: Connection;
  provider: Provider;
  program: any;
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

  const program = useMemo(() => {
    if (provider) {
      // @ts-ignore
      return new HelloWorld(provider!);
    } else {
      return null;
    }
  }, [provider]);

  const workspace = useMemo(() => {
    if (wallet && connected && program) {
      return {
        wallet,
        connection,
        provider,
        program
      };
    } else {
      return null;
    }
  }, [connection, wallet, connected, provider, program]);

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

  const program = useMemo(() => {
    if (provider) {
      // @ts-ignore
      return new Gear(provider!);
    } else {
      return null;
    }
  }, [provider]);

  const workspace = useMemo(() => {
    if (wallet && connected && program) {
      return {
        connection,
        wallet,
        provider,
        program,
      };
    } else {
      return null;
    }
  }, [connection, wallet, connected, program, provider]);

  return workspace;
}