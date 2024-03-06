import { ChangeEvent, FC, ReactElement, useMemo, useState } from 'react';

import { Button, Modal } from 'antd';
import styled from 'styled-components';
import { IconClose } from '@/components/Icon';
import { useTokensModal } from '@/state/cells/hooks';
import cn from 'classnames';

type IProps = {
  onChange: (data: any) => void;
  list: any[];
  value: string | number;
};

const TokensModal: FC<IProps> = ({ onChange, list, value }): ReactElement => {
  const [showTokensModal, handTokensModal] = useTokensModal();

  return (
    <Modals title="Basic Modal" style={{ top: '20%' }} footer={null} open={showTokensModal} onOk={() => handTokensModal(true)} onCancel={() => handTokensModal(false)}>
      <Header>
        Select Token
        <IconClose onClick={() => handTokensModal(false)} />
      </Header>
      <Section>
        {list.map((ele) => (
          <Item
            key={ele.symbol}
            className={cn(ele.value === value ? 'active' : '')}
            onClick={() => {
              onChange(ele);
              handTokensModal(false);
            }}
          >
            <Icon src={`/images/tokens/${ele.symbol}.png`} />
            <Content>
              <Symbol>{ele.symbol}</Symbol>
              <Describe>{ele.describe}</Describe>
            </Content>
          </Item>
        ))}
      </Section>
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
      /* min-height: 3.56rem; */

      min-height: 2.1rem;
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
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1;
  padding: 0 0.2rem;

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
const Section = styled.section`
  padding-top: 0.16rem;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.02rem;
  cursor: pointer;
  transition: all 0.2s;
  height: 0.56rem;
  padding: 0 0.2rem;
  &.active,
  &:hover {
    background: #f7f8fa;
  }
`;
const Icon = styled.img`
  height: 0.36rem;
  margin-right: 0.2rem;
`;
const Content = styled.div``;
const Symbol = styled.div`
  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  font-weight: 400;
  line-height: 1;
`;
const Describe = styled.div`
  color: #7d7d7d;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.12rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2; /* 200% */
`;

export default TokensModal;
