import { IconCopy, CopyAfterIcon } from '@/components/Icon';
import { FC, ReactElement, useState } from 'react';
import styled from 'styled-components';

type IProps = {
  copy: () => any;
  className: any;
};
const Copy: FC<IProps> = ({ copy, className }): ReactElement => {
  const [isAfterIcon, setIsAfterIcon] = useState<boolean>(false);
  const handleCopy = () => {
    copy();
    setIsAfterIcon(true);
    setTimeout(() => {
      setIsAfterIcon(false);
    }, 6000);
  };

  return (
    <IconCopyView
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (!isAfterIcon) {
          handleCopy();
        }
      }}
    >
      {isAfterIcon ? <CopyAfterIcon className="success" /> : <IconCopy className="copy" />}
    </IconCopyView>
  );
};

const IconCopyView = styled.i`
  font-style: normal;
  display: flex;
  align-items: center;
  width: 0.12rem;
  height: 0.12rem;
  color: #222;
  transition: all 0.2s;
  margin-left: 0.04rem;

  svg {
    width: 100%;
    height: 100%;
  }

  &.copy {
    &:hover {
      color: #fc72ff !important;
    }
  }
`;

export default Copy;
