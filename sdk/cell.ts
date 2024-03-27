import { BigNumber } from 'ethers';
import { CellABI } from './common/abi/Cell';
import type { Cell as CellContract } from './common/typechain/Cell';
import type { TransactionMethods, ContractMethodReturnType } from './common/types';
import { getTransactionMethods } from './common/transaction';
import { Chain } from './chain';
import { BaseContract } from './contract';

export class Cell extends BaseContract {
  public constructor(chain: Chain, contractAddress: string) {
    super(chain, contractAddress, CellABI);

    this.contract = this.contract as CellContract;
  }

  public withdraw(to: string): TransactionMethods<ContractMethodReturnType<CellContract, 'withdraw'>> {
    return getTransactionMethods(this.contract, 'withdraw', [to]);
  }

  public makeRequest(params: string, overrides: Record<string, any>): TransactionMethods<ContractMethodReturnType<CellContract, 'makeRequest'>> {
    return getTransactionMethods(this.contract, 'makeRequest', [params, overrides]);
  }

  public async getOwner(): Promise<any> {
    return await this.contract.getOwner();
  }

  public async price(): Promise<any> {
    return await this.contract.price();
  }

  public async denom(): Promise<any> {
    return await this.contract.denom();
  }
}

export function getCell(chain: Chain, address: string): Cell {
  if (!chain.contractmaps[address.toLowerCase()]) {
    const ins = new Cell(chain, address);
    chain.contractmaps[address.toLowerCase()] = ins;
  }
  return chain.contractmaps[address.toLowerCase()] as Cell;
}
