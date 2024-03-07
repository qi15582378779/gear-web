import { useBalance, useWallet } from '@/hooks';
import { useConnectWallet, useDisconnectWallet } from '@/state/chain/hooks';
import { $hash } from '@/utils/met';
import { useRouter } from 'next/router';
import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { IconMetaMask, IconHistory1, IconOut, IconCopy } from '@/components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import tokens from '@/utils/tokens.json';

import styled from 'styled-components';
import { useIsCreate } from '@/state/cells/hooks';
import { Dropdown, Popover } from 'antd';
import { useUserBalance } from '@/state/base/hooks';
import type { MenuProps } from 'antd';

const Header: FC<any> = (): ReactElement => {
  const modalRef = useRef(null);
  const router = useRouter();
  const [isCreate, setIsCreate] = useIsCreate();
  const { account, chainId, walletReady, switchNetwork } = useWallet();
  const [, connectWallet] = useConnectWallet();
  const [, disconnectWallet] = useDisconnectWallet();
  const [balance, getUserBalance] = useUserBalance();
  const [open, setOpen] = useState(false);

  const [initial, setInitial] = useState<any>({ opacity: 0, x: 20 });
  const [animate, setAnimate] = useState<any>({ opacity: 1, x: 0 });

  const nav = [
    { name: 'Call', path: '/' },
    { name: 'Cells', path: '/cells' },
    { name: 'Create', path: '/create' }
  ];

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <ChainItems
          onClick={() => {
            switchNetwork();
          }}
        >
          <ChainImg src="/images/chain/BSC.svg" />
          BNB Chain
        </ChainItems>
      )
    }
  ];

  const jump = (path: string) => {
    setIsCreate(false);
    router.push(path);
  };

  const handOpen = () => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768) {
      setInitial({ y: 20 });
      setInitial({ y: 0 });
    } else {
      setInitial({ opacity: 0, x: 20 });
      setInitial({ opacity: 1, x: 0 });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!walletReady) return;
    getUserBalance();
  }, [walletReady]);

  useEffect(() => {
    if (!account || !open) return;
    getUserBalance();
  }, [account, open]);

  return (
    <HeaderView>
      <Section>
        <Left>
          <Logo onClick={() => jump('/')} src="/images/logo/logo.svg" />
        </Left>
        <Nav>
          {nav.map((ele) => (
            <NavItem key={ele.path} onClick={() => jump(ele.path)} className={ele.path === router.pathname ? 'active' : ''}>
              {ele.name}
            </NavItem>
          ))}
        </Nav>

        <AccountConter>
          <History>
            <IconHistory1 />
            History
          </History>

          <Chain>
            {!walletReady && account ? (
              // eslint-disable-next-line react/no-unescaped-entities
              <PopoverGroup placement="left" content={<PopoverContent>Your wallet's current network is unsupported.</PopoverContent>}>
                <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']} overlayClassName="chain-dropdown">
                  <PopoverImg onClick={(e) => e.preventDefault()}>
                    <WainImg src="/images/other/1.svg" />
                  </PopoverImg>
                </Dropdown>
              </PopoverGroup>
            ) : (
              <ChainImg src="/images/chain/SOL.svg" />
            )}

            {/* <ChainName>BNB Chain</ChainName> */}
          </Chain>

          {account ? (
            <Wallet onClick={() => handOpen()}>
              <AvatarIcon src="/images/avatar.svg" />
              {$hash(account, 6, 4)}
              <WalletDownIcon src="/images/other/3.svg" />
            </Wallet>
          ) : (
            <ConnectWallet onClick={() => connectWallet('m')}>Connect Wallet</ConnectWallet>
          )}
        </AccountConter>

        <AnimatePresence>
          {open && (
            <Modal ref={modalRef} initial={initial} animate={animate} exit={initial}>
              <ModalContent>
                {account ? (
                  <>
                    <ModalTit>
                      My Profile <IconOut onClick={() => setOpen(false)} />
                    </ModalTit>

                    <Account>
                      <Avatar src="/images/avatar-metamask.png" />
                      {$hash(account, 4, 4)}
                      <IconCopy />
                    </Account>

                    <AssetsContent>
                      <Balance>
                        <Symbol>
                          <SymbolIcon src="/images/tokens/USDC.png" />
                          USDC
                        </Symbol>
                        <b>{balance.usdt}</b>
                      </Balance>
                      <Balance>
                        <Symbol>
                          <SymbolIcon src="/images/tokens/SOL.png" />
                          SOL
                        </Symbol>
                        <b>{balance.bnb}</b>
                      </Balance>
                    </AssetsContent>
                  </>
                ) : (
                  <NoConnect>
                    <Title>Connect a wallet</Title>
                    <Content onClick={() => connectWallet('m')}>
                      <MetaMask>
                        <IconMetaMask />
                      </MetaMask>
                      MetaMask
                    </Content>
                  </NoConnect>
                )}
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </Section>
    </HeaderView>
  );
};

const HeaderView = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  height: 0.72rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.52rem;
  z-index: 4;
  background: #161616;
`;
const Section = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.img`
  width: 0.95rem;
`;
const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 0 0.72rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const NavItem = styled.div`
  height: 0.4rem;
  padding: 0 0.14rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.14rem;
  font-weight: 400;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  border-radius: 0.24rem;
  display: flex;
  align-items: center;

  &:hover {
    border-color: #fff;
    color: #fff;
  }

  &.active {
    color: #fff;
    font-weight: 700;
  }
`;

const ConnectWallet = styled.div`
  border-radius: 0.32rem;
  background: #fbfbfb;
  height: 0.4rem;
  padding: 0 0.16rem;
  color: #07071c;
  font-size: 0.14rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: #c4cbd4;
  }
`;

const AccountConter = styled.div`
  display: flex;
  align-items: center;
  gap: 0 0.16rem;
`;

const Chain = styled.div`
  display: flex;
  align-items: center;
  height: 0.4rem;
  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  border-radius: 0.12rem;
`;

const ChainImg = styled.img`
  height: 0.4rem;
  width: 0.4rem;
`;

const Wallet = styled.div`
  display: flex;
  align-items: center;
  gap: 0 0.06rem;
  height: 0.4rem;
  padding: 0 0.14rem;
  border-radius: 0.32rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  font-size: 0.16rem;
  font-weight: 600;
  color: #fff;

  &:hover {
    border-color: #fff;
  }
`;

const AvatarIcon = styled.img`
  display: block;
  height: 0.24rem;
  width: 0.24rem;
`;

const WalletDownIcon = styled(AvatarIcon)``;

const Modal = styled(motion.div)`
  width: 2.48rem;
  flex-shrink: 0;
  border-radius: 0.16rem;
  background: #191e23;
  overflow: hidden;

  @media screen and (min-width: 768px) {
    position: absolute;
    right: -0.04rem;
    top: 0.6rem;
  }
  @media screen and (max-width: 768px) {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 999;
    width: 100%;
  }
`;

const Mask = styled.div`
  width: 100vw;
  height: 100vh;
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.18);
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  padding: 0.16rem;

  @media screen and (max-width: 768px) {
    border-radius: 0.12rem 0.12rem 0 0;
    padding-bottom: 1rem;
  }

  .shut-down {
    position: absolute;
    top: 0.26rem;
    right: 0.22rem;
    cursor: pointer;
    width: 0.32rem;
    color: #7d7d7d;
  }
`;

const ModalTit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #17fb9b;
  font-family: Poppins;
  font-size: 0.16rem;
  font-weight: 700;
  margin-bottom: 0.12rem;

  & > svg {
    cursor: pointer;
    color: #ebebeb;
    transition: all 0.2s;

    &:hover {
      color: #17fb9b;
    }
  }
`;

const NoConnect = styled.div``;
const Title = styled.div`
  color: #222;
  font-family: 'Source Sans 3';
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 600;
  line-height: 0.24rem; /* 150% */
  margin-bottom: 0.12rem;
`;
const Content = styled.div`
  width: 100%;
  height: 0.76rem;
  flex-shrink: 0;
  border-radius: 0.12rem;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  color: #170f49;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: 'Source Sans 3';
  font-size: 0.16rem;
  font-weight: 600;
  padding: 0 0.19rem;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%), #f9f9f9;
    div {
      background: rgb(247, 248, 252);
    }
  }
`;
const MetaMask = styled.div`
  width: 0.34rem;
  height: 0.34rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  margin-right: 0.09rem;
  transition: all 0.2s;
  border: 1px solid rgb(228, 230, 230);
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  gap: 0 0.08rem;
  height: 0.56rem;
  padding: 0 0.16rem;
  color: #fff;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 700;
  border-radius: 0.08rem;
  background: radial-gradient(230.54% 165.04% at 50% 100.41%, rgba(146, 73, 250, 0.15) 0%, rgba(34, 233, 174, 0.15) 100%);
  filter: drop-shadow(0px 18.201px 0px #fff) inset;
  margin-bottom: 0.08rem;

  & > svg {
    width: 0.14rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: #17fb9b;
    }
  }
`;

const Avatar = styled.img`
  width: 0.24rem;
  height: 0.24rem;
`;

const AssetsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.08rem 0;
`;

const Balance = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #283039;
  height: 0.48rem;
  padding: 0 0.16rem;
  border-radius: 0.08rem;

  b {
    color: #fff;
    font-size: 0.16rem;
    font-style: normal;
    font-weight: 700;
  }
`;

const Symbol = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 0.16rem;
  font-weight: 400;
`;

const SymbolIcon = styled.img`
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  margin-right: 0.08rem;
`;

const PopoverGroup = styled(Popover)`
  && {
    /* width: 1.89rem; */
  }
`;

const PopoverContent = styled.div`
  color: #222;
  font-size: 0.12rem;
  font-weight: 400;
  line-height: 150%;
  width: 2.8rem;
`;

const PopoverImg = styled.div`
  padding: 0.1rem 0.08rem;
  border-radius: 0.12rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.08rem;

  &:hover {
    background: #f7f8fa;
  }
`;

const WainImg = styled.img`
  display: block;
  width: 0.2rem;
  height: 0.2rem;
`;

const ChainItems = styled.div`
  height: 0.4rem;
  border-radius: 0.12rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 0.1rem;
  transition: all 0.2s;

  img {
    margin-right: 0.08rem;
  }

  &:hover {
    background: #e9e9e9;
  }
`;

const History = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  height: 0.4rem;
  padding: 0 0.14rem;
  gap: 0 0.06rem;
  font-size: 0.14rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.32rem;

  &:hover {
    border-color: #fff;
    color: #fff;
  }
`;

export default Header;
