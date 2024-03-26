// import { useWallet } from '@/hooks';
import ps from './styles/index.module.scss';
import { useCells, useIsCreate } from '@/state/cells/hooks';
import { useEffect, useState } from 'react';
import { IconAdd } from '@/components/Icon';
import cn from 'classnames';
import TooltipLine from '@/components/TooltipLine';
import { Button, ConfigProvider, Skeleton, theme } from 'antd';
import { Copy } from '@/components';
import { $copy } from '@/utils/met';
import { useWallet } from '@solana/wallet-adapter-react';

const Cells: React.FC = () => {
  const { wallet, publicKey, connected } = useWallet();
  const [list, fetchCells, , reset, loading] = useCells();
  const [isCreate, setIsCreate] = useIsCreate();

  const [isExpanded, setIsExpanded] = useState<any[]>([]);

  useEffect(() => {
    if (connected) fetchCells();
    else reset();
  }, [connected]);

  return (
    <div className={ps.full}>
      <div className={ps.container}>
        <div className={ps.tit}>
          <div>
            Interface cell <span>({list.length})</span>
          </div>

          <div className={ps['rt-create']}>
            <IconAdd /> Create
          </div>
        </div>

        <div className={ps.group}>
          <section className={cn(ps.item, ps['load-item'])}>
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

          <section className={cn(ps.item, { [ps['item-flipped']]: isExpanded.includes(1) })}>
            <div
              className={ps['flipped-icon']}
              onClick={() => {
                setIsExpanded((prevState) => {
                  if (prevState.includes(1)) {
                    return prevState.filter((i) => i !== 1);
                  } else {
                    return [...prevState, 1];
                  }
                });
              }}
            >
              <img src="/images/other/5.svg" alt="" />
            </div>

            <div className={ps['item-front']}>
              <div className={ps['item-name']}>
                <div>
                  <img src="/images/other/google.svg" alt="" />
                  <div>
                    <div>Interface Cell</div>
                    <div>
                      0x81...353b
                      <Copy
                        className="copy"
                        copy={() => {
                          $copy('');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={ps.des}>
                <TooltipLine name={'Open your google browser and check my MetaMask wallet balance.Open your google '} index={1} length={null} clamp="2" />
              </div>

              <div className={ps.reward}>
                Reward
                <div>
                  <img src="/images/tokens/USDC.png" alt="" />
                  125.021921 SOL
                </div>
              </div>

              <Button block className={ps['claim-btn']}>
                Claim
              </Button>
            </div>

            <div className={ps['item-back']}>
              <div className={ps.info}>
                <div>
                  Fee
                  <div>
                    <img src="/images/tokens/SOL.png" alt="" />
                    $0.129104
                  </div>
                </div>

                <div>
                  Network Cost
                  <div>
                    <img src="/images/tokens/SOL.png" alt="" />
                    $0.14
                  </div>
                </div>

                <div>
                  Call Txn
                  <div>
                    0x81...353b
                    <Copy
                      className="copy"
                      copy={() => {
                        $copy('');
                      }}
                    />
                  </div>
                </div>

                <div>
                  Purchase Txn
                  <div>
                    0x81...353b
                    <Copy
                      className="copy"
                      copy={() => {
                        $copy('');
                      }}
                    />
                  </div>
                </div>

                <div>
                  Time
                  <div>2024-01-26</div>
                </div>
              </div>
            </div>
          </section>

          <section className={cn(ps.create, ps.item)}>
            <div>
              <div>
                <IconAdd />
                Create
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cells;
