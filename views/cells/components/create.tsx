import { ChangeEvent, FC, ReactElement, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Tooltip, message, notification } from 'antd';
import FormData from 'form-data';
// import { useWallet, useTransactionMined } from '@/hooks';
import { TransactionState } from '@/typings';
import { useRouter } from 'next/router';
import { TokensModal, RequestTypeModal } from './index';
import { useCells, useRequestTypeModal, useResultModal, useTokensModal } from '@/state/cells/hooks';
import { IconDown, IconWen, IconBack } from '@/components/Icon';
import cn from 'classnames';
import { $BigNumber, $filterNumber, $shiftedBy } from '@/utils/met';
import Server from '@/service';
import tokens from '@/utils/tokens.json';
import { frameData } from 'framer-motion';
import DataUtil from '@/utils/datautil';
import { bigNumberJsonToString } from '@/utils/contract';
import { BigNumber } from 'ethers';
import { useConnectWallet } from '@/state/chain/hooks';
import { useWallet } from '@solana/wallet-adapter-react';

// import { useResultModal } from '@/state/base/hooks';
// import { useMessage, useTransactionMined, useWallet } from '@/hooks';

let form = new FormData();

type IProps = {
  back: () => void;
};
const Create: FC<IProps> = ({ back }: IProps): ReactElement => {
  const router = useRouter();
  const [list, fetchCells] = useCells();
  const [, handResultModal] = useResultModal();
  const [, connectWallet] = useConnectWallet();

  // const { toastSuccess, toastError } = useToast();

  // const [, { awaitTransactionMined }, hash] = useTransactionMined();

  const [, handTokensModal] = useTokensModal();
  const [, handRequestTypeModal] = useRequestTypeModal();
  const { wallet, publicKey, connected } = useWallet();

  // const { account, chainId, factory, wallet, switchNetwork, walletReady } = useWallet();
  const [loading, setLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');
  const [errorTag, setErrorTag] = useState('');

  const requestTypes = [
    { type: 'GET', value: 'GET' },
    { type: 'POST', value: 'POST' }
  ];

  const tokenList = [
    { symbol: 'BNB', decimals: 18, describe: 'Binance coin', value: 'BNB' },
    { symbol: 'USDT', decimals: 18, describe: 'Usdt', value: 'USDT' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requestURL: '',
    requestParams: '',
    requestType: '',
    price: '',
    denom: '',
    logoFile: null

    // name: 'translate 2',
    // description: 'translate',
    // requestURL: 'https://api.aicell.world/v1/ai/text-to-en',
    // requestParams: '{"text":""}',
    // requestType: 'POST',
    // price: '0.01',
    // denom: 'BNB',
    // logoFile: null

    // name: 'image-gen',
    // description: 'image gen',
    // requestURL: 'https://api.aicell.world/v1/ai/image-gen-dev',
    // requestParams: '{"text":""}',
    // requestType: 'POST',
    // price: '0.01',
    // denom: 'BNB',
    // logoFile: null
  });

  const btn_disable = useMemo(() => {
    return !connected || Object.values(formData).filter((ele) => !ele).length > 0;
  }, [connected, formData]);

  const handUpload = () => {
    if (typeof document === 'undefined') return;
    (document.querySelector('#avatarFiles') as any).click();
  };

  const onUpload = (e: any) => {
    let files: any;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    setFormData((state: any) => ({
      ...state,
      logoFile: files[0]
    }));
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarSrc(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  const parseLog = (log: any) => {
    try {
      // const res: any = factory.contract.interface.parseLog(log);
      // const data: any = DataUtil.deepCopy(res);
      // for (let i = 0; i < res.args.length; i++) {
      //   data.args[i] = bigNumberJsonToString(res.args[i]);
      // }
      return log;
    } catch (e) {
      console.warn('PaymentEvent unknown event:', log);
      // throw e;
      return null;
    }
  };

  const submit = async () => {
    try {
      if (!connected) return;

      setLoading(true);

      if (formData.requestURL.indexOf('https://') === -1 && formData.requestURL.indexOf('http://') === -1) {
        setErrorTag('url');
        notification.error({
          message: 'Invalid URL'
        });
        return;
      }

      try {
        const data = JSON.parse(formData.requestParams);
        console.log('data', data, formData.requestParams);
        if (data.constructor !== Object) throw new Error('Invalid Params');
      } catch (error: any) {
        setErrorTag('params');
        notification.error({
          message: 'Invalid Params'
        });
        return;
      }
      if ($BigNumber(formData.price).lt(0.001)) throw new Error('Price is less than 0.001');

      setErrorTag('');
      form = new FormData();

      // const tokeninfo = (tokens as any)[chainId][formData.denom];
      // const price = $shiftedBy(formData.price, tokeninfo.decimals);

      form.append('owner', publicKey.toBase58());
      form.append('requestURL', formData.requestURL);
      form.append('requestParams', formData.requestParams);
      form.append('requestType', formData.requestType);
      form.append('name', formData.name);
      form.append('description', formData.description);

      form.append('price', price);
      // form.append('denom', tokeninfo.address);
      // form.append('tokeninfo', JSON.stringify(tokeninfo));
      form.append('logoFile', formData.logoFile);

      handResultModal({
        open: true,
        type: 'wating'
      });

      const { code, data, error }: any = await Server.submitCell(form);
      if (code !== 0) throw new Error(error);

      // const transaction = factory.create(account, data.tokenURL, data.encryptURL, data.denom, data.price);
      // const { transactionState, hash } = await awaitTransactionMined(transaction);
      // console.log('hash::', hash);

      // setLoading(false);
      // if (transactionState === TransactionState.SUCCESS) {
      //   handResultModal({
      //     open: true,
      //     type: 'success',
      //     hash: hash
      //   });
      //   updateCell(data.cellId, hash);
      //   // notification.success({message: 'Create Successfully'});
      // } else {
      //   handResultModal({
      //     open: true,
      //     type: 'fail',
      //     hash: hash
      //   });
      //   throw new Error('Create Fail');
      // }
    } catch (error: any) {
      handResultModal({
        open: true,
        type: 'fail'
      });
      notification.error({
        message: error.reason || error.message || 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCell = async (cellId: string, txhash: string) => {
    try {
      const transactionInfo = await wallet.getTransactionReceipt(txhash);

      alert('parseLog function');
      const datas = await parseLog(transactionInfo.logs[1]);
      console.log('datas', datas);
      const params = {
        tokenId: BigNumber.from(datas.args.tokenId).toString(),
        cellAddress: datas.args.cell,
        txhash,
        cellId
      };

      const { code, data, error }: any = await Server.updateCell(params);
      if (code !== 0) throw new Error(error);
      fetchCells();
      notification.success({
        message: 'Create Successfully'
      });
    } catch (error: any) {
      notification.error({
        message: error.reason || error.message || 'Create Fail'
      });
    } finally {
      setLoading(false);
    }
  };

  const onChangeRequestType = useCallback((info: Record<string, any>) => {
    setFormData((state) => ({ ...state, requestType: info.value }));
  }, []);

  const onChangeToken = useCallback((info: Record<string, any>) => {
    setFormData((state) => ({ ...state, denom: info.value }));
  }, []);

  const onInputChange = (e: ChangeEvent<any>, key: string) => {
    setFormData((state) => ({ ...state, [key]: e?.target ? e.target.value : e }));
  };

  return (
    <>
      <Full>
        <Content>
          <Header>
            <IconBack className="back" onClick={() => back()} />
            Create New Cell
            <Tooltip placement="right" title={'Create your interface, supporting everyone to call it.'}>
              <IconWen className="wenhao" />
            </Tooltip>
          </Header>

          <ApiSetting>
            <Line>
              <FromBlock>
                <Label>Name</Label>
                <InputContent value={formData.name} onChange={(e: any) => onInputChange(e, 'name')} />
              </FromBlock>
              <FromBlock>
                <Label>Type</Label>
                <SelectView className={cn(!formData.requestType ? 'empty' : '', formData.requestType ? '_value' : '')} onClick={() => handRequestTypeModal(true)}>
                  {formData.requestType ? <Type>{formData.requestType}</Type> : <Empty>Select type</Empty>}
                  <IconDown />
                </SelectView>
              </FromBlock>
            </Line>
            <Line>
              <FromBlock>
                <Label>URL</Label>
                <InputContent className={errorTag === 'url' ? '_error' : ''} value={formData.requestURL} onChange={(e: any) => onInputChange(e, 'requestURL')} />
              </FromBlock>
            </Line>
            <Line>
              <FromBlock>
                <Label>Params（JSON）</Label>
                <TextArea className={errorTag === 'params' ? '_error' : ''} value={formData.requestParams} onChange={(e: any) => onInputChange(e, 'requestParams')} />
              </FromBlock>
            </Line>
            <Line>
              <FromBlock>
                <Label>Description</Label>
                <TextArea value={formData.description} onChange={(e: any) => onInputChange(e, 'description')} />
              </FromBlock>
              <FromBlock>
                <Label>Logo</Label>
                <PhotoBlock onClick={handUpload}>
                  {avatarSrc ? (
                    <Avatar src={avatarSrc} />
                  ) : (
                    <>
                      <UploadFile id="avatarFiles" type="file" accept="image/*" onChange={(e: any) => onUpload(e)} />
                      <UpLoadIcon src="/images/home/upload.svg" />
                      <UploadTip>
                        Drag & Drop or <span>Choose file</span> to upload <br />
                        JPG or GIF
                      </UploadTip>
                    </>
                  )}
                </PhotoBlock>
              </FromBlock>
            </Line>
          </ApiSetting>

          <FeeSetting>
            <Title>
              Fee Setting
              <Tooltip placement="right" title={'Please fill your information so we can get in touch with you.'}>
                <IconWen className="wenhao" />
              </Tooltip>
            </Title>
            <FeeContent>
              <FeeItem>
                <FeeLabel>Token</FeeLabel>
                <SelectView className={cn(!formData.denom ? 'empty' : '')} onClick={() => handTokensModal(true)}>
                  {formData.denom ? (
                    <Token>
                      <TokenIcon src={`/images/tokens/${formData.denom}.png`} />
                      {formData.denom}
                    </Token>
                  ) : (
                    <Empty>Select token</Empty>
                  )}

                  <IconDown />
                </SelectView>
              </FeeItem>
              <FeeItem>
                <FeeLabel>Price</FeeLabel>
                <InputContent
                  value={formData.price}
                  onChange={(e: any) => {
                    onInputChange($filterNumber(e), 'price');
                  }}
                />
              </FeeItem>
            </FeeContent>
          </FeeSetting>

          {!connected ? (
            <Submit
              onClick={() => {
                connectWallet('m');
              }}
            >
              Connect Wallet
            </Submit>
          ) : (
            <>
              {!connected ? (
                <Submit
                  onClick={() => {
                    // switchNetwork();
                  }}
                >
                  Connect to BNB Chain
                </Submit>
              ) : (
                <Submit disabled={!!btn_disable} loading={loading} onClick={submit}>
                  Submit
                </Submit>
              )}
            </>
          )}
        </Content>
      </Full>

      <RequestTypeModal list={requestTypes} value={formData.requestType} onChange={onChangeRequestType} />
      <TokensModal list={tokenList} value={formData.denom} onChange={onChangeToken} />
    </>
  );
};

const Full = styled.div`
  padding: 0.68rem 0.12rem 0.72rem;
  @media screen and (max-width: 768px) {
    padding-top: 0.2rem;
  }
`;

const Content = styled.div`
  border-radius: 32px;
  width: 6.1rem;
  margin: 0 auto;
  padding: 0 0.16rem 0.24rem;
  border-radius: 0.24rem;
  border: 1px solid #f1eaf0;
  background: #fff;
  /* position: relative;
    top: 50%;
    transform: translateY(-50%); */
  max-width: 100%;
`;

const Header = styled.div`
  width: 100%;
  margin: 0 auto;
  height: 0.72rem;
  display: flex;
  align-items: center;
  justify-content: center;

  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.2rem;
  font-weight: 600;
  position: relative;
  /* padding: 0 0.16rem; */
  border-bottom: 1px solid #efefef;
  .back {
    width: 0.24rem;
    cursor: pointer;
    margin-right: 0.08rem;
    position: absolute;
    left: 0rem;
    top: 50%;
    transform: translateY(-50%);
    color: #7d7d7d;
    transition: all 0.2s;
    &:hover {
      color: #db00ff;
    }
  }
  .wenhao {
    margin-left: 0.08rem;
    width: 0.19rem;
    color: #7d7d7d;
    transition: all 0.2s;
  }
`;

const ApiSetting = styled.section`
  margin-top: 0.24rem;
`;

const Line = styled.section`
  display: flex;
  align-items: center;
  margin-bottom: 0.16rem;
  &:last-child {
    margin-bottom: 0;
  }
  & > div {
    margin-right: 0.16rem;
    &:last-child {
      margin-right: 0;
    }
  }
`;
const FromBlock = styled.div`
  flex: 1;
`;
const Label = styled.div`
  margin-bottom: 0.04rem;
  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.24rem; /* 171.429% */
`;
const InputContent = styled(Input)`
  height: 0.56rem;
  border-radius: 0.12rem;
  background: #f9f9f9 !important;
  border: 1px solid #f9f9f9;
  color: #170f49;
  font-feature-settings: 'clig' off, 'liga' off;
  /* font-size: 0.14rem; */
  font-style: normal;
  font-weight: 400;
  padding: 0 0.16rem;
  &._error {
    border-color: #cc3847 !important;
  }
  &:hover {
    border-color: #f1f2f4;
  }
`;

const SelectView = styled.div`
  width: 100%;
  height: 0.56rem;
  border-radius: 0.12rem;
  border: 1px solid #e6e6e6;
  background: #fff;
  box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.03);
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 0.16rem;
  transition: all 0.2s;
  & > svg {
    width: 0.16rem;
    height: 0.16rem;
    position: absolute;
    right: 0.19rem;
    top: 50%;
    color: #a4aebc;
    transform: translateY(-50%);
  }
  &.empty {
    background: #fc72ff;
    box-shadow: none;
    transition: all 0.2s;
    border: 0;
    border-color: rgba(0, 0, 0, 0);
    &:hover {
      background: #fa59ff;
    }
    & > svg {
      color: #fff;
    }
  }
  &._value {
    transition: all 0.2s;
    &:hover {
      /* background: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%), #fff; */
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%), #fff;
      box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.03);
    }
  }
`;

const Empty = styled.div`
  color: #fff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.24rem;
`;

const Type = styled.div`
  color: #170f49;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.24rem;
`;
const Token = styled.div`
  display: flex;
  align-items: center;
  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 600;
  line-height: 0.32rem; /* 228.571% */
`;
const TokenIcon = styled.img`
  width: 0.18rem;
  height: 0.18rem;
  margin-right: 0.06rem;
`;

const TextArea = styled(Input.TextArea)`
  max-height: 1rem !important;
  min-height: 1rem !important;
  border-radius: 0.12rem;
  background: #f9f9f9 !important;
  color: #170f49;
  font-feature-settings: 'clig' off, 'liga' off;
  /* font-size: 0.14rem; */
  font-style: normal;
  font-weight: 400;
  padding: 0.16rem;
  &._error {
    border-color: #cc3847 !important;
  }
`;

const PhotoBlock = styled.div`
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px dashed #fc72ff;
  border-radius: 0.12rem;
  position: relative;
  cursor: pointer;
  background: #f9f9f9 !important;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
  &:hover {
    &::after {
      transition: all 0.2s;
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
`;
const Avatar = styled.img`
  width: 0.5rem;
`;
const UpLoadIcon = styled.img`
  width: 0.24rem;
  height: 0.24rem;
  margin-bottom: 0.08rem;
`;
const UploadTip = styled.p`
  color: #6a7b93;
  font-size: 0.12rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.18rem; /* 150% */
  text-align: center;
  span {
    color: #db00ff;
  }
`;

const UploadFile = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: -1;
`;

const FeeSetting = styled.section`
  margin-top: 0.24rem;
`;
const Title = styled.h4`
  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 600;
  line-height: 0.32rem; /* 200% */
  display: flex;
  align-items: center;
  margin-bottom: 0.08rem;
  .wenhao {
    margin-left: 0.08rem;
    width: 0.19rem;
    color: #7d7d7d;
    transition: all 0.2s;
    position: relative;
    top: 0.02rem;
  }
`;

const FeeContent = styled.div`
  display: flex;
  align-items: center;
`;
const FeeItem = styled.div`
  flex: 1;
  &:first-child {
    margin-right: 0.16rem;
  }
`;
const FeeLabel = styled.div`
  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.24rem; /* 171.429% */
  margin-bottom: 0.04rem;
`;

const Submit = styled(Button)`
  width: 100%;
  height: 0.56rem;
  background: #fc72ff;
  color: #fff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.2rem;
  font-weight: 500;
  margin-top: 0.32rem;
  border: none !important;
  border-radius: 0.12rem;
  transition: all 0.2s;
  &:hover {
    background: #fa59ff;
  }
  &.ant-btn-default:not(:disabled):not(.ant-btn-disabled):active,
  &.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
    color: #fff;
    border-color: #fc72ff;
  }
  &:disabled {
    background: #f7f7f7 !important;
    color: #bebebe !important;
  }
  &.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
    color: #fff;
  }
`;

export default Create;
