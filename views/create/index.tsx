import cn from 'classnames';
import ps from './styles/index.module.scss';
import { Button, Dropdown, Input } from 'antd';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { IconDown } from '@/components/Icon';
import { $filterNumber } from '@/utils/met';

const { TextArea } = Input;

const Create: React.FC = () => {
  const [avatarSrc, setAvatarSrc] = useState<string>('');
  const [errorTag, setErrorTag] = useState('');

  const [typeOpen, setTypeOpen] = useState<boolean>(false);
  const typeRef = useRef<HTMLDivElement | null>(null);

  const [tokenOpen, setTokenOpen] = useState<boolean>(false);
  const tokenRef = useRef<HTMLDivElement | null>(null);

  const requestTypes = [
    { type: 'GET', value: 'GET' },
    { type: 'POST', value: 'POST' }
  ];
  const tokenList = [{ symbol: 'SOL', decimals: 9, describe: 'solana', value: 'SOL' }];

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

  const onChangeRequestType = useCallback((info: Record<string, any>) => {
    setFormData((state) => ({ ...state, requestType: info.value }));
    setTypeOpen(false);
  }, []);

  const onChangeToken = useCallback((info: Record<string, any>) => {
    setFormData((state) => ({ ...state, denom: info.value }));
    setTokenOpen(false);
  }, []);

  const onInputChange = (e: ChangeEvent<any>, key: string) => {
    setFormData((state) => ({ ...state, [key]: e?.target ? e.target.value : e }));
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
        <div className={ps.tit}>Create gear</div>

        <section className={ps['sub-tit']}>
          <div>Basic information</div>
          <div>Please select an API gear and enter a command to call it.</div>
        </section>

        <section className={ps.name}>
          <div>Name</div>
          <Input placeholder="" value={formData.name} onChange={(e: any) => onInputChange(e, 'name')} />
        </section>

        <section className={ps['logo-des']}>
          <div className={ps.logo}>
            <div>Logo</div>
            <div onClick={handUpload}>
              {avatarSrc ? (
                <>
                  <img src={avatarSrc} alt="" className={ps['avatar-img']} />
                </>
              ) : (
                <>
                  <input type="file" className={ps.file} id="avatarFiles" accept="image/*" onChange={(e) => onUpload(e)} />
                  <img src="/images/create/1.svg" alt="" className={ps['upload-icon']} />
                  <div className={ps['upload-tip']}>
                    Drag & Drop or <span>Choose file</span> to upload <br />
                    JPG or GIF
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={ps.des}>
            <div>Description</div>
            <div>
              <TextArea placeholder="" value={formData.description} onChange={(e: any) => onInputChange(e, 'description')} />
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
                {formData.requestType ? formData.requestType : <span></span>}
                <IconDown />
              </div>
              <div className={cn(ps['down-items'], { [ps['open-down']]: typeOpen })}>
                {/* <div>Select Type</div> */}
                {requestTypes.map((ele) => (
                  <div key={ele.value} onClick={() => onChangeRequestType(ele)}>
                    {ele.type}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={ps.url}>
            <div>URL</div>
            <Input className={errorTag === 'url' ? ps['_error'] : ''} value={formData.requestURL} onChange={(e: any) => onInputChange(e, 'requestURL')} />
          </div>
        </section>

        <section className={ps.params}>
          <div>Params（JSON）</div>
          <div>
            <TextArea className={errorTag === 'params' ? ps['_error'] : ''} value={formData.requestParams} onChange={(e: any) => onInputChange(e, 'requestParams')} placeholder="" />
          </div>
        </section>

        <section className={ps['token-price']}>
          <div>Price Setting</div>
          <div>Please select an API gear and enter a command to call it.</div>
          <div>
            <div>
              <div>Token</div>
              <div className={ps['down-group']} ref={tokenRef}>
                <div
                  onClick={() => {
                    setTokenOpen(!tokenOpen);
                  }}
                >
                  {formData.denom ? formData.denom : <span></span>}
                  <IconDown />
                </div>
                <div className={cn(ps['down-items'], ps['down-tokens'], { [ps['open-down']]: tokenOpen })}>
                  <div>Select Token</div>
                  {tokenList.map((ele) => (
                    <div key={ele.value}>
                      <img src={`/images/tokens/${ele.symbol}.png`} alt="" />
                      <div onClick={() => onChangeToken(ele)}>
                        <div>{ele.symbol}</div>
                        <div>{ele.describe}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={ps.url}>
              <div>Price</div>
              <Input
                value={formData.price}
                onChange={(e: any) => {
                  onInputChange($filterNumber(e), 'price');
                }}
              />
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
