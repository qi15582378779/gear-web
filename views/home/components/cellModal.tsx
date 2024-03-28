import { Copy } from "@/components";
import { IconClose, IconCopy, IconDown, IconSearch, IconSelectDown } from "@/components/Icon";
import { useDebounce, useScan } from "@/hooks";
import Server from "@/service";
import { $BigNumber, $copy, $hash, $shiftedBy, $shiftedByFixed } from "@/utils/met";
import { Input, Modal, Popover, Skeleton, message, notification } from "antd";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const test = [
  {
    _id: "65bb2468b0dd647b9a365ffa",
    owner: "0xef6191a5c8e983da45dac2a787d49fe3f2b6d54e",
    name: "translate local 1",
    description: "translate en",
    requestType: "POST",
    requestHeaders: null,
    requestParams: '{"data":"","test":""}',
    requestURL: "http://localhost:3011/v1/ai/text-to-en",
    price: "10000000000000000",
    denom: "0x0000000000000000000000000000000000000000",
    tokeninfo: {
      symbol: "BNB",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000"
    },
    logoFile: "https://sp.web3go.xyz/view/ai-cell-test-bucket/fold-logo/1706763352223_ishot_2024-01-31_16.36.51.png",
    cellId: "4cb65326950d41b0bb984354229abd03",
    created_at: "2024-02-01T04:56:08.475Z",
    updated_at: "2024-02-01T04:56:30.329Z",
    cellAddress: "0x79eD2D3CF65DCdA4c079aB072cab31DA298cA7e7",
    tokenId: "6",
    txhash: "0x0f8fdb869dc999307116669f78cbfaa19167b0b9eb330bf4c62070771a627375"
  },
  {
    _id: "65bb13d127b528eba3fc172e",
    owner: "0xef6191a5c8e983da45dac2a787d49fe3f2b6d54e",
    name: "translate local",
    description: "translate",
    requestType: "POST",
    requestHeaders: null,
    requestParams: '{"text":""}',
    requestURL: "http://localhost:3011/v1/ai/text-to-en",
    price: "10000000000000000",
    denom: "0x0000000000000000000000000000000000000000",
    tokeninfo: {
      symbol: "BNB",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000"
    },
    logoFile: "https://sp.web3go.xyz/view/ai-cell-test-bucket/fold-logo/1706759106869_ishot_2024-01-31_16.36.51.png",
    created_at: "2024-02-01T03:45:21.570Z",
    updated_at: "2024-02-01T03:57:43.768Z",
    cellAddress: "0x5aBa3888Eb4db95731680b8B821a4A475C23730c",
    tokenId: "5",
    txhash: "0x4364fa84f8ef9a35abe0bddcddce2f0953106148f36192f811a7dc299241c4b9",
    cellId: "865d88c1046240088cd6b26fa8980e50"
  }
];

const CellModal: React.FC<{ showCellModal: boolean; handleSelect: (item: any) => void; handleCloseModal: (update: boolean) => void }> = ({ showCellModal, handleSelect, handleCloseModal }) => {
  const [debounce] = useDebounce(1500);
  const { openGreenfieldScan } = useScan();
  const [cellList, setCellList] = useState<any[]>([]);
  const [cellLoad, setCellLoad] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [showIndex, setShowIndex] = useState(-1);
  const params = useRef({
    text: ""
  });

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
    // setCellList(test);
  };

  const hangSearch = (value: string) => {
    setSearch(value);
    params.current.text = value;
    debounce(() => getCellList());
  };

  useEffect(() => {
    if (showCellModal) {
      getCellList();
    }
  }, [showCellModal]);

  return (
    <Modals title={null} footer={null} open={showCellModal}>
      <Header>
        Select Cell
        <IconClose onClick={() => handleCloseModal(false)} />
      </Header>

      <Group>
        <Search value={search} prefix={<IconSearch />} placeholder="Search name or paste address" onChange={(e: any) => hangSearch(e.target.value)} />
      </Group>

      <ListGroup>
        {cellLoad && cellList.length === 0 ? (
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
          <>
            {cellList.map((item, index) => (
              <Item
                key={`${item._id}-${index}`}
                onClick={() => {
                  handleSelect(item);
                  setSearch("");
                  params.current.text = "";
                  handleCloseModal(false);
                }}
              >
                <Top>
                  <div>
                    <TopLfImg>
                      <Skeleton.Avatar active />
                      <Img src={item.logoFile} />
                    </TopLfImg>

                    {item.name}
                  </div>

                  <div>
                    <Img src={`/images/tokens/${item.tokeninfo.symbol}.png`} />
                    <span>{$shiftedBy(item.price, -item.tokeninfo.decimals)}/</span>Call
                    <IconGroup
                      className={cn(showIndex === index ? "show" : "")}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setShowIndex(showIndex === index ? -1 : index);
                      }}
                    >
                      <IconDown />
                    </IconGroup>
                    {/* <PopoverGroup
                    overlayClassName={'cell-popover'}
                    placement="bottomRight"
                    content={
                      <PopContent>
                        <div>
                          <Img src={item.logoFile} alt="" />
                          {item.name}
                        </div>
                        <div>{item.description}</div>
                        <div>URL: {$hash(item.encryptURL, 15, 15)}</div>
                        <div>
                          <div>GreenFiled Storage</div>
                          <div>
                            {$hash(item.metadataTxhash)}
                            <IconCopy
                              onClick={(e) => {
                                e.stopPropagation();
                                $copy(item.metadataTxhash);
                              }}
                            />
                          </div>
                        </div>
                      </PopContent>
                    }
                    arrow={false}
                  >
                    <IconGroup>
                      <IconDown />
                    </IconGroup>
                  </PopoverGroup> */}
                  </div>
                </Top>
                {showIndex === index && (
                  <InfoContent>
                    <div>
                      <Img src={item.logoFile} alt="" />
                      {item.name}
                    </div>
                    <div>{item.description}</div>
                    <div>URL: {$hash(item.encryptURL, 15, 15)}</div>
                    <div>
                      <div>GreenFiled Storage</div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          openGreenfieldScan(item.metadataObjectId, "object");
                        }}
                      >
                        {$hash(item.metadataObjectId)}
                        <Copy
                          className="copy"
                          copy={() => {
                            $copy(item.metadataObjectId);
                          }}
                        />
                        {/* <IconCopy
                          className="copy"
                          onClick={(e) => {
                            e.stopPropagation();
                            $copy(item.metadataTxhash);
                          }}
                        /> */}
                      </div>
                    </div>
                  </InfoContent>
                )}
              </Item>
            ))}
          </>
        )}

        {!cellLoad && cellList.length === 0 ? (
          <EmptyGroup>
            <div>
              <Img src="/images/home/icon-8.svg" alt="" />
              {/* <div>No Cells</div> */}
            </div>
          </EmptyGroup>
        ) : null}
      </ListGroup>
    </Modals>
  );
};

const Modals = styled(Modal)`
  && {
    &.ant-modal {
      width: 4.18rem !important;
    }
    .ant-modal-content {
      background: #fff;
      padding: 0.2rem 0;
      min-height: 5.56rem;
      border-radius: 0.24rem;
      border: 1px solid #e9eaf7;
      box-shadow: 0px 5px 16px 0px rgba(8, 15, 52, 0.06);
    }
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #222;
  font-feature-settings: "clig" off, "liga" off;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1;
  padding: 0 0.2rem;
  margin-bottom: 0.16rem;

  svg {
    width: 0.12rem;
    height: 0.12rem;
    color: #6f6c90;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #db00ff;
    }
  }
`;

const Group = styled.div`
  padding: 0 0.2rem;
`;

const Search = styled(Input)`
  && {
    border-radius: 0.12rem;
    border: 1px solid #eff0f6;
    background: #f9f9f9;
    height: 0.4rem;
    padding: 0 0.16rem;
    font-size: 0.14rem;
    color: #222;
    font-weight: 400;
    margin-bottom: 0.16rem;
    transition: all 0.2s;

    /* input {
      background: none !important;
    } */
    &::placeholder {
      color: #cecece;
    }

    & > span {
      margin-inline-end: 0.08rem;

      svg {
        width: 0.14rem;
        height: 0.14rem;
        color: #6f6c90;
      }
    }

    &:hover,
    &:focus {
      /* border-color: #f1eaf0;
      background-color: #f9f9f9;
      box-shadow: none; */
      border-color: #e3e4ea;
      box-shadow: none;
    }
  }
`;

const ListGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0 0;
  max-height: 4.26rem;
  overflow-y: auto;
`;

const Item = styled.div`
  &:hover {
    background-color: #f7f8fa;
  }
`;

const IconGroup = styled.div`
  width: 0.16rem;
  height: 0.16rem;
  background-color: rgba(247, 249, 252, 0.5);
  color: #a4aebc;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.04rem;
  cursor: pointer;
  margin-left: 0.08rem;

  svg {
    width: 0.12rem;
    height: 0.12rem;
    transition: all 0.2s;
  }
  &.show {
    svg {
      transform: rotate(180deg);
    }
  }
  &:hover {
    background-color: #ffefff;
    svg {
      /* transform: rotate(180deg); */
      color: #fc72ff;
    }
  }
`;

const PopoverGroup = styled(Popover)``;

const PopContent = styled.div`
  margin-top: 0.05rem;
  border-radius: 0.12rem;
  border: 1px solid #eff0f6;
  background: #fff;
  padding: 0.12rem 0.16rem;
  max-width: 3.78rem;

  & > div {
    &:nth-of-type(1) {
      display: flex;
      align-items: center;
      font-size: 0.14rem;
      font-weight: 500;
      color: #222;
      line-height: 1;
      margin-bottom: 0.04rem;
      img {
        display: block;
        width: 0.24rem;
        height: 0.24rem;
        border-radius: 50%;
        margin-right: 0.04rem;
      }
    }
    &:nth-of-type(2) {
      padding-left: 0.28rem;
      font-size: 0.12rem;
      font-weight: 400;
      line-height: 150%;
      color: #7d7d7d;
      margin-bottom: 0.14rem;
    }
    &:nth-of-type(3) {
      width: 100%;
      height: 0.32rem;
      background-color: #f9f9f9;
      display: flex;
      align-items: center;
      font-size: 0.12rem;
      font-weight: 500;
      line-height: 133.333%;
      color: #7d7d7d;
      padding: 0 0.08rem;
      margin-bottom: 0.1rem;
    }
    &:nth-of-type(4) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > div {
        display: flex;
        align-items: center;
        font-size: 0.12rem;
        font-weight: 400;
        line-height: 1;
        letter-spacing: 0.4px;
        &:nth-of-type(1) {
          color: #7d7d7d;
        }
        &:nth-of-type(2) {
          color: #fc72ff;
          /* svg {
            width: 0.08rem;
            height: 0.12rem;
            color: #222222;
            margin-left: 0.04rem;
            cursor: pointer;
          } */
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    max-width: calc(100vw - 0.56rem);
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding: 0 0.2rem; */
  height: 0.36rem;
  transition: all 0.2s;
  cursor: pointer;
  padding: 0.1rem 0.2rem;
  box-sizing: content-box;
  /* &:hover {
    background-color: #f7f8fa;
  } */

  & > div {
    display: flex;
    align-items: center;
    line-height: 1;
    &:nth-of-type(1) {
      font-size: 0.16rem;
      font-weight: 400;
      color: #222;

      img {
        display: block;
        /* height: 0.36rem;
        margin-right: 0.1rem; */
      }
    }
    &:nth-of-type(2) {
      font-size: 0.14rem;
      font-weight: 500;
      letter-spacing: 0.4px;
      color: rgba(34, 34, 34, 0.6);

      span {
        color: #222;
      }

      img {
        display: block;
        height: 0.2rem;
        border-radius: 50%;
        margin-right: 0.08rem;
      }
    }
  }
`;
const InfoContent = styled.div`
  border-radius: 12px;
  border: 1px solid #eff0f6;
  background: #fff;
  width: calc(100% - 0.4rem);
  margin: 0 auto;
  padding: 0.12rem 0.16rem;
  margin-bottom: 0.1rem;
  & > div {
    &:nth-of-type(1) {
      display: flex;
      align-items: center;
      font-size: 0.14rem;
      font-weight: 500;
      color: #222;
      line-height: 1;
      margin-bottom: 0.04rem;
      img {
        display: block;
        width: 0.24rem;
        height: 0.24rem;
        border-radius: 50%;
        margin-right: 0.04rem;
      }
    }
    &:nth-of-type(2) {
      padding-left: 0.28rem;
      font-size: 0.12rem;
      font-weight: 400;
      line-height: 150%;
      color: #7d7d7d;
      margin-bottom: 0.14rem;
    }
    &:nth-of-type(3) {
      width: 100%;
      height: 0.32rem;
      background-color: #f9f9f9;
      display: flex;
      align-items: center;
      font-size: 0.12rem;
      font-weight: 500;
      line-height: 133.333%;
      color: #7d7d7d;
      padding: 0 0.08rem;
      margin-bottom: 0.1rem;
      border-radius: 0.08rem;
    }
    &:nth-of-type(4) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > div {
        display: flex;
        align-items: center;
        font-size: 0.12rem;
        font-weight: 400;
        line-height: 1;
        letter-spacing: 0.4px;
        &:nth-of-type(1) {
          color: #7d7d7d;
        }
        &:nth-of-type(2) {
          /* color: #fc72ff; */
          cursor: pointer;
          /* svg {
            width: 0.08rem;
            height: 0.12rem;
            color: #222222;
            margin-left: 0.04rem;
          } */
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    max-width: calc(100vw - 0.56rem);
  }
`;

const Img = styled.img`
  border-radius: 50%;
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
  & > div {
    img {
      display: block;
      width: 1.28rem;
    }
    font-size: 0.16rem;
    font-weight: 500;
    color: #222;
    text-align: center;
  }
`;

const TopLfImg = styled.div`
  position: relative;
  margin-right: 0.1rem;
  width: 0.36rem;
  height: 0.36rem;
  border-radius: 50%;
  overflow: hidden;
  & > div {
    width: 100% !important;
    height: 100% !important;
  }
  & > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.36rem;
    height: 0.36rem;
  }
`;

export default CellModal;
