import { IconClose, IconSearch } from "@/components/Icon";
import cn from "classnames";
import { FC, ReactElement, useEffect, useRef, useState } from "react";

import { Button, ConfigProvider, Input, Skeleton, notification, theme } from "antd";
import { $BigNumber, $copy, $hash } from "@/utils/met";
import Server from "@/service";
import { useResultModal } from "@/state/call/hooks";
import ResultModal from "./ResultModal";
import { useUserBalance } from "@/state/base/hooks";
import { useWallet } from "@solana/wallet-adapter-react";

import ps from "./styles/index.module.scss";
import TooltipLine from "@/components/TooltipLine";
import { Copy } from "@/components";
import { useDebounce, useScan, useWorkspaceGear } from "@/hooks";
import Empty from "@/components/Empty";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const { TextArea } = Input;

const Home: FC = (): ReactElement => {
  const workspace = useWorkspaceGear();
  const [debounce] = useDebounce(1000);

  const { publicKey, connected } = useWallet();
  const { openGreenfieldScan } = useScan();
  const [balance, getUserBalance] = useUserBalance();

  const [, handResultModal] = useResultModal();
  const [search, setSearch] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<any[]>([]);

  const [cellList, setCellList] = useState<any[]>([]);
  const [cellLoad, setCellLoad] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState(Array(cellList.length).fill(false));

  const params = useRef({
    text: ""
  });

  const textareaRefs = useRef<any>([]);

  const hangSearch = (value: string) => {
    setSearch(value);
    params.current.text = value;
    debounce(() => getCellList());
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

  const handleInputChange = (itemIndex: number, key: string, value: string) => {
    const updatedData = [...cellList];

    updatedData[itemIndex].requestParams = {
      ...updatedData[itemIndex].requestParams,
      [key]: value
    };

    setCellList(updatedData);
  };

  const handleFocusClick = (index: number, item: any) => {
    if (textareaRefs.current) {
      textareaRefs.current[index + item.gearId]?.focus();
    }
  };

  const handleCall = async (item: any, index: number) => {
    try {
      // setLoading(true);
      const newLoadingStates = [...loadingStates];
      newLoadingStates[index] = true;
      setLoadingStates(newLoadingStates);

      handResultModal({
        open: true,
        type: "wating",
        callInfo: item
      });

      // return;

      const tx = await workspace?.program.callGear(item.gearAddress);

      const params = {
        onlineStatus: 1,
        user: publicKey!.toBase58(),
        gearId: item.gearId,
        txhash: tx,
        params: item.requestParams
      };

      const { code, data, error } = await Server.callGears(params);
      console.log("data--->", data);
      if (code !== 0) throw new Error(error);

      handResultModal({
        open: true,
        type: "success",
        hash: tx,
        callInfo: item
      });
    } catch (e: any) {
      notification.error({ message: e.reason || e.message || "Call Failed" });
      handResultModal({
        open: false
        // type: 'wating',
      });
    } finally {
      // setLoading(false);
      const newLoadingStates = [...loadingStates];
      newLoadingStates[index] = false;
      setLoadingStates(newLoadingStates);

      getUserBalance();
    }
  };

  // useEffect(() => {
  //   if (connected) fetchHistory();
  //   else reset();
  // }, [connected]);

  useEffect(() => {
    getCellList();
  }, []);

  return (
    <>
      <div className={ps.full}>
        <div className={ps.container}>
          <div className={ps.tit}>Call Gear</div>
          <Input className={ps.search} value={search} prefix={<IconSearch />} placeholder="Search name or paste address" allowClear={{ clearIcon: <IconClose className={ps.clear} /> }} onChange={(e: any) => hangSearch(e.target.value)} />
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
                          <img src={`/images/tokens/${item.symbol}.png`} alt="" />

                          <div>
                            <span>{item.price}</span>/Call
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
                              <img src={`/images/tokens/${item.symbol}.png`} alt="" />
                              <span>${item.price}</span>/Call
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
                              <span>{$hash(item.metadataObjectId)}</span>
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
                              {Object.entries(item.requestParams).map(([key, value], i) => (
                                <div className={ps["more-list"]} key={key} onClick={() => handleFocusClick(i, item)}>
                                  <div className={ps["list-lab"]}>
                                    {key} === {i}
                                  </div>
                                  <TextArea ref={(ref) => (textareaRefs.current[i + item.gearId] = ref)} className={ps["list-input"]} value={value as string} autoSize={{ minRows: 1, maxRows: 3 }} onChange={(e) => handleInputChange(index, key, e.target.value)} />
                                </div>
                              ))}
                            </>
                          )}
                        </>

                        {!(Object.values(cellList[index].requestParams).findIndex((ele: any) => ele.length === 0) !== -1) ? (
                          <div className={ps["list-fee"]}>
                            <div>
                              <div>fee</div>
                              <div>
                                <img src={`/images/tokens/${item.symbol}.png`} alt="" /> ${item.price}
                              </div>
                            </div>

                            {/* <div>
                              <div>Network Cost</div>
                              <div>
                                <img src="/images/tokens/USDC.png" alt="" /> $1.14
                              </div>
                            </div> */}
                          </div>
                        ) : null}

                        {!connected ? (
                          // <Button className={ps["btn"]}>Connect Wallet</Button>
                          <WalletMultiButton>Connect Wallet</WalletMultiButton>
                        ) : (
                          <>
                            {!$BigNumber(balance?.[item.symbol.toLowerCase()] || 0).gte(item.price) ? (
                              <Button className={ps["btn"]} disabled>
                                Insufficient balance
                              </Button>
                            ) : (
                              <Button className={ps["btn"]} loading={loadingStates[index]} disabled={Object.values(cellList[index].requestParams).findIndex((ele: any) => ele.length === 0) !== -1} onClick={() => handleCall(item, index)}>
                                Call
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </section>
                  </div>
                ))}
              </>
            )}
            <>{!cellLoad && cellList.length <= 0 ? <Empty text="Nothing" /> : null}</>
          </div>
        </div>
      </div>

      <ResultModal />
    </>
  );
};

export default Home;
