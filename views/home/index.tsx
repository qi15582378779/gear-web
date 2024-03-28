import { IconSearch } from "@/components/Icon";
import cn from "classnames";
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from "react";

import { Button, ConfigProvider, Input, Skeleton, notification, theme } from "antd";
import HistoryModal from "./components/history-modal";
// import { useApproveByToken, useTransactionMined, useWallet } from '@/hooks';
import { useConnectWallet } from "@/state/chain/hooks";
import { $BigNumber, $copy, $hash, $shiftedBy, $shiftedByFixed, $sleep } from "@/utils/met";
import { getCell, ERC20 } from "@/sdk";

import Server from "@/service";
import { ApprovalState, TransactionState } from "@/typings";
import { useApproveDialog, useHasNewHistory, useHistory, useHistoryDialog, useResultModal } from "@/state/call/hooks";
import ResultModal from "./ResultModal";
import ApproveModal from "./ApproveModal";
import { useUserBalance } from "@/state/base/hooks";
import { useWallet } from "@solana/wallet-adapter-react";

import ps from "./styles/index.module.scss";
import TooltipLine from "@/components/TooltipLine";
import { Copy } from "@/components";
import { useScan, useWorkspaceGear } from "@/hooks";

const { TextArea } = Input;

const Home: FC = (): ReactElement => {
  const workspace = useWorkspaceGear();

  const [, connectWallet] = useConnectWallet();
  const [history, { fetchHistory, reset }] = useHistory();
  const { wallet, publicKey, connected } = useWallet();
  const { openGreenfieldScan } = useScan();
  // const { account, wallet, walletReady, switchNetwork, openGreenfieldScan } = useWallet();
  const [balance, getUserBalance] = useUserBalance();

  // const [{ approvalState, transactionState }, { approve, getAllowance }, approveLoading] = useApproveByToken();
  // const [, { awaitTransactionMined }] = useTransactionMined();
  const [showHistoryModal, handShowHistoryModal] = useHistoryDialog();
  const [approveResultDialog, handApproveResultModal] = useApproveDialog();

  const [, handResultModal] = useResultModal();
  const [hasNewHistory, handHasNewHistory] = useHasNewHistory();

  const [detailData, setDetailData] = useState<any>(null);
  const [cellModalFlag, setCellModalFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<any[]>([]);

  const [cellList, setCellList] = useState<any[]>([]);
  const [cellLoad, setCellLoad] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState(Array(cellList.length).fill(false));

  const params = useRef({
    text: ""
  });

  const hangSearch = (value: string) => {
    setSearch(value);
  };

  const getCellList = () => {
    setCellLoad(true);
    Server.fetchGears({ ...params.current })
      .then((res) => {
        console.log("res---->", res);
        if (res.code === 0) {
          setCellList(res.data);
        }
      })
      .catch((e) => {
        console.log("error--->", e);
        notification.error({ message: e.error || e.message });
      })
      .finally(() => {
        setCellLoad(false);
      });
  };

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
    // getAllowance(token, item.cellAddress, $shiftedByFixed(item.price, -1 * item.tokeninfo.decimals, 8));
  };

  const handleInputChange = (itemIndex: number, key: string, value: string) => {
    const updatedData = [...cellList];

    updatedData[itemIndex].requestParams = {
      ...updatedData[itemIndex].requestParams,
      [key]: value
    };

    setCellList(updatedData);
  };

  const handleCall = async (isApproveAction: boolean = false) => {
    try {
      const tx = await workspace?.program.callGear("4tF4xZY6ppTKcrgnaCTpeQ8wQjbQep4V8vdpnBmVp5fo");
      console.log("tx", tx);
      return;
      setLoading(true);

      if (!isApproveAction) {
        handResultModal({
          open: true,
          type: "wating",
          callInfo: detailData
        });
      }

      console.log("detailData:", detailData);

      const overrides = {};
      if (detailData.denom === "0x0000000000000000000000000000000000000000") Object.assign(overrides, { value: detailData.price });

      const transaction = getCell(wallet, detailData.cellAddress).makeRequest(JSON.stringify(detailData.requestParams), overrides);

      const transactionCallabck = (_transactionState: TransactionState) => {
        if (!isApproveAction) return;
        if (_transactionState === TransactionState.PENDING) {
          handApproveResultModal({
            step: "call",
            type: "pending"
          });
        }
      };

      // const { transactionState, hash } = await awaitTransactionMined(transaction, transactionCallabck);

      // console.log('hash::', hash);
      // const params = {
      //   onlineStatus: transactionState === TransactionState.SUCCESS ? 1 : 0,
      //   user: publicKey.toBase58(),
      //   cellId: detailData.cellId,
      //   txhash: hash,
      //   params: detailData.requestParams
      // };
      // console.log('callCells Data:', params);
      // const { code, data, error } = await Server.callCells(params);
      // if (code !== 0) throw new Error(error);

      // if (isApproveAction) {
      //   handApproveResultModal({
      //     open: false
      //   });
      // }
      // if (transactionState === TransactionState.SUCCESS) {
      //   notification.success({ message: 'Call Successfully' });
      //   fetchHistory();
      //   handHasNewHistory(true);
      //   setDetailData(null);
      //   handResultModal({
      //     open: true,
      //     type: 'success',
      //     hash: hash,
      //     callInfo: detailData
      //   });
      // } else {
      //   handResultModal({
      //     open: true,
      //     type: 'fail',
      //     hash: hash
      //   });
      // }
    } catch (e: any) {
      notification.error({ message: e.reason || e.message || "Call Failed" });
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
        step: "approve",
        type: "wating",
        callInfo: detailData
      });

      // await approve(10 ** 18);
      // const token = new ERC20(wallet, detailData.denom);
      // getAllowance(token, detailData.cellAddress, $shiftedByFixed(detailData.price, -1 * detailData.tokeninfo.decimals, 8));
      handApproveResultModal({
        step: "call",
        type: "wating"
      });
    } catch (e: any) {
      notification.error({ message: e.reason || e.message || "Fail" });
      handApproveResultModal({
        step: "approve",
        type: "fail"
      });
    }
  };

  // useEffect(() => {
  //   if (approveResultDialog.open && approveResultDialog.step === 'approve' && approvalState === ApprovalState.APPROVED) {
  //     handApproveResultModal({
  //       step: 'call',
  //       type: 'wating'
  //     });
  //     handleCall(true);
  //   }
  // }, [approvalState, approveResultDialog]);

  // useEffect(() => {
  //   console.log('transactionState', transactionState);
  //   if (transactionState === TransactionState.PENDING) {
  //     handApproveResultModal({
  //       step: 'approve',
  //       type: 'pending'
  //     });
  //   } else if (transactionState === TransactionState.SUCCESS) {
  //     handApproveResultModal({
  //       step: 'approve',
  //       type: 'success'
  //     });
  //   } else if (transactionState === TransactionState.FAIL) {
  //     handApproveResultModal({
  //       step: 'approve',
  //       type: 'fail'
  //     });
  //   }
  // }, [transactionState]);

  useEffect(() => {
    if (connected) fetchHistory();
    else reset();
  }, [connected]);

  useEffect(() => {
    getCellList();
  }, []);

  return (
    <>
      <div className={ps.full}>
        <div className={ps.container}>
          <div className={ps.tit}>Call Gear</div>
          <Input className={ps.search} value={search} prefix={<IconSearch />} placeholder="Search name or paste address" onChange={(e: any) => hangSearch(e.target.value)} />
          <div className={ps.group}>
            {cellLoad ? (
              <>
                {Array.from({ length: 5 }, (_, index) => (
                  <section className={cn(ps.item, ps["load-item"])} key={index}>
                    <div className={ps["data-item"]}>
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

                      <ConfigProvider
                        theme={{
                          algorithm: theme.darkAlgorithm
                        }}
                      >
                        <Skeleton.Input active block />
                      </ConfigProvider>
                    </div>
                  </section>
                ))}
              </>
            ) : (
              <>
                {cellList.map((item, index) => (
                  <div className={cn(ps.item, { [ps["open-item"]]: isExpanded.includes(index) })} key={`${item._id}-${index}`}>
                    <section className={ps["data-item"]}>
                      <div className={ps["item-top"]}>
                        <div>
                          <div className={ps["top-img"]}>
                            <ConfigProvider
                              theme={{
                                algorithm: theme.darkAlgorithm
                              }}
                            >
                              <Skeleton.Image active />
                            </ConfigProvider>
                            <img src={item.logoFile} alt="" />
                          </div>

                          <div>
                            <div className={ps["top-tit"]}>{item.name}</div>
                            <TooltipLine name={item.description} index={index} length={null} clamp="2" />
                          </div>
                        </div>
                        <div className={ps["top-rt"]}>
                          <img src={`/images/tokens/${item.tokeninfo.symbol}.png`} alt="" />

                          <div>
                            <span>${$shiftedBy(item.price, -item.tokeninfo.decimals)}</span>/Call
                          </div>

                          <div
                            onClick={() => {
                              setIsExpanded((prevState) => {
                                if (prevState.includes(index)) {
                                  return prevState.filter((i) => i !== index);
                                } else {
                                  return [...prevState, index];
                                }
                              });
                            }}
                          >
                            <img src="/images/other/3.svg" alt="" />
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className={ps["more-item"]}>
                      <div>
                        <div className={ps["more-top"]}>
                          <div>
                            <div>Price</div>
                            <div>
                              <img src={`/images/tokens/${item.tokeninfo.symbol}.png`} alt="" />
                              <span>${$shiftedBy(item.price, -item.tokeninfo.decimals)}</span>/Call
                            </div>
                          </div>
                          <div>
                            <div>URL</div>
                            <div>{$hash(item.encryptURL, 15, 15)}</div>
                          </div>
                          <div>
                            <div>Storage</div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                openGreenfieldScan(item.metadataObjectId, "object");
                              }}
                            >
                              Txn Hash: {$hash(item.metadataObjectId)}{" "}
                              <Copy
                                className="copy"
                                copy={() => {
                                  $copy(item.metadataObjectId);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <>
                          {Object.keys(item.requestParams).length > 0 && (
                            <>
                              {Object.entries(item.requestParams).map(([key, value]) => (
                                <div className={ps["more-list"]} key={key}>
                                  <div className={ps["list-lab"]}>{key}</div>
                                  <TextArea className={ps["list-input"]} value={value as string} autoSize={{ minRows: 1, maxRows: 3 }} onChange={(e) => handleInputChange(index, key, e.target.value)} />
                                </div>
                              ))}
                            </>
                          )}
                        </>

                        {!btn_disabled ? (
                          <div className={ps["list-fee"]}>
                            <div>
                              <div>fee</div>
                              <div>
                                <img src={`/images/tokens/${item.tokeninfo.symbol}.png`} alt="" /> ${$shiftedBy(item.price, -item.tokeninfo.decimals)}
                              </div>
                            </div>

                            <div>
                              <div>Network Cost</div>
                              <div>
                                <img src="/images/tokens/USDC.png" alt="" /> $1.14
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {!connected ? (
                          <Button className={ps["btn"]}>Connect Wallet</Button>
                        ) : (
                          <>
                            {!balanceHealth ? (
                              <Button className={ps["btn"]} disabled>
                                Insufficient balance
                              </Button>
                            ) : (
                              <>
                                {/* {approvalState !== ApprovalState.APPROVED ? (
                                  <Button className={ps['btn']} loading={approveLoading || loadingStates[index]} disabled={Object.values(cellList[index].requestParams).findIndex((ele: any) => ele.length === 0) !== -1} onClick={() => handApprove()}>
                                    Approve and Call
                                  </Button>
                                ) : ( */}
                                <Button className={ps["btn"]} loading={loadingStates[index]} disabled={Object.values(cellList[index].requestParams).findIndex((ele: any) => ele.length === 0) !== -1} onClick={() => handleCall()}>
                                  Call
                                </Button>
                                {/* )} */}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </section>
                  </div>
                ))}
              </>
            )}
            <></>
          </div>
        </div>
      </div>

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

export default Home;
