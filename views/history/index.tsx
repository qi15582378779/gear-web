import cn from 'classnames';
import ps from './styles/index.module.scss';
import TooltipLine from '@/components/TooltipLine';
import { Copy } from '@/components';
import { $copy, $hash, $shiftedBy } from '@/utils/met';
import { useState } from 'react';
import { useHistory } from '@/state/call/hooks';
// import { useWallet } from '@/hooks';
import moment from 'moment';
import { ConfigProvider, Skeleton, theme } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

const History: React.FC = () => {
  const { connected } = useWallet();
  const [open, setOpen] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const [{ historyList, listLoad }] = useHistory();

  return (
    <div className={ps.full}>
      <div className={ps.container}>
        <div className={ps.tit}>Calls History</div>

        <div className={ps.group}>
          {connected && (
            <>
              {listLoad && historyList.length <= 0 ? (
                <>
                  {Array.from({ length: 5 }, (_, index) => (
                    <section className={cn(ps.item, ps['load-item'])} key={index}>
                      <div className={ps['data-item']}>
                        <div>
                          <ConfigProvider
                            theme={{
                              algorithm: theme.darkAlgorithm
                            }}
                          >
                            <Skeleton.Image active />
                          </ConfigProvider>
                          <div>
                            <ConfigProvider
                              theme={{
                                algorithm: theme.darkAlgorithm
                              }}
                            >
                              <Skeleton.Input active block />
                              <Skeleton.Input active block />
                            </ConfigProvider>
                          </div>
                        </div>

                        <div>
                          <div>
                            <ConfigProvider
                              theme={{
                                algorithm: theme.darkAlgorithm
                              }}
                            >
                              <Skeleton.Input active block />
                              <Skeleton.Input active block />
                            </ConfigProvider>
                          </div>

                          <div>
                            <ConfigProvider
                              theme={{
                                algorithm: theme.darkAlgorithm
                              }}
                            >
                              <Skeleton.Input active block />
                              <Skeleton.Input active block />
                            </ConfigProvider>
                          </div>

                          <div>
                            <ConfigProvider
                              theme={{
                                algorithm: theme.darkAlgorithm
                              }}
                            >
                              <Skeleton.Input active block />
                            </ConfigProvider>
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </>
              ) : (
                <>
                  {historyList.map((item, index) => (
                    <div className={cn(ps.item, { [ps['open-item']]: open && openIndex === index })} key={index}>
                      <section className={ps['data-item']}>
                        <div className={ps['item-top']}>
                          <div className={ps['top-lf']}>
                            <div className={ps['lf-img']}>
                              <img src={item.info?.logoFile} alt="" />
                            </div>
                            <div className={ps['lf-txt']}>
                              <div>{item.info?.name}</div>
                              <div>
                                <TooltipLine name={item.info?.description} />
                              </div>
                            </div>
                          </div>
                          <div className={ps['top-rt']}>
                            <div>
                              <div>Time</div>
                              <div>{moment(new Date(item.created_at).getTime()).utc().format('YYYY-MM-DD')}</div>
                            </div>
                            <div>
                              <div>Status</div>
                              <div className={ps[item.onlineStatus === 1 ? 'icon-success' : 'icon-error']}>
                                {item.onlineStatus === 1 ? (
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
                            </div>
                            <div
                              onClick={() => {
                                setOpen(!open);
                                setOpenIndex(index);
                              }}
                            >
                              <img src="/images/other/3.svg" alt="" />
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className={ps['more-item']}>
                        <div>
                          <div className={ps['card-1']}>
                            <div>
                              Instructions
                              <div>
                                <Copy
                                  className="copy"
                                  copy={() => {
                                    $copy(JSON.stringify(item.params));
                                  }}
                                />
                              </div>
                            </div>

                            <div>{JSON.stringify(item.params)}</div>
                          </div>

                          <div className={ps['card-2']}>
                            <div>
                              Output:
                              <div>
                                <Copy
                                  className="copy"
                                  copy={() => {
                                    $copy(typeof item.result === 'string' ? item.result : JSON.stringify(item.result));
                                  }}
                                />
                              </div>
                            </div>
                            <div>{typeof item.result === 'string' ? item.result : JSON.stringify(item.result)}</div>
                          </div>

                          <div className={ps['card-3']}>
                            <div>
                              Price
                              <div>
                                <img src={`/images/tokens/${item.info?.tokeninfo.symbol}.png`} alt="" />
                                <span>${$shiftedBy(item.info?.price, -1 * item.info?.tokeninfo.decimals)}</span>/Call
                              </div>
                            </div>

                            <div>
                              Fee
                              <div>
                                <img src={`/images/tokens/${item.info?.tokeninfo.symbol}.png`} alt="" />
                                <span>${$shiftedBy(item.info?.price, -1 * item.info?.tokeninfo.decimals)}</span>
                              </div>
                            </div>

                            <div>
                              Network Cost
                              <div>
                                <img src={`/images/tokens/${item.info?.tokeninfo.symbol}.png`} alt="" />
                                <span>$0.142472</span>
                              </div>
                            </div>

                            <div>
                              Call Txn
                              <div>
                                {$hash(item.info?.txhash, 6, 8)}
                                <Copy
                                  className="copy"
                                  copy={() => {
                                    $copy(item.info?.txhash);
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              Purchase Txn
                              <div>
                                {$hash(item.txhash, 6, 8)}
                                <Copy
                                  className="copy"
                                  copy={() => {
                                    $copy(item.txhash);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {!listLoad && historyList.length === 0 ? (
          <div className={ps.empty}>
            <div>
              <img src="/images/other/empty.svg" alt="" />
              No history
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default History;
