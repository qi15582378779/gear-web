import { ChangeEvent, FC, ReactElement, useMemo, useState } from 'react';

import { Button, Modal } from 'antd';
import styled from 'styled-components';
import { IconClose } from '@/components/Icon';
import { useRequestTypeModal } from '@/state/cells/hooks';
import cn from 'classnames';

type IProps = {
  onChange: (data: any) => void;
  list: any[];
  value: string | number;
};

const RequestTypeModal: FC<IProps> = ({ onChange, list, value }): ReactElement => {
  const [showRequestTypeModal, handRequestTypeModal] = useRequestTypeModal();

  return (
    <Modals title="Basic Modal" style={{ top: '20%' }} footer={null} open={showRequestTypeModal} onOk={() => handRequestTypeModal(true)} onCancel={() => handRequestTypeModal(false)}>
      <Header>
        Select Type
        <IconClose onClick={() => handRequestTypeModal(false)} />
      </Header>
      <Section>
        {list.map((ele) => (
          <Item
            key={ele.value}
            className={cn(ele.value === value ? 'active' : '')}
            onClick={() => {
              onChange(ele);
              handRequestTypeModal(false);
            }}
          >
            {ele.value}
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
      /* min-height: 3.56rem; */

      padding: 0.14rem 0.2rem;
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
  color: #222;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.32rem;
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
  padding-top: 0.24rem;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 0.14rem;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.4rem;
  cursor: pointer;
  border-radius: 0.12rem;
  background: #f9f9f9;

  color: #222;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.16rem;
  border: 1px solid #f9f9f9;
  transition: all 0.2s;
  &.active,
  &:hover {
    background: #f7f8fa;
    border-color: #f1eaf0;
  }
  &:first-child {
    margin-right: 0.16rem;
  }
`;

export default RequestTypeModal;
