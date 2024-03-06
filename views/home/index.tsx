import { IconDown, IconHistory, IconHistory2 } from '@/components/Icon';
import cn from 'classnames';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Skeleton, Tooltip, message, notification } from 'antd';
import CellModal from './components/cellModal';
import HistoryModal from './components/history-modal';
import { useApproveByToken, useTransactionMined, useWallet } from '@/hooks';
import { useConnectWallet } from '@/state/chain/hooks';
import { $BigNumber, $shiftedBy, $shiftedByFixed, $sleep } from '@/utils/met';
import { getCell, ERC20 } from '@/sdk';

import Server from '@/service';
import { ApprovalState, TransactionState } from '@/typings';
import { useApproveDialog, useHasNewHistory, useHistory, useHistoryDialog, useResultModal } from '@/state/call/hooks';
import ResultModal from './ResultModal';
import ApproveModal from './ApproveModal';
import { useUserBalance } from '@/state/base/hooks';

const Home: FC = (): ReactElement => {
  const [, connectWallet] = useConnectWallet();
  const [history, { fetchHistory, reset }] = useHistory();
  const { account, wallet, walletReady, switchNetwork } = useWallet();
  const [balance, getUserBalance] = useUserBalance();

  const [{ approvalState, transactionState }, { approve, getAllowance }, approveLoading] = useApproveByToken();
  const [, { awaitTransactionMined }] = useTransactionMined();
  const [showHistoryModal, handShowHistoryModal] = useHistoryDialog();
  const [approveResultDialog, handApproveResultModal] = useApproveDialog();

  const [, handResultModal] = useResultModal();
  const [hasNewHistory, handHasNewHistory] = useHasNewHistory();

  const [detailData, setDetailData] = useState<any>(null);
  const [cellModalFlag, setCellModalFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const btn_disabled = useMemo(() => {
    if (detailData?.requestParams) {
      return Object.values(detailData.requestParams).findIndex((ele: any) => ele.length === 0) !== -1;
    } else {
      return false;
    }
  }, [detailData]);

  const balanceHealth = useMemo(() => {
    if (!detailData) return true;
    const symbol = detailData.tokeninfo.symbol.toLowerCase();
    const amount = $shiftedByFixed(detailData.price, -1 * detailData.tokeninfo.decimals, 5);
    return $BigNumber(balance?.[symbol] || 0).gte(amount);
  }, [detailData, balance]);

  const handleSelect = () => {
    if (!walletReady) {
      switchNetwork();
      return;
    }
    setCellModalFlag(true);
  };

  const handleSelectCell = (item: any) => {
    // console.log('----------->', item);
    // const _data = {
    //   ...item,
    //   requestParams: JSON.parse(item.requestParams)
    // };
    setDetailData(item);
    const token = new ERC20(wallet, item.denom);
    getAllowance(token, item.cellAddress, $shiftedByFixed(item.price, -1 * item.tokeninfo.decimals, 8));
  };

  const handleInputChange = (key: string, value: string) => {
    setDetailData((prevData: any) => ({
      ...prevData,
      requestParams: {
        ...prevData.requestParams,
        [key]: value
      }
    }));
  };

  const handleCall = async (isApproveAction: boolean = false) => {
    try {
      setLoading(true);

      if (!isApproveAction) {
        handResultModal({
          open: true,
          type: 'wating',
          callInfo: detailData
        });
      }

      console.log('detailData:', detailData);

      const overrides = {};
      if (detailData.denom === '0x0000000000000000000000000000000000000000') Object.assign(overrides, { value: detailData.price });

      const transaction = getCell(wallet, detailData.cellAddress).makeRequest(JSON.stringify(detailData.requestParams), overrides);

      const transactionCallabck = (_transactionState: TransactionState) => {
        if (!isApproveAction) return;
        if (_transactionState === TransactionState.PENDING) {
          handApproveResultModal({
            step: 'call',
            type: 'pending'
          });
        }
      };

      const { transactionState, hash } = await awaitTransactionMined(transaction, transactionCallabck);

      console.log('hash::', hash);
      const params = {
        onlineStatus: transactionState === TransactionState.SUCCESS ? 1 : 0,
        user: account,
        cellId: detailData.cellId,
        txhash: hash,
        params: detailData.requestParams
      };
      console.log('callCells Data:', params);
      const { code, data, error } = await Server.callCells(params);
      if (code !== 0) throw new Error(error);

      if (isApproveAction) {
        handApproveResultModal({
          open: false
        });
      }
      if (transactionState === TransactionState.SUCCESS) {
        notification.success({ message: 'Call Successfully' });
        fetchHistory();
        handHasNewHistory(true);
        setDetailData(null);
        handResultModal({
          open: true,
          type: 'success',
          hash: hash,
          callInfo: detailData
        });
      } else {
        handResultModal({
          open: true,
          type: 'fail',
          hash: hash
        });
        // throw new Error('Call Failed');
      }
    } catch (e: any) {
      notification.error({ message: e.reason || e.message || 'Call Failed' });
      handResultModal({
        open: false
        // type: 'wating',
      });
    } finally {
      setLoading(false);
      getUserBalance();
    }
  };

  const handApprove = async () => {
    try {
      handApproveResultModal({
        open: true,
        step: 'approve',
        type: 'wating',
        callInfo: detailData
      });

      await approve(10 ** 18);
      const token = new ERC20(wallet, detailData.denom);
      getAllowance(token, detailData.cellAddress, $shiftedByFixed(detailData.price, -1 * detailData.tokeninfo.decimals, 8));
      handApproveResultModal({
        step: 'call',
        type: 'wating'
      });
    } catch (e: any) {
      notification.error({ message: e.reason || e.message || 'Fail' });
      handApproveResultModal({
        step: 'approve',
        type: 'fail'
      });
    }
  };

  useEffect(() => {
    if (approveResultDialog.open && approveResultDialog.step === 'approve' && approvalState === ApprovalState.APPROVED) {
      handApproveResultModal({
        step: 'call',
        type: 'wating'
      });
      handleCall(true);
    }
  }, [approvalState, approveResultDialog]);

  useEffect(() => {
    console.log('transactionState', transactionState);
    if (transactionState === TransactionState.PENDING) {
      handApproveResultModal({
        step: 'approve',
        type: 'pending'
      });
    } else if (transactionState === TransactionState.SUCCESS) {
      handApproveResultModal({
        step: 'approve',
        type: 'success'
      });
    } else if (transactionState === TransactionState.FAIL) {
      handApproveResultModal({
        step: 'approve',
        type: 'fail'
      });
    }
  }, [transactionState]);

  useEffect(() => {
    if (account) fetchHistory();
    else reset();
  }, [account]);

  return (
    <>
      <Content>
        <Img src="/images/home/icon-1.svg" alt="" className={cn('icon', 'icon-1')} />
        <Img src="/images/home/icon-2.svg" alt="" className={cn('icon', 'icon-2')} />
        <Img src="/images/home/icon-3.svg" alt="" className={cn('icon', 'icon-3')} />
        <Img src="/images/home/icon-4.svg" alt="" className={cn('icon', 'icon-4')} />
        <Group>
          <Tit>
            <div>Call Cell</div>
            <HistoryGroup
              onClick={() => {
                handShowHistoryModal(true);
                handHasNewHistory(false);
              }}
            >
              {hasNewHistory ? <IconHistory2 /> : <IconHistory />}
            </HistoryGroup>
          </Tit>
          <SubTit>Please select an API cell and enter an instruction to call it.</SubTit>

          <Lab>Select Interface</Lab>

          <SelectView className={cn(!detailData ? 'empty' : '', detailData ? '_value' : '')} onClick={handleSelect}>
            {detailData ? (
              <SelectText>
                <SelectLfImg>
                  <Skeleton.Avatar active />
                  <Img src={detailData.logoFile} alt="" />
                </SelectLfImg>

                {detailData.name}
              </SelectText>
            ) : (
              'Please Select Interface first'
            )}
            <IconDown />
          </SelectView>

          {/* <Lab>Instructions</Lab> */}

          {!detailData ? (
            <GridGroup>
              <div>
                <Lab>Instructions</Lab>
                <TextArea disabled={!detailData} />
              </div>
            </GridGroup>
          ) : (
            <>
              {Object.keys(detailData.requestParams).length > 0 && (
                <GridGroup>
                  {Object.entries(detailData.requestParams).map(([key, value]) => (
                    <div key={key}>
                      <Lab>{key}</Lab>
                      <TextArea value={value as string} className={cn({ focusVal: value })} onChange={(e) => handleInputChange(key, e.target.value)} />
                    </div>
                  ))}
                </GridGroup>
              )}
            </>
          )}

          {detailData && !btn_disabled ? (
            <Free>
              <div>
                Fee
                <div>
                  <Img src={`/images/tokens/${detailData.tokeninfo.symbol}.png`} />
                  <span>{$shiftedBy(detailData.price, -detailData.tokeninfo.decimals)}</span>
                </div>
              </div>
              {/* <div>
                Network Cost
                <div>
                  <Img src="/images/tokens/USDT.png" alt="" />
                  <span>$1.14</span>
                </div>
              </div> */}
            </Free>
          ) : null}

          {!account ? (
            <ContentWallet className={cn('connect-wallet-btn')} onClick={() => connectWallet('m')}>
              Connect Wallet
            </ContentWallet>
          ) : (
            <>
              {!walletReady ? (
                <CallBtn
                  onClick={() => {
                    switchNetwork();
                  }}
                >
                  Connect to BNB Chain
                </CallBtn>
              ) : !detailData ? (
                <NotSelect>Select Interface</NotSelect>
              ) : !balanceHealth ? (
                <NotSelect>Insufficient balance</NotSelect>
              ) : (
                <>
                  {approvalState !== ApprovalState.APPROVED ? (
                    <CallBtn loading={approveLoading || loading} disabled={btn_disabled} onClick={() => handApprove()}>
                      Approve and Call
                    </CallBtn>
                  ) : (
                    <CallBtn loading={loading} disabled={btn_disabled} onClick={() => handleCall()}>
                      Call
                    </CallBtn>
                  )}
                </>
              )}
            </>
          )}
        </Group>
      </Content>

      <CellModal
        showCellModal={cellModalFlag}
        handleSelect={(item) => {
          handleSelectCell(item);
        }}
        handleCloseModal={(update) => {
          setCellModalFlag(false);
        }}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        handleCancelModal={(update) => {
          handShowHistoryModal(false);
        }}
      />
      <ResultModal />
      <ApproveModal />
    </>
  );
};

const Content = styled.div`
  overflow-x: hidden;
  /* overflow-y: auto; */
  padding: 0.68rem 0.12rem;
  height: 100%;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    left: 50%;
    top: calc(50% + 0.72rem);
    width: 7.9rem;
    max-width: 100%;
    height: 7.9rem;
    max-height: calc(100% - 1.92rem);
    transform: translate(-50%, -50%);
    border-radius: 7.9rem;
    background: radial-gradient(50% 50% at 50% 50%, rgba(255, 0, 245, 0.1) 0%, rgba(255, 76, 237, 0) 100%);
    filter: blur(44px);
  }

  @media screen and (max-width: 768px) {
    padding-top: 0.2rem;
    &::before {
      height: calc(100% - 1.92rem);
    }
  }
`;

const Group = styled.div`
  width: 4.62rem;
  border-radius: 0.24rem;
  border: 1px solid #f1eaf0;
  background: #fff;
  padding: 0.16rem;
  margin: 0 auto;
  max-width: 100%;
  position: relative;
  z-index: 2;
`;

const Tit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1;
  & > div {
    display: flex;
    align-items: center;
    &:nth-of-type(1) {
      font-size: 0.16rem;
      font-weight: 500;
      color: #222;
    }
    &:nth-of-type(2) {
      position: relative;
      color: #7d7d7d;
      cursor: pointer;
    }
  }
`;

const SubTit = styled.div`
  font-size: 0.12rem;
  font-weight: 400;
  line-height: 166.667%;
  color: #6f6c90;
  margin-bottom: 0.12rem;
`;

const Lab = styled.div`
  font-size: 0.14rem;
  font-weight: 500;
  line-height: 171.429%;
  margin-bottom: 0.04rem;
  color: #7d7d7d;
  height: 0.24rem;
  display: flex;
  align-items: center;
`;

const SelectView = styled.div`
  width: 100%;
  height: 0.48rem;
  border-radius: 0.12rem;
  border: 1px solid #e6e6e6;
  background: #fff;
  box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.03);
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 0.16rem;
  padding: 0 0.16rem;
  font-size: 0.16rem;
  font-weight: 500;
  transition: all 0.2s;
  & > svg {
    width: 0.16rem;
    height: 0.16rem;
    position: absolute;
    right: 0.16rem;
    top: 50%;
    color: #a4aebc;
    transform: translateY(-50%);
  }

  &.empty {
    background: #fc72ff;
    box-shadow: none;
    color: #fff;
    border-color: #fc72ff;
    transition: all 0.2s;
    &:hover {
      background: #fa59ff;
    }
    & > svg {
      color: #fff;
    }
  }
  &._value {
    transition: all 0.2s;
    &:hover {
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%), #fff;
    }
  }
`;

const SelectText = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.14rem;
  font-weight: 500;
  line-height: 1;
  color: #170f49;

  img {
    display: block;
    width: 0.18rem;
    height: 0.18rem;
    border-radius: 50%;
    margin-right: 0.1rem;
  }
`;

const TextArea = styled(Input.TextArea)`
  max-height: 1.2rem !important;
  min-height: 0.56rem !important;
  border-radius: 0.12rem;
  background: #f9f9f9;
  /* padding: 0.16rem; */
  border: 1px solid #f9f9f9;
  resize: none !important;
  font-size: 0.14rem;
  font-weight: 400;
  line-height: 171.429% !important;
  color: #170f49;
  /* margin-bottom: 0.16rem; */

  &:disabled,
  &[disabled] {
    border-color: #f9f9f9;
    background-color: #f9f9f9;
    padding: 0;
    &:hover {
      border-color: #f9f9f9;
      background-color: #f9f9f9;
    }
  }

  &:hover {
    border-color: #f1eaf0;
  }

  &:focus,
  &.focusVal {
    padding: 0.16rem;
    min-height: 1.2rem !important;
  }
`;

const Free = styled.div`
  border-radius: 0.12rem;
  border: 1px solid #efefef;
  background: #fff;
  margin-bottom: 0.16rem;
  padding: 0.12rem 0.16rem;
  display: flex;
  flex-direction: column;
  gap: 0.08rem 0;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.14rem;
    font-weight: 400;
    color: #7d7d7d;
    & > div {
      display: flex;
      align-items: center;
      font-size: 0.14rem;
      font-weight: 500;
      color: #170f49;

      img {
        display: block;
        width: 0.14rem;
        height: 0.14rem;
        border-radius: 50%;
        margin-right: 0.08rem;
      }

      span {
        display: flex;
        align-items: center;
        justify-content: right;
        /* min-width: 0.4rem; */
      }
    }
  }
`;

const ContentWallet = styled(Button)`
  width: 100%;
  height: 0.56rem;
  font-size: 0.2rem;
  font-weight: 500;
  border-radius: 0.16rem;
`;

const NotSelect = styled.div`
  width: 100%;
  height: 0.56rem;
  border-radius: 0.16rem;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  color: #7d7d7d;
  font-size: 0.2rem;
  font-weight: 500;
`;

const CallBtn = styled(Button)`
  width: 100%;
  height: 0.56rem;
  border: none;
  box-shadow: none;
  border-radius: 0.16rem;
  background-color: #fc72ff;
  font-size: 0.2rem;
  font-weight: 500;
  color: #fff;
  &:hover {
    color: #fff !important;
    background-color: #fa59ff;
  }
`;

const Img = styled.img`
  &.icon {
    width: 0.44rem;
    height: 0.44rem;
    border-radius: 50%;
    position: absolute;
  }

  &.icon-1 {
    bottom: 1.7rem;
    left: 50%;
    transform: translateX(calc(-50% - 5.76rem));
  }

  &.icon-2 {
    top: 1.46rem;
    left: 50%;
    transform: translateX(calc(-50% - 4.78rem));
  }

  &.icon-3 {
    top: 1.46rem;
    left: 50%;
    transform: translateX(calc(-50% + 4.78rem));
  }

  &.icon-4 {
    bottom: 1.7rem;
    left: 50%;
    transform: translateX(calc(-50% + 5.76rem));
  }
`;

const GridGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.12rem 0.1rem;
  margin-bottom: 0.2rem;
`;

const KeyLabel = styled.div`
  font-size: 0.12rem;
  font-weight: 400;
  line-height: 66.667%;
  color: #7d7d7d;
  margin-bottom: 0.04rem;
  height: 0.2rem;
  display: flex;
  align-items: center;
`;

const InputFull = styled(Input)`
  width: 100%;
  height: 0.56rem;
  border-radius: 0.12rem;
  background: #f9f9f9;
  border: 1px solid #f9f9f9;
`;

const HistoryGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const SelectLfImg = styled.div`
  position: relative;
  margin-right: 0.1rem;
  & > div {
    width: 0.18rem !important;
    height: 0.18rem !important;
  }
  & > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.18rem;
    height: 0.18rem;
  }
`;

export default Home;
