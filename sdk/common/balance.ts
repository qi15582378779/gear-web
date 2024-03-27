import { providers as multicallProviders } from '@0xsequence/multicall';
import { BigNumber, Contract } from 'ethers';
import { ERC1155ABI } from './abi/ERC1155';
import { ERC20ABI } from './abi/ERC20';
import { ERC721ABI } from './abi/ERC721';
import type { Item } from './types';
import { isErc1155Item, isErc20Item, isErc721Item } from './item';

export const balanceOf = async (
  owner: string,
  item: Item,
  multicallProvider: multicallProviders.MulticallProvider
): Promise<BigNumber> => {
  if (isErc721Item(item.itemType)) {
    const contract = new Contract(item.token, ERC721ABI, multicallProvider);

    return contract
      .ownerOf(item.identifierOrCriteria)
      .then((ownerOf:any) => BigNumber.from(Number(ownerOf.toLowerCase() === owner.toLowerCase())));
  } else if (isErc1155Item(item.itemType)) {
    const contract = new Contract(item.token, ERC1155ABI, multicallProvider);

    return contract.balanceOf(owner, item.identifierOrCriteria);
  }

  if (isErc20Item(item.itemType)) {
    const contract = new Contract(item.token, ERC20ABI, multicallProvider);
    return contract.balanceOf(owner);
  }

  return multicallProvider.getBalance(owner);
};
