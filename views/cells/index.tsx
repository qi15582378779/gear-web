/* eslint-disable react/no-unescaped-entities */
import { FC, ReactElement, useEffect, useState } from 'react';
import { useWallet } from '@/hooks';
import { Create } from './components';
import styled from 'styled-components';
import { IconMore, IconPlus } from '@/components/Icon';
import Item from './components/item';
import ResultModal from './ResultModal';
import { useCells, useIsCreate } from '@/state/cells/hooks';
import { Skeleton } from 'antd';

const Cells: FC = (): ReactElement => {
  const { account, chainId, walletReady } = useWallet();
  const [list, fetchCells, , reset, loading] = useCells();
  const [isCreate, setIsCreate] = useIsCreate();

  useEffect(() => {
    if (account) fetchCells();
    if (!walletReady) reset();
  }, [account]);
  return (
    <>
      {isCreate ? (
        <Create back={() => setIsCreate(false)} />
      ) : (
        <Main>
          <Header>
            Your Cell
            <span>({list.length})</span>
            <Creater onClick={() => setIsCreate(true)}>
              <IconPlus /> Create
            </Creater>
          </Header>
          <Content>
            {!loading && list.length === 0 ? (
              <Empty>
                <EmptyIcon src="/images/cells/empty.svg" />
                <NoData>You haven't created any cells yet</NoData>
              </Empty>
            ) : (
              <>
                {loading && list.length === 0 ? (
                  <>
                    {Array.from({ length: 6 }, (_, index) => (
                      <LoadItem key={index}>
                        <div>
                          <Skeleton.Avatar active />
                          <Skeleton.Input active />
                        </div>
                        <Skeleton.Input active />
                      </LoadItem>
                    ))}
                  </>
                ) : (
                  <>
                    {list.map((ele, index) => (
                      <Item key={index} data={ele} />
                    ))}
                  </>
                )}
              </>
            )}
            {/*  */}
          </Content>
          <Footer>
            <MoreItem>
              <Title>Learn more</Title>
              <Tip>Learn more about Do-it-yourself automation for workflow</Tip>
              <IconMore />
            </MoreItem>
            <MoreItem>
              <Title>Cell integrations</Title>
              <Tip>Explore all API cell connections</Tip>
              <IconMore />
            </MoreItem>
          </Footer>
        </Main>
      )}
      <ResultModal />
    </>
  );
};

const Main = styled.div`
  width: 8.54rem;
  margin: 0 auto;
  padding-bottom: 0.79rem;
  padding: 0.68rem 0 0.72rem;
  max-width: 100%;
  @media screen and (max-width: 768px) {
    padding: 0.2rem 0.12rem 0.72rem;
  }
`;
const Header = styled.header`
  color: #170f49;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.36rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.35rem; /* 97.222% */
  position: relative;

  span {
    font-size: 0.2rem;
    font-weight: 500;
    line-height: 0.35rem;
    margin-left: 0.14rem;
  }
`;
const Creater = styled.div`
  position: absolute;
  right: 0;
  top: 0.12rem;
  border-radius: 0.12rem;
  background: #fc72ff;
  width: 1.26rem;
  height: 0.38rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.16rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #fa59ff;
  }

  svg {
    width: 0.1rem;
    margin-right: 0.08rem;
  }

  @media screen and (max-width: 768px) {
    top: 50%;
    transform: translateY(-50%);
  }
`;
const Content = styled.section`
  margin-top: 0.19rem;
`;
const Empty = styled.div`
  width: 100%;
  height: 2.42rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 0.24rem;
  border: 1px solid #e9eaf7;
  background: #fff;
`;
const EmptyIcon = styled.img`
  width: 0.48rem;
`;
const NoData = styled.p`
  margin-top: 0.12rem;
  color: #222;
  text-align: center;
  font-size: 0.16rem;
  font-style: normal;
  line-height: 0.2rem; /* 125% */
`;
const Footer = styled.footer`
  margin-top: 0.16rem;
  display: flex;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const MoreItem = styled.div`
  flex: 1;
  border-radius: 0.16rem;
  border: 1px solid #e9eaf7;
  background: #fff;
  padding: 0.16rem;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  @media screen and (max-width: 768px) {
    margin-bottom: 0.12rem;
  }
  &:hover {
    border-color: #f1f1fa;
    /* background: #f1f1fa; */
    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.35);
      transition: all 0.2s;
    }
  }
  &:first-child {
    margin-right: 0.06rem;
  }
  svg {
    position: absolute;
    right: 0.16rem;
    top: 0.19rem;
    cursor: pointer;
    width: 0.16rem;
    color: #6f6c90;
  }
`;
const Title = styled.div`
  color: #222;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.23rem; /* 100% */
`;
const Tip = styled.p`
  color: #222;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.18rem; /* 114.286% */
  margin-top: 0.05rem;
`;

const LoadItem = styled.div`
  padding: 0.16rem;
  border-radius: 0.24rem;
  border: 1px solid #e9eaf7;
  background: #fff;
  margin-bottom: 0.16rem;

  & > div {
    &:nth-of-type(1) {
      display: flex;
      align-items: center;
      & > div {
        height: 0.24rem;
        & > span {
          width: 100% !important;
          height: 100% !important;
          min-width: auto !important;
          border-radius: 0.16rem !important;
        }

        &:nth-of-type(1) {
          width: 0.2rem;
          margin-right: 0.08rem;
        }

        &:nth-of-type(2) {
          width: 80%;
        }
      }
    }

    &:nth-of-type(2) {
      width: 100%;
      height: 0.19rem;
      margin-top: 0.12rem;
      & > span {
        width: 100% !important;
        height: 100% !important;
        min-width: auto !important;
        border-radius: 0.16rem !important;
      }
    }
  }
`;

export default Cells;
