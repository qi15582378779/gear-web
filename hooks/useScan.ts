import { useCallback } from "react";

import { getConfig } from "@/common/config";

type IType = {
  scan: string;
  greenfieldscanScan: string;
  openscan: (value: string, type?: string) => void;
  openGreenfieldScan: (value: string, type?: string) => void;
  getScanAddress: (value: string, type?: string) => void;
  getGreenfieldScanAddress: (value: string, type?: string) => void;
};

const useScan = (): IType => {
  const env = process.env.APP_ENV;
  const scan = getConfig("scan");
  const greenfieldscanScan = getConfig("greenfieldscanScan");
  const openscan = useCallback(
    (value: string, type: string = "tx") => {
      if (typeof window === "undefined") return;
      if (env === "dev") {
        window.open(`${scan}${type}/${value}?cluster=devnet`);
      } else {
        window.open(`${scan}${type}/${value}`);
      }
    },
    [scan]
  );

  const openGreenfieldScan = useCallback(
    (value: string, type: string = "tx") => {
      if (typeof window === "undefined") return;
      if (type === "object") {
        window.open(`${greenfieldscanScan}${value}`);
      } else {
        window.open(`${greenfieldscanScan}${type}/${value}`);
      }
    },
    [greenfieldscanScan]
  );

  const getScanAddress = useCallback(
    (value: string, type: string = "tx") => {
      return `${scan}${type}/${value}`;
    },
    [scan]
  );

  const getGreenfieldScanAddress = useCallback(
    (value: string, type: string = "tx") => {
      return `${greenfieldscanScan}${type}/${value}`;
    },
    [greenfieldscanScan]
  );
  return { scan, greenfieldscanScan, openscan, openGreenfieldScan, getScanAddress, getGreenfieldScanAddress };
};
export default useScan;
