import { Popover } from "antd";
import React, { useState } from "react";
import { $hash } from "../../utils/met";
import ps from "./index.module.scss";
import cn from "classnames";

const TooltipLine = ({ name = "", index = 0, length = null, clamp = "", placement = "right" }) => {
  const [show, setShow] = useState<boolean>(false);
  const [tag, setTag] = useState(-1);

  const customStyle: any = {
    ...(clamp ? { "-webkit-line-clamp": clamp } : {})
  };

  // const handleMouseEnter = (e: any, index: number) => {
  //   // console.log(e.target.scrollHeight, e.target.offsetHeight, name);
  //   if (clamp) {
  //     if (e.target.scrollHeight > e.target.offsetHeight) {
  //       setShow(true);
  //       setTag(index);
  //     } else {
  //       setShow(false);
  //       setTag(-1);
  //     }
  //   } else {
  //     if (e.target.scrollWidth > e.target.offsetWidth || (length && String(name).length > length)) {
  //       setShow(true);
  //       setTag(index);
  //     } else {
  //       setShow(false);
  //       setTag(-1);
  //     }
  //   }
  // };

  const handleMouseEnter = (e: any, index: number) => {
    const isClamp = clamp;
    const isLongText = length && String(name).length > length;

    const shouldShow: boolean = isClamp ? e.target.scrollHeight > e.target.offsetHeight ?? false : (e.target.scrollWidth > e.target.offsetWidth || isLongText) ?? false;

    setShow(shouldShow);
    setTag(shouldShow ? index : -1);
  };

  const handleMouseLeave = () => {
    setShow(false);
    setTag(-1);
  };

  return (
    <Popover overlayClassName={"text-tip-popover"} content={<div className={cn(ps["tip-txt"], { [ps["top-width"]]: placement === "top" })}>{name}</div>} placement={placement as any} open={show && tag === index}>
      <div className={cn(ps.text, clamp ? [ps["clamp-text"]] : [ps["line-text"]])} style={customStyle} onMouseEnter={(e: any) => handleMouseEnter(e, index)} onMouseLeave={handleMouseLeave}>
        {length ? `#${$hash(name, length, 0)}` : name}
      </div>
    </Popover>
  );
};

export default TooltipLine;
