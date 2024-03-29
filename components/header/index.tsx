import { useWallet } from "@solana/wallet-adapter-react";
import { $hash } from "@/utils/met";
import { useRouter } from "next/router";
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { IconHistory1, IconOut, IconCopy, IconAdd } from "@/components/Icon";
import { motion, AnimatePresence } from "framer-motion";

import styled from "styled-components";
import { Dropdown, Popover } from "antd";
import { useUserBalance } from "@/state/base/hooks";
import type { MenuProps } from "antd";
import cn from "classnames";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header: FC<any> = (): ReactElement => {
  const modalRef = useRef(null);
  const router = useRouter();
  const { publicKey, connected, disconnect } = useWallet();
  const [balance, getUserBalance] = useUserBalance();
  const [open, setOpen] = useState(false);

  const [initial, setInitial] = useState<any>({ opacity: 0, x: 20 });
  const [animate, setAnimate] = useState<any>({ opacity: 1, x: 0 });

  const [infoFlag, setInfoFlag] = useState<boolean>(false);
  const H5DropRef = useRef<HTMLDivElement | null>(null);

  const nav = [
    { name: "Call", path: "/" },
    { name: "Gears", path: "/gears" },
    { name: "Create", path: "/create" }
  ];

  const jump = (path: string) => {
    router.push(path);
  };

  const handOpen = () => {
    if (typeof window === "undefined") return;
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
    if (!connected) return;
    getUserBalance();
  }, [connected]);

  useEffect(() => {
    if (!connected || !open) return;
    getUserBalance();
  }, [connected, open]);

  const handleDocumentClick = (event: MouseEvent) => {
    if (open && H5DropRef.current && !H5DropRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [open]);

  return (
    <HeaderView>
      <Section className={cn({ "menu-open": open })} ref={H5DropRef}>
        <Left>
          <Logo onClick={() => jump("/")} src="/images/logo/logo.svg" />
        </Left>
        <Nav>
          {nav.map((ele) => (
            <NavItem key={ele.path} onClick={() => jump(ele.path)} className={ele.path === router.pathname ? "active" : ""}>
              {ele.name}
            </NavItem>
          ))}
        </Nav>

        <AccountConter>
          <History
            onClick={() => {
              router.push("/history");
            }}
            className={"/history" === router.pathname ? "active" : ""}
          >
            <IconHistory1 />
            History
          </History>

          <Chain>
            {/* {connected ? (
              // eslint-disable-next-line react/no-unescaped-entities
              <PopoverGroup placement="left" content={<PopoverContent>Your wallet's current network is unsupported.</PopoverContent>}>
                <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']} overlayClassName="chain-dropdown">
                  <PopoverImg onClick={(e: any) => e.preventDefault()}>
                    <WainImg src="/images/other/1.svg" />
                  </PopoverImg>
                </Dropdown>
              </PopoverGroup>
            ) : (
              <ChainImg src="/images/chain/SOL.svg" />
            )} */}

            {connected && <ChainImg src="/images/chain/SOL.svg" />}
          </Chain>

          {connected ? (
            <Wallet ref={H5DropRef} onClick={() => handOpen()}>
              <AvatarIcon src="/images/avatar.svg" />
              <WalletAddressTxt>{$hash(publicKey!.toBase58(), 6, 4)}</WalletAddressTxt>
              <WalletDownIcon src="/images/other/3.svg" />
            </Wallet>
          ) : (
            <WalletMultiButton>Connect Wallet</WalletMultiButton>
          )}

          <H5Menu
            onClick={() => {
              setOpen(!open);
            }}
            className={cn({ active: open })}
          >
            <IconAdd />
          </H5Menu>
        </AccountConter>

        <H5MenuDrop className={cn({ open: open })}>
          {nav.map((ele) => (
            <H5MenuItem
              key={ele.path}
              onClick={() => {
                jump(ele.path);
                setOpen(!open);
              }}
              className={ele.path === router.pathname ? "active" : ""}
            >
              {ele.name}
            </H5MenuItem>
          ))}

          {connected ? (
            <H5WalletInfo
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                setInfoFlag(!infoFlag);
              }}
              className={cn({ active: infoFlag })}
            >
              Profile <WalletDownIcon src="/images/other/3.svg" />
            </H5WalletInfo>
          ) : (
            <H5ConnectFull>
              <WalletMultiButton>Connect Wallet</WalletMultiButton>
            </H5ConnectFull>
          )}

          {connected && (
            <H5InfoDrop
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              className={cn({ "info-active": infoFlag })}
            >
              <Account>
                <Avatar src="/images/avatar-metamask.png" />
                {$hash(publicKey!.toBase58(), 4, 4)}
                <IconCopy />
              </Account>

              <AssetsContent>
                <Balance>
                  <Symbol>
                    <SymbolIcon src="/images/tokens/SOL.png" />
                    SOL
                  </Symbol>
                  <b>{balance.sol}</b>
                </Balance>
              </AssetsContent>
            </H5InfoDrop>
          )}
        </H5MenuDrop>

        <AnimatePresence>
          {open && (
            <Modal ref={modalRef} initial={initial} animate={animate} exit={initial}>
              <ModalContent>
                {connected ? (
                  <>
                    <ModalTit>
                      My Profile <IconOut onClick={() => disconnect()} />
                    </ModalTit>

                    <Account>
                      <Avatar src="/images/avatar-metamask.png" />
                      {$hash(publicKey!.toBase58(), 4, 4)}
                      <IconCopy />
                    </Account>

                    <AssetsContent>
                      <Balance>
                        <Symbol>
                          <SymbolIcon src="/images/tokens/SOL.png" />
                          SOL
                        </Symbol>
                        <b>{balance.sol}</b>
                      </Balance>
                    </AssetsContent>
                  </>
                ) : (
                  <NoConnect>
                    <Title>Connect a wallet</Title>
                    <WalletMultiButton>Connect Wallet</WalletMultiButton>
                    {/* <Content onClick={() => connectWallet("m")}>
                      <MetaMask>
                        <IconMetaMask />
                      </MetaMask>
                      MetaMask
                    </Content> */}
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
  background: #191e24;
  @media screen and (max-width: 768px) {
    padding: 0.16rem;
    background: transparent;
    height: auto;
  }
`;
const Section = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;

  @media screen and (max-width: 768px) {
    border-radius: 0.24rem;
    height: 0.64rem;
    background: #191e24;
    padding: 0 0.2rem;
  }

  &.menu-open {
    border-radius: 0.24rem 0.24rem 0 0;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.img`
  width: 0.95rem;
  @media screen and (max-width: 768px) {
    width: 0.657rem;
  }
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

  @media screen and (max-width: 768px) {
    display: none;
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
  font-feature-settings: "clig" off, "liga" off;
  font-size: 0.14rem;
  border-radius: 0.12rem;
`;

const ChainImg = styled.img`
  height: 0.4rem;
  width: 0.4rem;
  @media screen and (max-width: 768px) {
    width: 0.32rem;
    height: 0.32rem;
  }
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

  @media screen and (max-width: 768px) {
    padding: 0;
    margin-right: 0.3rem;
    &:hover {
      border-color: transparent;
    }
  }
`;

const AvatarIcon = styled.img`
  display: block;
  height: 0.24rem;
  width: 0.24rem;
`;

const WalletDownIcon = styled(AvatarIcon)`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const WalletAddressTxt = styled.span`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

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

  @media screen and (max-width: 768px) {
    display: none;
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
  font-family: "Source Sans 3";
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
  font-feature-settings: "clig" off, "liga" off;
  font-family: "Source Sans 3";
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

  @media screen and (max-width: 768px) {
    background: linear-gradient(0deg, #191e24 0%, #191e24 100%), radial-gradient(230.54% 165.04% at 50% 100.41%, rgba(146, 73, 250, 0.15) 0%, rgba(34, 233, 174, 0.15) 100%);
    box-shadow: 0px 0px 18.201px 0px #fff inset;
    margin-bottom: 0;
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
  @media screen and (max-width: 768px) {
    background-color: transparent;
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

  &.active {
    color: #fff;
    font-weight: 700;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const H5Menu = styled.div`
  width: 0.64rem;
  height: 0.42rem;
  border-radius: 0.12rem;
  background-color: #292f36;
  display: none;
  align-items: center;
  justify-content: center;
  color: #fff;

  & > svg {
    width: 0.2rem;
    height: 0.2rem;
    transition: all 0.2s;
  }

  &.active {
    svg {
      transform: rotate(45deg);
    }
  }

  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

const H5MenuDrop = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  width: 100%;
  background-color: #191e24;
  border-radius: 0 0 0.24rem 0.24rem;
  padding: 0 0.2rem 0.24rem;
  overflow: hidden;

  transition: opacity 267ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 178ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transform-origin: 0 0;
  transform: scaleY(0);
  opacity: 0;

  &.open {
    opacity: 1;
    transform: scaleY(1);
  }

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const H5MenuItem = styled.div`
  padding: 0.15rem 0.14rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.14rem;
  font-weight: 400;
  line-height: 171.429%;
  border-bottom: 1px solid #292f36;
  text-align: center;

  &.active {
    color: #fff;
    font-weight: 700;
  }
`;

const H5ConnectFull = styled.div`
  width: 100%;
  padding-top: 0.24rem;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    display: flex;
  }
`;

const H5WalletInfo = styled.div`
  height: 0.54rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.14rem;
  font-weight: 400;
  border-bottom: 1px solid #292f36;
  & > img {
    display: block;
    margin-left: 0.02rem;
    transition: all 0.2s;
  }

  &.active {
    img {
      transform: rotate(180deg);
    }
  }
`;

const H5InfoDrop = styled.div`
  display: none;
  flex-direction: column;
  row-gap: 0.08rem;
  padding-top: 0.15rem;
  transition: all 0.2s;
  &.info-active {
    display: flex;
  }
`;

export default Header;
