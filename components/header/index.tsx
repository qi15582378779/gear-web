import { useBalance, useWallet } from '@/hooks';
import { useConnectWallet, useDisconnectWallet } from '@/state/chain/hooks';
import { $hash } from '@/utils/met';
import { useRouter } from 'next/router';
import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { IconShutDown, IconMetaMask } from '@/components/Icon';
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
    { name: 'Cells', path: '/cells' }
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
          <Logo onClick={() => jump('/')} src="/images/logo.png" />
          <Nav>
            {nav.map((ele) => (
              <NavItem key={ele.path} onClick={() => jump(ele.path)} className={ele.path === router.pathname ? 'active' : ''}>
                {ele.name}
              </NavItem>
            ))}
          </Nav>
        </Left>
        <AccountConter>
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
              <ChainImg src="/images/chain/BSC.svg" />
            )}

            {/* <ChainName>BNB Chain</ChainName> */}
          </Chain>
          {account ? (
            <Wallet onClick={() => handOpen()}>
              <AvatarIcon src="/images/avatar.svg" />
              {$hash(account, 6, 4)}
            </Wallet>
          ) : (
            <ConnectWallet onClick={() => connectWallet('m')}>Connect</ConnectWallet>
          )}
        </AccountConter>

        <AnimatePresence>
          {open && (
            <Modal ref={modalRef} initial={initial} animate={animate} exit={initial}>
              <ModalBg onClick={() => setOpen(false)}>
                <img src="/images/other/2.svg" alt="" />
              </ModalBg>
              <ModalContent>
                {account ? (
                  <>
                    <Account>
                      <div>
                        <Avatar src="/images/avatar-metamask.png" />
                        {/* <RoundS>
                          <MateMask src="/images/matemask.svg" />
                        </RoundS> */}
                        {$hash(account, 4, 4)}
                      </div>

                      <LogoutFull onClick={() => disconnectWallet()}>
                        <IconShutDown />
                        <LogoutText>Disconnect</LogoutText>
                      </LogoutFull>
                    </Account>

                    <AssetsContent>
                      <Balance>
                        <Symbol>
                          <SymbolIcon src="/images/tokens/USDT.png" />
                          USDT
                        </Symbol>
                        <b>{balance.usdt}</b>
                      </Balance>
                      <Balance>
                        <Symbol>
                          <SymbolIcon src="/images/tokens/BNB.png" />
                          BNB
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
              <Mask onClick={() => setOpen(false)}></Mask>
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
  padding: 0 0.12rem;
  z-index: 4;
  background: linear-gradient(109deg, rgba(243, 248, 251, 0.08) -6.47%, rgba(216, 239, 255, 0.04) 104.78%);
  /* @media (max-width: 768px) {
        height: 0.4rem;
    } */
`;
const Section = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  background-color: #fff;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.img`
  width: 0.98rem;
  /* height: 0.23rem; */
`;
const Nav = styled.div`
  margin-left: 0.9rem;
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const NavItem = styled.div`
  color: #7d7d7d;
  min-width: 0.6rem;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  cursor: pointer;
  height: 0.4rem;
  line-height: 1;
  display: flex;
  align-items: center;
  padding: 0 0.14rem;
  border-radius: 0.12rem;
  transition: all 0.2s;
  margin-right: 0.08rem;

  &:hover {
    background: #f8f8fa;
  }

  &:last-child {
    margin-right: 0;
  }
  &.active {
    color: #222;
    font-weight: 500;
  }
`;

const ConnectWallet = styled.div`
  border-radius: 0.12rem;
  background: #ffefff;
  height: 0.4rem;
  line-height: 0.4rem;
  padding: 0 0.07rem;

  color: #fc72ff;
  font-size: 0.16rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  cursor: pointer;
`;

const AccountConter = styled.div`
  display: flex;
  align-items: center;
  padding-right: 0.13rem;
`;
const Chain = styled.div`
  display: flex;
  align-items: center;
  height: 0.4rem;
  /* padding: 0 0.08rem; */

  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;

  border-radius: 0.12rem;
  /* background: #f7f8fa; */
`;
const ChainImg = styled.img`
  height: 0.2rem;
  width: 0.2rem;
  margin-right: 0.18rem;
`;

const ChainName = styled.div`
  margin-left: 0.06rem;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Wallet = styled.div`
  display: flex;
  align-items: center;
  color: #170f49;
  font-size: 0.16rem;
  letter-spacing: 0.4px;
  padding: 0.06rem 0.08rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-radius: 0.24rem;
    background: #f9f9f9;
  }
`;
const AvatarIcon = styled.img`
  height: 0.24rem;
  width: 0.24rem;
  margin-right: 0.06rem;

  /* border-radius: 50%;
  margin-right: 0.06rem;
  background: #fc72ff; */
`;

const Modal = styled(motion.div)`
  width: 3.9rem;
  /* height: 1.64rem; */
  /* min-height: 2.22rem; */
  flex-shrink: 0;

  box-shadow: 0px 5px 6px 0px rgba(8, 15, 52, 0.04);
  border-radius: 0.12rem;
  @media screen and (min-width: 768px) {
    position: absolute;
    right: -0.04rem;
    top: 0.08rem;
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
  padding: 0.2rem 0.16rem 0.24rem;
  background: #fff;
  border: 1px solid #f1eaf0;
  border-radius: 0.12rem;

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

const ModalBg = styled.div`
  position: absolute;
  width: calc(100% + 0.58rem);
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0.12rem;
  transition: all 0.2s;
  cursor: pointer;
  padding: 0.24rem 0.06rem;

  &:hover {
    width: calc(100% + 0.54rem);
    background-color: #fafafc;

    img {
      opacity: 0.8;
    }
  }

  img {
    display: block;
    width: 0.24rem;
    height: 0.24rem;
    transition: all 0.2s;
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
const MetaMaskIcon = styled.img`
  width: 0.34rem;
  height: 0.34rem;
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0.56rem;
  color: #170f49;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.4px;

  & > div {
    display: flex;
    align-items: center;
  }
`;
const Avatar = styled.img`
  width: 0.44rem;
  height: 0.44rem;
  margin-right: 0.08rem;
  /* border-radius: 50%;
  background: #fc72ff;
  position: relative;
  margin-right: 0.06rem; */
`;
// const MateMask = styled.img`
//   width: 0.16rem;
//   position: absolute;
//   right: 0;
//   bottom: 0;
// `;
const AssetsContent = styled.div`
  margin-top: 0.2rem;
`;
const Balance = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.24rem;
  padding-right: 0.06rem;
  &:last-child {
    margin-bottom: 0;
  }
  b {
    color: #222;
    font-size: 0.16rem;
    font-style: normal;
    font-weight: 700;
  }
`;
const Symbol = styled.div`
  display: flex;
  align-items: center;
  color: #222;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 400;
`;
const SymbolIcon = styled.img`
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 50%;
  margin-right: 0.06rem;
`;
// const Balance = styled.div`
//   margin-top: 0.16rem;
//   text-align: center;
//   color: #170f49;
//   font-size: 0.36rem;
//   font-weight: 600;
//   line-height: 1;
//   letter-spacing: 0.4px;
// `;

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

const LogoutFull = styled.div`
  display: flex;
  align-items: center;
  /* padding: 0 0.08rem; */
  transition: all 0.2s;
  cursor: pointer;
  border-radius: 0.08rem;
  overflow: hidden;

  svg {
    width: 0.32rem;
    height: 0.32rem;
    /* transition: all 0.2s; */
  }

  &:hover {
    padding: 0.04rem 0.08rem;
    background: #f9f9f9;

    svg {
      width: auto;
      height: auto;
    }

    span {
      width: auto;
      margin-left: 0.08rem;
    }
  }
`;

const LogoutText = styled.span`
  color: #7d7d7d;
  font-size: 0.16rem;
  font-weight: 400;
  line-height: 1;

  width: 0;
  transition: all 0.2s;
  overflow: hidden;
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

export default Header;
