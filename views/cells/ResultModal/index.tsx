import { FC, ReactElement } from 'react';

import { Modal } from 'antd';
import styled from 'styled-components';
import { IconClose } from '@/components/Icon';
import { useScan } from '@/hooks';
// import { useWallet } from '@solana/wallet-adapter-react';

import { useIsCreate, useResultModal } from '@/state/cells/hooks';

const ResultModal: FC = (): ReactElement => {
  const { getScanAddress } = useScan();
  const [resultInfo, handResultModal] = useResultModal();
  const [, setIsCreate] = useIsCreate();

  const seeHistory = () => {
    handResultModal({ open: false });
    setIsCreate(false);
  };

  return (
    <Modals style={{ top: '20%' }} footer={null} open={resultInfo.open}>
      <Header>
        Submit cell
        <IconClose
          onClick={() => {
            if (resultInfo.type === 'success') {
              setIsCreate(false);
            }
            handResultModal({ open: false });
          }}
        />
      </Header>

      {resultInfo.type === 'wating' && (
        <Wating>
          <WatingIcon src="/images/dialog/wating.svg" />
          <Title>submiting...</Title>
          <Notic>
            <WainIcon src="/images/dialog/wain.svg" />
            Please do not leave this page until the transaction is successful.
          </Notic>
          <Tip>Process in your wallet</Tip>
        </Wating>
      )}

      {resultInfo.type === 'success' && (
        <Success>
          <StatusIcon src="/images/dialog/success.svg" />
          <Status>Created Successfully</Status>
          <SeeScan href={`${getScanAddress(resultInfo.hash, 'tx')}`} target="_blank">
            View on BscScan
          </SeeScan>
          <SeeHistory onClick={seeHistory}>
            <HistoryIcon src="/images/dialog/history.svg" />
            Back to “Your Cell”
          </SeeHistory>
          <CloseBtn
            onClick={() => {
              if (resultInfo.type === 'success') {
                setIsCreate(false);
              }
              handResultModal({ open: false });
            }}
          >
            Close
          </CloseBtn>
        </Success>
      )}

      {resultInfo.type === 'fail' && (
        <Fail>
          <StatusIcon src="/images/dialog/fail.svg" />
          <Status>Created Failed</Status>
          {resultInfo.hash && (
            <SeeScan href={`${getScanAddress(resultInfo.hash, 'tx')}`} target="_blank">
              View on BscScan
            </SeeScan>
          )}

          <SeeHistory className="fail"></SeeHistory>
          <CloseBtn onClick={() => handResultModal({ open: false })}>Close</CloseBtn>
        </Fail>
      )}
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

      padding: 0.14rem 0.2rem 0;
      min-height: 1.5rem;
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
  color: #170f49;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.24rem;
  svg {
    width: 0.12rem;
    color: #6f6c90;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #db00ff;
    }
  }
`;

const Wating = styled.section`
  padding: 0.58rem 0 0.24rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const WatingIcon = styled.img`
  width: 0.76rem;
  height: 0.76rem;
  animation: rotate 1s linear infinite;
`;
const Title = styled.h5`
  margin: 0.16rem 0 0.14rem;
  color: #170f49;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  font-weight: 500;
  line-height: 0.24rem; /* 150% */
`;
const Notic = styled.div`
  width: 100%;
  margin-bottom: 0.14rem;
  border-radius: 0.16rem;
  background: #f9f9f9;
  padding: 0.12rem 0.12rem 0.12rem 0.32rem;
  position: relative;
  color: #7d7d7d;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.12rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.18rem; /* 150% */
`;
const WainIcon = styled.img`
  width: 0.14rem;
  height: 0.14rem;
  position: absolute;
  top: 0.16rem;
  left: 0.12rem;
`;
const Tip = styled.p`
  color: #6f6c90;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.24rem; /* 171.429% */
`;

const Success = styled.section`
  padding: 0.46rem 0 0.32rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Fail = styled(Success)``;
const StatusIcon = styled.img`
  height: 0.32rem;
`;

const Status = styled.h4`
  color: #170f49;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.2rem;
  font-style: normal;
  font-weight: 600;
  line-height: 0.24rem; /* 120% */
  margin-top: 0.15rem;
`;
const SeeScan = styled.a`
  color: #fc72ff;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.2rem;
  text-decoration-line: underline;
  margin-top: 0.12rem;
  &:hover {
    color: #fc72ff;
  }
`;
const SeeHistory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.08rem;
  height: 0.32rem;
  margin: 0.24rem;
  border-radius: 0.08rem;
  background: #f9f9f9;
  cursor: pointer;

  color: #fc72ff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-weight: 500;
  &.fail {
    background: none;
  }
`;
const HistoryIcon = styled.img`
  height: 0.14rem;
  margin-right: 0.08rem;
`;
const CloseBtn = styled.div`
  width: 0.88rem;
  height: 0.32rem;
  line-height: 0.32rem;
  border-radius: 0.1rem;
  background: #fc72ff;
  color: #fff;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.14rem;
  font-weight: 500;
  cursor: pointer;
`;
export default ResultModal;
