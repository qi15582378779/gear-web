import { BigNumber } from 'ethers';
import { RegistryABI } from './common/abi/Registry';
import type { Registry as RegistryContract } from './common/typechain/Registry';
import type { TransactionMethods, ContractMethodReturnType } from './common/types';
import { getTransactionMethods } from './common/transaction';
import { Chain } from './chain';
import { ERC721 } from './erc721';

export class Registry extends ERC721 {
  public constructor(chain: Chain, contractAddress: string) {
    super(chain, contractAddress, RegistryABI);

    this.contract = this.contract as RegistryContract;
  }

  public async encryptURLs(tokenId: number | string): Promise<any> {
    return await this.contract.encryptURLs(tokenId);
  }

  public async tokenOfOwnerByIndex(owner: string, index: number): Promise<any> {
    return await this.contract.tokenOfOwnerByIndex(owner, index);
  }
}

export function getRegistry(chain: Chain, address: string): Registry {
  if (!chain.contractmaps[address.toLowerCase()]) {
    const ins = new Registry(chain, address);
    chain.contractmaps[address.toLowerCase()] = ins;
  }
  return chain.contractmaps[address.toLowerCase()] as Registry;
}
