import cn from 'classnames';
import ps from './styles/index.module.scss';
import TooltipLine from '@/components/TooltipLine';
import { Copy } from '@/components';
import { $copy } from '@/utils/met';
import { useState } from 'react';

const History: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);

  return (
    <div className={ps.full}>
      <div className={ps.container}>
        <div className={ps.tit}>Calls History</div>

        <div className={cn(ps.item, { [ps['open-item']]: open && openIndex === -1 })}>
          <section className={ps['data-item']}>
            <div className={ps['item-top']}>
              <div className={ps['top-lf']}>
                <div className={ps['lf-img']}>
                  <img src="/images/other/google.svg" alt="" />
                </div>
                <div className={ps['lf-txt']}>
                  <div>Google</div>
                  <div>
                    <TooltipLine name="As a design team that is responsible for delive" />
                  </div>
                </div>
              </div>
              <div className={ps['top-rt']}>
                <div>
                  <div>Time</div>
                  <div>2024-01-26</div>
                </div>
                <div>
                  <div>Status</div>
                  <div>successful</div>
                </div>
                <div
                  onClick={() => {
                    setOpen(!open);
                    // setOpenIndex(index);
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
                        $copy('');
                      }}
                    />
                  </div>
                </div>

                <div>Open your google browser and check my MetaMask wallet balance.</div>
              </div>

              <div className={ps['card-2']}>
                <div>
                  Output:
                  <div>
                    <Copy
                      className="copy"
                      copy={() => {
                        $copy('');
                      }}
                    />
                  </div>
                </div>
                <div>
                  Open your google browser and check my MetaMask wallet balance.Open your google browser and check my MetaMask wallet balance.Open your google browser and Open your google browser and check my MetaMask wallet balance.Open your google browser and check my MetaMask wallet balance.Open
                  your google browser and
                </div>
              </div>

              <div className={ps['card-3']}>
                <div>
                  Price
                  <div>
                    <img src="/images/tokens/USDC.png" alt="" />
                    <span>$0.142472</span>/Call
                  </div>
                </div>

                <div>
                  Fee
                  <div>
                    <img src="/images/tokens/USDC.png" alt="" />
                    <span>$0.142472</span>
                  </div>
                </div>

                <div>
                  Network Cost
                  <div>
                    <img src="/images/tokens/USDC.png" alt="" />
                    <span>$0.142472</span>
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
              </div>
            </div>
          </section>
        </div>

        {/* <div className={ps.empty}>
          <div>
            <img src="/images/other/empty.svg" alt="" />
            No history
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default History;
