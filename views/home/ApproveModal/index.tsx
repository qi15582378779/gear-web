import { FC, ReactElement } from 'react';

import { Modal } from 'antd';
import styled from 'styled-components';
import { IconClose } from '@/components/Icon';
import { useScan } from '@/hooks';
import { useApproveDialog, useHasNewHistory, useHistoryDialog, useResultModal } from '@/state/call/hooks';

const ApproveModal: FC = (): ReactElement => {
  const { getScanAddress } = useScan();
  const [resultInfo, handResultModal] = useResultModal();
  const [approveResultDialog, handApproveResultModal] = useApproveDialog();
  const [, handShowHistoryModal] = useHistoryDialog();
  const [, handHasNewHistory] = useHasNewHistory();

  const seeHistory = () => {
    handResultModal({ open: false });
    handHasNewHistory(false);
    handShowHistoryModal(true);
  };

  return (
    <Modals style={{ top: '20%' }} footer={null} open={approveResultDialog.open}>
      <Header>
        Review call
        <IconClose onClick={() => handApproveResultModal({ open: false })} />
      </Header>
      <Section>
        <Block>
          {approveResultDialog.step === 'approve' && approveResultDialog.type === 'wating' && (
            <Approve>
              <Symbol>
                <SymbolIcon src="/images/tokens/USDT.png" />
              </Symbol>
              Approve in wallet
            </Approve>
          )}

          {approveResultDialog.step === 'approve' && approveResultDialog.type === 'pending' && (
            <Pending>
              <Loading src="/images/home/pending.svg" />
              Approve pending...
            </Pending>
          )}

          {(approveResultDialog.step === 'call' || ['success', 'fail'].includes(approveResultDialog.type)) && (
            <>
              <Approveed>
                <SymbolEnd src="/images/home/usdt-end.svg" />
                Approve USDT spending
              </Approveed>
              <Status src={`/images/dialog/${approveResultDialog.step === 'call' ? 'success' : approveResultDialog.type === 'success' ? 'success' : 'fail'}.svg`}></Status>
            </>
          )}
        </Block>
        <Line></Line>
        <Block>
          {approveResultDialog.step === 'approve' && (
            <CallBefore>
              <CallBeforeIcon src="/images/home/confirm.svg" />
              Confirm Call
            </CallBefore>
          )}

          {approveResultDialog.step === 'call' && approveResultDialog.type === 'wating' && (
            <CallInit>
              <Call>
                <CallIcon src="/images/home/confirm-ready.svg" />
              </Call>
              Confirm Call
            </CallInit>
          )}

          {approveResultDialog.step === 'call' && approveResultDialog.type === 'pending' && (
            <Pending>
              <Loading src="/images/home/pending.svg" />
              Call pending...
            </Pending>
          )}
        </Block>

        <Interface>
          Select Interface:
          <img src={approveResultDialog.callInfo.logoFile} alt="" />
          {approveResultDialog.callInfo.name}
        </Interface>
      </Section>
    </Modals>
  );
};
// animation: rotate 1s linear infinite;
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

const Section = styled.div`
  padding: 0.32rem 0 0.24rem;
`;
const Block = styled.div`
  display: flex;
  align-items: center;
  height: 0.32rem;
  position: relative;
`;
const Approve = styled.div`
  display: flex;
  align-items: center;
  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: 'Source Sans 3';
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 600;
`;
const Symbol = styled.div`
  width: 0.32rem;
  height: 0.32rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  /* border: 1.5px solid #d5d5d5; */
  margin-right: 0.12rem;
  position: relative;
  &::before {
    content: '';
    width: 0.32rem;
    height: 0.32rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    border: 1.5px solid #d5d5d5;
    border-radius: 50%;
    transform-origin: center center;
    animation: round 2s infinite linear;
  }
`;
const SymbolIcon = styled.img`
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  position: relative;
  z-index: 3;
`;
const Pending = styled(Approve)``;
const Loading = styled.img`
  width: 0.32rem;
  height: 0.32rem;
  animation: rotate 2s infinite linear;
  margin-right: 0.12rem;
`;
const Approveed = styled(Approve)``;
const SymbolEnd = styled.img`
  width: 0.32rem;
  height: 0.32rem;
  margin-right: 0.12rem;
`;
const Status = styled.img`
  height: 0.16rem;
  position: absolute;
  right: 0.05rem;
  top: 50%;
  transform: translateY(-50%);
`;

const Line = styled.div`
  width: 0.04rem;
  height: 0.52rem;
  margin: 0.1rem 0;
  background: #d5d5d5;
  position: relative;
  margin-left: 0.13rem;
`;

const CallBefore = styled(Approve)``;
const CallBeforeIcon = styled(SymbolEnd)``;
const CallInit = styled(Approve)``;
const Call = styled(Symbol)``;
const CallIcon = styled(SymbolIcon)``;
const Interface = styled.div`
  margin-top: 0.48rem;
  display: flex;
  align-items: center;
  justify-content: center;

  color: #7d7d7d;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: 'Source Sans 3';
  font-size: 0.14rem;
  font-style: normal;
  font-weight: 400;
  height: 0.24rem; /* 171.429% */
  img {
    width: 0.16rem;
    height: 0.16rem;
    margin: 0 0.04rem 0 0.06rem;
    border-radius: 50%;
  }
`;

export default ApproveModal;
