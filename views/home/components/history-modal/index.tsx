import { Collapse, Modal, Skeleton } from 'antd';
import ps from './index.module.scss';
import { IconClose, IconCopy, IconDown, IconShow, IconSuccess } from '@/components/Icon';
import styled from 'styled-components';
import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { useHistory } from '@/state/call/hooks';
import { $copy, $hash, $shiftedBy, $shiftedByFixed, $sleep } from '@/utils/met';
import moment from 'moment';
import { useScan } from '@/hooks';
import cn from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';

type IProps = {
  data: Record<string, any>;
};
const HtmlRef: FC<IProps> = ({ data }): ReactElement => {
  const outputRef = useRef<any>(null);
  const { openscan } = useScan();
  const [show, setShow] = useState(false);
  const [showTipIcon, setShowTipIcon] = useState(false);

  const getOutputResult = async () => {
    await $sleep(300);
    setShowTipIcon(outputRef.current.offsetHeight >= 60);
  };
  useEffect(() => {
    getOutputResult();
  }, []);

  return (
    <div className={ps['group-content']}>
      <div className={ps['label-txt']}>Instructions</div>
      <div className={ps['value-txt']}>{JSON.stringify(data.params)} </div>

      <div className={ps['label-txt']}>Output:</div>
      <div className={cn(ps['value-txt'], show ? '' : ps['hidden'])}>
        <div ref={outputRef}>{typeof data.result === 'string' ? data.result : JSON.stringify(data.result)}</div>
        {showTipIcon && <IconShow onClick={() => setShow(!show)} />}
      </div>

      <div className={ps['info-group']}>
        <div>
          Fee
          <div className={ps['num-txt']}>
            <img src={`/images/tokens/${data.info?.tokeninfo.symbol}.png`} alt="" />
            {$shiftedBy(data.info?.price, -1 * data.info?.tokeninfo.decimals)}
          </div>
        </div>

        {/* <div>
          Network Cost
          <div className={ps['num-txt']}>
            <img src="/images/tokens/USDT.png" alt="" />
            $0.14
          </div>
        </div> */}

        <div>
          Call Txn
          <div className={ps['txn-txt']} onClick={() => openscan(data.info.txhash, 'tx')}>
            {$hash(data.info?.txhash, 6, 8)}{' '}
            <IconCopy
              onClick={(e) => {
                e.stopPropagation();
                $copy(data.info.txhash);
              }}
            />
          </div>
        </div>

        <div>
          Purchase Txn
          <div className={ps['txn-txt']} onClick={() => openscan(data.txhash, 'tx')}>
            {$hash(data.txhash, 6, 8)}
            <IconCopy
              onClick={(e) => {
                e.stopPropagation();
                $copy(data.txhash);
              }}
            />
          </div>
        </div>

        <div>
          Time
          <div className={ps['time-txt']}>{moment(new Date(data.created_at).getTime()).utc().format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
    </div>
  );
};

const HistoryModal: React.FC<{ isOpen: boolean; handleCancelModal: (update: boolean) => void }> = ({ isOpen, handleCancelModal }) => {
  const [{ historyList, listLoad }] = useHistory();
  const { connected } = useWallet();
  const [list, setList] = useState<any[]>([]);

  //   const Labs = [
  //     {
  //       key: 1,
  //       label: (
  //         <div className={ps['coll-tit']}>
  //           <div>
  //             <div>
  //               <img src="/images/other/metamask.svg" alt="" />
  //               MetaMask
  //             </div>

  //             <div>
  //               <img src="/images/tokens/USDT.png" alt="" />
  //               $0.14/ <span>Call</span>
  //             </div>
  //           </div>

  //           <div>
  //             <div className={ps['icon-success']}>
  //               <img src="/images/home/icon-5.svg" alt="" />
  //               successful
  //             </div>

  //             <div>
  //               <IconDown />
  //             </div>
  //           </div>
  //         </div>
  //       ),
  //       children: <HtmlRef />,
  //       showArrow: false
  //     }
  //   ];

  useEffect(() => {
    if (historyList.length === 0) {
      setList([]);
    } else {
      let i = 0,
        _list = [];
      for (i; i < historyList.length; i++) {
        _list.push({
          key: i,
          label: (
            <div className={ps['coll-tit']}>
              <div>
                <div>
                  <img src={historyList[i].info?.logoFile} alt="" />
                  {historyList[i].info?.name}
                </div>

                <div>
                  <img src={`/images/tokens/${historyList[i].info?.tokeninfo.symbol}.png`} alt="" />
                  {$shiftedBy(historyList[i].info?.price, -1 * historyList[i].info?.tokeninfo.decimals)}/ <span>Call</span>
                </div>
              </div>

              <div>
                <div className={ps[historyList[i].onlineStatus === 1 ? 'icon-success' : 'icon-error']}>
                  {historyList[i].onlineStatus === 1 ? (
                    <>
                      <img src="/images/home/icon-5.svg" alt="" />
                      successful
                    </>
                  ) : (
                    <>
                      <img src="/images/home/icon-6.svg" alt="" />
                      Failed
                    </>
                  )}
                </div>

                <div className="down_icon">
                  <IconDown />
                </div>
              </div>
            </div>
          ),
          children: <HtmlRef data={historyList[i]} />,
          showArrow: false
        });
      }
      setList(_list);
    }
  }, [historyList]);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <Modals title={null} footer={null} open={isOpen}>
      <div className={ps['head']}>
        Calls History
        <IconClose onClick={() => handleCancelModal(false)} />
      </div>

      {connected && (
        <>
          {listLoad && historyList.length === 0 ? (
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
            historyList.length > 0 && <CollapseGroup bordered={false} defaultActiveKey={[]} items={list} onChange={onChange} />
          )}
        </>
      )}

      {!listLoad && historyList.length === 0 ? (
        <EmptyGroup>
          <div>
            <img src="/images/home/icon-9.svg" alt="" />
            <div>No history</div>
          </div>
        </EmptyGroup>
      ) : null}
    </Modals>
  );
};

const Modals = styled(Modal)`
  && {
    &.ant-modal {
      width: 4.18rem !important;
      /* max-height: 70vh; */
      overflow-y: auto;
    }
    .ant-modal-content {
      background: #fff;
      padding: 0.14rem 0;
      min-height: 5.56rem;
      border-radius: 0.24rem;
      border: 1px solid #e9eaf7;
      box-shadow: 0px 5px 16px 0px rgba(8, 15, 52, 0.06);
      /* max-height: 75vh;
      overflow-y: auto; */
    }
  }
`;

const CollapseGroup = styled(Collapse)`
  && {
    border-radius: 0;
    padding: 0 0.2rem;
    background-color: transparent;
    min-height: 5rem;
    max-height: 5rem;
    overflow-y: auto;
    .ant-collapse-item {
      margin-bottom: 0.16rem;
      border-radius: 0.12rem;
      border: 1px solid #e9eaf7;
      background: #fff;
    }

    .ant-collapse-header {
      padding: 0;
    }
  }
`;

const LoadItem = styled.div`
  padding: 0 0.2rem;
  height: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
          width: 0.24rem;
          margin-right: 0.1rem;
        }

        &:nth-of-type(2) {
          width: 0.6rem;
        }
      }
    }

    &:nth-of-type(2) {
      width: 1.1rem;
      height: 0.24rem;
      & > span {
        width: 100% !important;
        height: 100% !important;
        min-width: auto !important;
        border-radius: 0.16rem !important;
      }
    }
  }
`;

const EmptyGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0 0.9rem;
  text-align: center;
  & > div {
    img {
      display: block;
      width: 1.28rem;
    }
    font-size: 0.16rem;
    font-weight: 500;
    color: #222;
  }
`;

export default HistoryModal;
