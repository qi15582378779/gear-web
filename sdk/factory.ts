import { BigNumber } from 'ethers';
import { FactoryABI } from './common/abi/Factory';
import type { Factory as FactoryContract } from './common/typechain/Factory';
import type { TransactionMethods, ContractMethodReturnType } from './common/types';
import { getTransactionMethods } from './common/transaction';
import { Chain } from './chain';
import { BaseContract } from './contract';

export class Factory extends BaseContract {
    public constructor(chain: Chain, contractAddress: string) {
        super(chain, contractAddress, FactoryABI);

        this.contract = this.contract as FactoryContract;
    }

    public create(to: string, tokenURI: string, encrypURL: string, denom: string, price: string): TransactionMethods<ContractMethodReturnType<FactoryContract, 'create'>> {
        return getTransactionMethods(this.contract, 'create', [to, tokenURI, encrypURL, denom, price]);
    }

    public async tokenId2Cell(tokenId: number | string): Promise<any> {
        return await this.contract.tokenId2Cell(tokenId);
    }
}

export function getFactory(chain: Chain, address: string): Factory {
    if (!chain.contractmaps[address.toLowerCase()]) {
        const ins = new Factory(chain, address);
        chain.contractmaps[address.toLowerCase()] = ins;
    }
    return chain.contractmaps[address.toLowerCase()] as Factory;
}
