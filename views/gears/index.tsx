// import { useWallet } from '@/hooks';
import ps from "./styles/index.module.scss";
import { useCells } from "@/state/cells/hooks";
import { useEffect, useState } from "react";
import { IconAdd, IconSee } from "@/components/Icon";
import cn from "classnames";
import TooltipLine from "@/components/TooltipLine";
import { Button, ConfigProvider, Skeleton, notification, theme } from "antd";
import { Copy } from "@/components";
import { $BigNumber, $copy, $hash, $shiftedByFixed } from "@/utils/met";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useWorkspaceGear } from "@/hooks";

const Cells: React.FC = () => {
  const { wallet, connected } = useWallet();
  const [list, fetchCells, update, reset, loading] = useCells();
  const router = useRouter();
  const workspace = useWorkspaceGear();

  const [isExpanded, setIsExpanded] = useState<any[]>([]);
  const [claimLoading, setClaimLoading] = useState<any[]>([]);

  const claim = async (data: { [key: string]: any }, index: number) => {
    try {
      setClaimLoading((prevState) => [...prevState, index]);
      const tx = await workspace?.program.claim(data.gearAddress);
      await update(data);
      message: notification.success({
        message: "Claim Successfully"
      });
    } catch (e: any) {
      notification.error({
        message: "Claim Failed"
      });
    } finally {
      setClaimLoading((prevState) => prevState.filter((i) => i !== index));
    }
  };

  useEffect(() => {
    if (connected) fetchCells();
    else reset();
  }, [connected, wallet]);

  return (
    <div className={ps.full}>
      <div className={ps.container}>
        <div className={ps.tit}>
          <div>
            Interface gear <span>({list.length})</span>
          </div>

          {!loading && list.length > 0 && (
            <div
              className={ps["rt-create"]}
              onClick={() => {
                router.push("/create");
              }}
            >
              <IconAdd /> Create
            </div>
          )}
        </div>

        <div className={ps.group}>
          {loading && list.length === 0 && (
            <>
              {new Array(9).fill(0).map((ele, index) => (
                <section key={index} className={cn(ps.item, ps["load-item"])}>
                  <div>
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

                    <ConfigProvider
                      theme={{
                        algorithm: theme.darkAlgorithm
                      }}
                    >
                      <Skeleton.Input active block />
                    </ConfigProvider>

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
          )}
          {!loading && list.length === 0 && (
            <section
              className={cn(ps.create, ps.item)}
              onClick={() => {
                router.push("/create");
              }}
            >
              <div>
                <div>
                  <IconAdd />
                  Create
                </div>
              </div>
            </section>
          )}

          {list.map((ele, index) => (
            <section key={ele.gearId} className={cn(ps.item, { [ps["item-flipped"]]: isExpanded.includes(index) })}>
              <div
                className={ps["flipped-icon"]}
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
                <img src="/images/other/5.svg" alt="" />
              </div>

              <div className={ps["item-front"]}>
                <div className={ps["item-name"]}>
                  <div>
                    <img src={ele.image} alt="" />
                    <div>
                      <div>{ele.name}</div>
                      <div>
                        <span
                          onClick={() => {
                            if (typeof window === "undefined") return;
                            window.open(ele.gear_nft);
                          }}
                        >
                          {$hash(ele.gearAddress, 4, 4)}
                        </span>

                        <Copy
                          className="copy"
                          copy={() => {
                            $copy(ele.gearAddress);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={ps.des}>
                  <TooltipLine name={ele.description} index={index} length={null} clamp="2" placement="top" />
                </div>

                <div className={ps.reward}>
                  Reward
                  <div>
                    <img src="/images/tokens/SOL.png" alt="" />
                    {$shiftedByFixed(ele.reward, 1, 4)} SOL
                  </div>
                </div>

                <Button block className={ps["claim-btn"]} disabled={$BigNumber(ele.reward).lte(0)} loading={claimLoading.includes(index)} onClick={() => claim(ele, index)}>
                  Claim
                </Button>
              </div>

              <div className={ps["item-back"]}>
                <div className={ps.info}>
                  <div>
                    Fee
                    <div>
                      <img src="/images/tokens/SOL.png" alt="" />
                      {ele.price}
                    </div>
                  </div>

                  {/* <div>
                    Network Cost
                    <div>
                      <img src="/images/tokens/SOL.png" alt="" />
                      $0.14
                    </div>
                  </div> */}

                  <div>
                    gear nft
                    <div>
                      {$hash(ele.gear_nft)}
                      <IconSee className={ps["see"]} />
                    </div>
                  </div>

                  <div>
                    Arweave Storage
                    <div>
                      {$hash(ele.arweave_storage)}
                      <IconSee className={ps["see"]} />
                      {/* <Copy
                        className="copy"
                        copy={() => {
                          $copy(ele.arweave_storage);
                        }}
                      /> */}
                    </div>
                  </div>

                  <div>
                    Time
                    <div>2024-01-26</div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cells;
