import { useCallback } from 'react';
import useWallet from './useWallet';

function useSignature(): () => Promise<{ [key: string]: string }> {
  const { account, wallet } = useWallet();

  const getSignature = useCallback(async (): Promise<{ [key: string]: string }> => {
    const msg = 'Welcome to PromptPortAI,  At Date: ' + Date.now();
    const signature = await wallet.signMessage(msg);
    return { msg, signature };
  }, [wallet, account]);
  return getSignature;
}

export default useSignature;
