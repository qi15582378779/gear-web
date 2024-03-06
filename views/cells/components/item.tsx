import { FC, ReactElement, useState } from 'react';
import { useTransactionMined, useWallet } from '@/hooks';
import styled from 'styled-components';
import { IconAddress, IconCopy, IconDown, IconPlus } from '@/components/Icon';
import { Button } from 'antd';
import cn from 'classnames';
import { $hash, $shiftedBy, $shiftedByFixed, $copy } from '@/utils/met';
import { getCell } from '@/sdk';
import { TransactionState } from '@/typings';
import { useClaim } from '@/state/cells/hooks';
import { Copy } from '@/components';
import classNames from 'classnames';

type IProps = {
  data: Record<string, any>;
};
const Item: FC<IProps> = ({ data }): ReactElement => {
  const { wallet, chainId, account, getScanAddress, getGreenfieldScanAddress, walletReady, switchNetwork, scan } = useWallet();
  const [claim, calimLoading] = useClaim();

  const [open, setOpen] = useState(false);

  return (
    <Main
      onClick={() => {
        setOpen(!open);
      }}
    >
      <Header>
        <UserInfo>
          <div>
            <Picture src={data.logoFile} />
            <Name>{data.name}</Name>
          </div>

          <Address>
            <IconAddress className="address" />
            {$hash(data.cellAddress, 4, 4)}
            <Copy
              className="copy"
              copy={() => {
                $copy(data.cellAddress);
              }}
            />
            {/* <IconCopy
              className="copy"
              onClick={(e) => {
                e.stopPropagation();
                $copy(data.owner);
              }}
            /> */}
          </Address>
        </UserInfo>
        <Reward>
          <SymbolGroup>
            <Symbol src={`/images/tokens/${data.tokeninfo.symbol}.png`} />
            {data.reward} {data.tokeninfo.symbol}
          </SymbolGroup>
          <Claim
            className="_common_btn"
            loading={calimLoading}
            disabled={Number(data.reward) === 0}
            onClick={(e) => {
              e.stopPropagation();
              if (!walletReady) {
                switchNetwork();
                return;
              }
              claim(data);
            }}
          >
            Claim
          </Claim>
          <IconGroup className={cn(open ? '_open' : '')}>
            <IconDown />
          </IconGroup>
        </Reward>
      </Header>

      <SymbolGroupH5>
        <Symbol src="/images/tokens/BNB.png" />
        {data.reward} {data.tokeninfo.symbol}
      </SymbolGroupH5>

      <Tip>{data.description}</Tip>
      <Content className={cn(open ? 'open' : 'close')}>
        <Line>
          <Label>Fee</Label>
          <Fee>
            <Symbol src={`/images/tokens/${data.tokeninfo.symbol}.png`} />
            {$shiftedBy(data.price, -1 * data.tokeninfo.decimals)}/<span>Call</span>
          </Fee>
        </Line>
        <Line>
          <Label>aicell nft</Label>
          <Link href={`${scan[chainId]}/nft/${data.Registry}/${data.tokenId}`} target="_blank">
            {$hash(`${scan[chainId]}/nft/${data.Registry}/${data.tokenId}`, 15, 8)}
            <img src="/images/cells/link.svg" alt="" />
          </Link>
        </Line>
        <Line>
          <Label>GreenFiled Storage</Label>
          <Hash>
            Txn Hash:
            <Link href={`${getGreenfieldScanAddress(data.metadataTxhash, 'tx')}`} target="_blank">
              {$hash(data.metadataTxhash, 4, 4)}
            </Link>
            <Copy
              className="copy"
              copy={() => {
                $copy(data.metadataTxhash);
              }}
            />
            {/* <IconCopy
              className="copy"
              onClick={(e) => {
                e.stopPropagation();
                $copy(data.metadataTxhash);
              }}
            /> */}
          </Hash>
        </Line>
      </Content>
    </Main>
  );
};

const Main = styled.div`
  padding: 0.16rem;
  border-radius: 0.24rem;
  border: 1px solid #e9eaf7;
  background: #fff;
  margin-bottom: 0.16rem;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 768px) {
    align-items: flex-start;
  }
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  & > div {
    &:nth-of-type(1) {
      display: flex;
      align-items: center;
    }
  }

  @media screen and (max-width: 768px) {
    display: block;
  }
`;
const Picture = styled.img`
  height: 0.2rem;
  border-radius: 50%;
`;
const Name = styled.div`
  margin: 0 0.08rem;
`;
const Address = styled.div`
  display: flex;
  align-items: center;

  color: #fc72ff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.12rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.2rem;
  .address {
    width: 0.16rem;
    margin-right: 0.04rem;
    color: #7d7d7d;
  }
  .copy {
    margin-left: 0.04rem;
  }

  @media screen and (max-width: 768px) {
    padding-left: 0.28rem;
  }
`;
const Reward = styled.div`
  display: flex;
  align-items: center;
`;

const SymbolGroup = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const SymbolGroupH5 = styled.div`
  display: none;
  align-items: center;
  justify-content: end;
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.12rem;
  cursor: pointer;
  color: #a4aebc;
  transition: all 0.2s;
  svg {
    width: 0.15rem;
    transition: all 0.2s;
  }
  &._open {
    transform: rotate(180deg);
  }

  &:hover {
    svg {
      color: #fc72ff;
    }
  }
`;

const Symbol = styled.img`
  width: 0.14rem;
  margin-right: 0.08rem;
`;

const Claim = styled(Button)`
  height: 0.24rem;
  padding: 0rem 0.1rem;
  border-radius: 0.12rem;
  background: #ffefff;
  color: #fc72ff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 500;
  margin-left: 0.12rem;
  &:hover {
    border-color: #ffefff !important;
    color: #fc72ff !important;
  }
`;
const Tip = styled.p`
  margin-top: 0.1rem;
  color: #7d7d7d;
  font-size: 0.12rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6; /* 19.2px */
  word-wrap: break-word;
`;
const Content = styled.div`
  border-radius: 0.16rem;
  border: 1px solid #efefef;
  background: #f9f9f9;

  overflow: hidden;
  transition: opacity 267ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 178ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transform-origin: 0 0;
  transform: scaleY(0);
  height: 0;
  &.open {
    padding: 0.12rem 0.32rem 0.12rem 0.16rem;
    margin: 0.12rem 0 0.03rem;
    border: 1px solid #efefef;
    height: auto;
    transform: scaleY(1);
  }
`;

const Line = styled.div`
  height: 0.18rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.04rem;
  &:last-child {
    margin-bottom: 0;
  }
`;
const Label = styled.div`
  color: #7d7d7d;
  font-size: 0.12rem;
  letter-spacing: 0.4px;
`;
const Fee = styled.div`
  display: flex;
  align-items: center;
  color: #222;
  font-size: 0.12rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  span {
    color: rgba(34, 34, 34, 0.6);
  }
`;
const Hash = styled.div`
  display: flex;
  align-items: center;
  color: #061c41;
  text-align: center;
  font-size: 0.12rem;
  letter-spacing: 0.4px;
  svg {
    width: 0.12rem;
    cursor: pointer;
    margin-left: 0.04rem;
    color: #222;
  }
`;
const Link = styled.a`
  color: #fc72ff;
  font-size: 0.12rem;
  font-style: normal;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  img {
    width: 0.12rem;
    height: 0.12rem;
    margin-left: 0.02rem;
    cursor: pointer;
  }
`;

export default Item;
