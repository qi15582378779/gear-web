import cn from 'classnames';
import ps from './styles/index.module.scss';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { IconDown } from '@/components/Icon';

const { TextArea } = Input;

const Create: React.FC = () => {
  const [avatarSrc, setAvatarSrc] = useState<string>('');

  const [typeOpen, setTypeOpen] = useState<boolean>(false);
  const typeRef = useRef<HTMLDivElement | null>(null);

  const [tokenOpen, setTokenOpen] = useState<boolean>(false);
  const tokenRef = useRef<HTMLDivElement | null>(null);

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
    // setFormData((state: any) => ({
    //   ...state,
    //   logoFile: files[0]
    // }));
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarSrc(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (typeOpen && typeRef.current && !typeRef.current.contains(event.target as Node)) {
      setTypeOpen(false);
    }

    if (tokenOpen && tokenRef.current && !tokenRef.current.contains(event.target as Node)) {
      setTokenOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [typeOpen, tokenOpen]);

  return (
    <div className={ps.full}>
      <div className={ps.container}>
        <div className={ps.tit}>Create cell</div>

        <section className={ps['sub-tit']}>
          <div>Basic information</div>
          <div>Please select an API cell and enter a command to call it.</div>
        </section>

        <section className={ps.name}>
          <div>Name</div>
          <Input placeholder="" />
        </section>

        <section className={ps['logo-des']}>
          <div className={ps.logo}>
            <div>Logo</div>
            <div onClick={handUpload}>
              <input type="file" className={ps.file} id="avatarFiles" accept="image/*" onChange={(e) => onUpload(e)} />
              <img src="/images/create/1.svg" alt="" className={ps['upload-icon']} />
              <div className={ps['upload-tip']}>
                Drag & Drop or <span>Choose file</span> to upload <br />
                JPG or GIF
              </div>
            </div>
          </div>

          <div className={ps.des}>
            <div>Description</div>
            <div>
              <TextArea placeholder="eg: URL: https://www.linkloud.com/po" />
            </div>
          </div>
        </section>

        <section className={ps['type-url']}>
          <div className={ps.type}>
            <div>Type</div>
            <div className={ps['down-group']} ref={typeRef}>
              <div
                onClick={() => {
                  setTypeOpen(!typeOpen);
                }}
              >
                Get
                <IconDown />
              </div>
              <div className={cn(ps['down-items'], { [ps['open-down']]: typeOpen })}>
                <div>Select Type</div>
                <div>Get</div>
                <div>Post</div>
              </div>
            </div>
          </div>
          <div className={ps.url}>
            <div>URL</div>
            <Input />
          </div>
        </section>

        <section className={ps.params}>
          <div>Params（JSON）</div>
          <div>
            <TextArea placeholder="eg: URL: https://www.linkloud.com/po" />
          </div>
        </section>

        <section className={ps['token-price']}>
          <div>Price Setting</div>
          <div>Please select an API cell and enter a command to call it.</div>
          <div>
            <div>
              <div>Token</div>
              <div className={ps['down-group']} ref={tokenRef}>
                <div
                  onClick={() => {
                    setTokenOpen(!tokenOpen);
                  }}
                >
                  Get
                  <IconDown />
                </div>
                <div className={cn(ps['down-items'], ps['down-tokens'], { [ps['open-down']]: tokenOpen })}>
                  <div>Select Token</div>
                  <div>
                    <img src="/images/tokens/USDC.png" alt="" />
                    <div>
                      <div>USDC</div>
                      <div>Usdc</div>
                    </div>
                  </div>
                  <div>
                    <img src="/images/tokens/USDC.png" alt="" />
                    <div>
                      <div>USDC</div>
                      <div>Usdc</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={ps.url}>
              <div>Price</div>
              <Input />
            </div>
          </div>
        </section>

        <Button block className={ps['submit-btn']}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Create;
