import cn from "classnames";
import ps from "./styles/index.module.scss";
import { Button, Dropdown, Input, notification } from "antd";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconDown } from "@/components/Icon";
import { $BigNumber, $filterNumber } from "@/utils/met";
import { useWallet } from "@solana/wallet-adapter-react";
import tokens from "@/utils/tokens.json";
import { useResultModal } from "@/state/gears/hooks";
import Server from "@/service";
import { useWorkspaceGear } from "@/hooks/useWorkspace";
import ResultModal from "./ResultModal";

const { TextArea } = Input;
let form = new FormData();
const Create: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [, handResultModal] = useResultModal();
  const workspace = useWorkspaceGear();

  const [loading, setLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [errorTag, setErrorTag] = useState("");

  const [typeOpen, setTypeOpen] = useState<boolean>(false);
  const typeRef = useRef<HTMLDivElement | null>(null);

  const [tokenOpen, setTokenOpen] = useState<boolean>(false);
  const tokenRef = useRef<HTMLDivElement | null>(null);

  const requestTypes = [
    { type: "GET", value: "GET" },
    { type: "POST", value: "POST" }
  ];
  const tokenList = [{ symbol: "SOL", decimals: 9, describe: "solana", value: "SOL" }];

  const [formData, setFormData] = useState<{ [key: string]: any }>({
    name: "",
    description: "",
    requestURL: "",
    requestParams: "",
    requestType: "",
    price: "",
    denom: "",
    logoFile: null

    // name: "translate 2---------",
    // description: "translate",
    // requestURL: "https://api.gearai.xyz/v1/ai/text-to-en",
    // requestParams: '{"text":""}',
    // requestType: "POST",
    // price: "0.01",
    // denom: "SOL",
    // logoFile: null

    // name: 'image-gen',
    // description: 'image gen',
    // requestURL: 'https://api.gearai.xyz/v1/ai/image-gen-dev',
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
    if (typeof document === "undefined") return;
    (document.querySelector("#avatarFiles") as any).click();
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

  const submit = async () => {
    try {
      if (!connected) return;

      setLoading(true);

      if (formData.requestURL.indexOf("https://") === -1 && formData.requestURL.indexOf("http://") === -1) {
        setErrorTag("url");
        notification.error({
          message: "Invalid URL"
        });
        return;
      }

      try {
        const data = JSON.parse(formData.requestParams);
        console.log("data", data, formData.requestParams);
        if (data.constructor !== Object) throw new Error("Invalid Params");
      } catch (error: any) {
        setErrorTag("params");
        notification.error({
          message: "Invalid Params"
        });
        return;
      }
      if ($BigNumber(formData.price).lt(0.001)) throw new Error("Price is less than 0.001");

      setErrorTag("");
      form = new FormData();

      // console.log('(tokens as any)[chainId]', tokens, chainId);
      // console.log('(tokens as any)[chainId]', (tokens as any)[chainId], chainId, formData.denom);

      const tokeninfo = (tokens as any)["devnet"][formData.denom];

      form.append("owner", publicKey!.toBase58());
      form.append("requestURL", formData.requestURL);
      form.append("requestParams", formData.requestParams);
      form.append("requestType", formData.requestType);
      form.append("name", formData.name);
      form.append("description", formData.description);

      form.append("price", formData.price);
      form.append("denom", tokeninfo.address);
      form.append("logoFile", formData.logoFile);

      handResultModal({
        open: true,
        type: "wating"
      });

      const { code, data, error }: any = await Server.submitGear(form);
      if (code !== 0) throw new Error(error);

      const { gearAddress, tx }: any = await workspace!.program.createGear(data.name, data.symbol, data.tokenURL, data.price, data.encryptURL);
      const params = {
        gearAddress: gearAddress.toBase58(),
        txhash: tx,
        gearId: data.gearId
      };

      const { code: _code, data: _data, error: _error }: any = await Server.updateGear(params);
      if (_code !== 0) throw new Error(_error);
      handResultModal({
        open: true,
        type: "success",
        hash: tx
      });
      setLoading(false);
    } catch (error: any) {
      handResultModal({
        open: true,
        type: "fail"
      });
      notification.error({
        message: error.reason || error.message || "error"
      });
    } finally {
      setLoading(false);
    }
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
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [typeOpen, tokenOpen]);

  useEffect(() => {
    return () => handResultModal({ open: false });
  }, []);

  return (
    <>
      <div className={ps.full}>
        <div className={ps.container}>
          <div className={ps.tit}>Create gear</div>

          <section className={ps["sub-tit"]}>
            <div>Basic information</div>
            <div>Please select an API gear and enter a command to call it.</div>
          </section>

          <section className={ps.name}>
            <div>Name</div>
            <Input placeholder="" value={formData.name} onChange={(e: any) => onInputChange(e, "name")} />
          </section>

          <section className={ps["logo-des"]}>
            <div className={ps.logo}>
              <div>Logo</div>
              <div onClick={handUpload}>
                {avatarSrc ? (
                  <>
                    <img src={avatarSrc} alt="" className={ps["avatar-img"]} />
                  </>
                ) : (
                  <>
                    <img src="/images/create/1.svg" alt="" className={ps["upload-icon"]} />
                    <div className={ps["upload-tip"]}>
                      Drag & Drop or <span>Choose file</span> to upload <br />
                      JPG or GIF
                    </div>
                  </>
                )}
                <input type="file" className={ps.file} id="avatarFiles" accept="image/*" onChange={(e) => onUpload(e)} />
              </div>
            </div>

            <div className={ps.des}>
              <div>Description</div>
              <div>
                <TextArea placeholder="" value={formData.description} onChange={(e: any) => onInputChange(e, "description")} />
              </div>
            </div>
          </section>

          <section className={ps["type-url"]}>
            <div className={ps.type}>
              <div>Type</div>
              <div className={ps["down-group"]} ref={typeRef}>
                <div
                  onClick={() => {
                    setTypeOpen(!typeOpen);
                  }}
                  className={cn({ [ps["down-icon"]]: typeOpen })}
                >
                  {formData.requestType ? formData.requestType : <span></span>}
                  <IconDown />
                </div>
                <div className={cn(ps["down-items"], { [ps["open-down"]]: typeOpen })}>
                  <div>Select Type</div>
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
              <Input className={errorTag === "url" ? ps["_error"] : ""} value={formData.requestURL} onChange={(e: any) => onInputChange(e, "requestURL")} />
            </div>
          </section>

          <section className={ps.params}>
            <div>Params（JSON）</div>
            <div>
              <TextArea className={errorTag === "params" ? ps["_error"] : ""} value={formData.requestParams} onChange={(e: any) => onInputChange(e, "requestParams")} placeholder="" />
            </div>
          </section>

          <section className={ps["token-price"]}>
            <div>Price Setting</div>
            <div>Please select an API gear and enter a command to call it.</div>
            <div>
              <div>
                <div>Token</div>
                <div className={ps["down-group"]} ref={tokenRef}>
                  <div
                    onClick={() => {
                      setTokenOpen(!tokenOpen);
                    }}
                    className={cn({ [ps["down-icon"]]: tokenOpen })}
                  >
                    <div>
                      {formData.denom && (
                        <>
                          <img src={`/images/tokens/${formData.denom}.png`} alt="" />
                          {formData.denom}
                        </>
                      )}
                    </div>

                    <IconDown />
                  </div>
                  <div className={cn(ps["down-items"], ps["down-tokens"], { [ps["open-down"]]: tokenOpen })}>
                    <div>Select Token</div>
                    {tokenList.map((ele) => (
                      <div key={ele.value} onClick={() => onChangeToken(ele)}>
                        <img src={`/images/tokens/${ele.symbol}.png`} alt="" />
                        <div>
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
                    onInputChange($filterNumber(e), "price");
                  }}
                />
              </div>
            </div>
          </section>

          <Button block className={ps["submit-btn"]} disabled={!!btn_disable} loading={loading} onClick={submit}>
            Submit
          </Button>
        </div>
      </div>
      <ResultModal />
    </>
  );
};

export default Create;
