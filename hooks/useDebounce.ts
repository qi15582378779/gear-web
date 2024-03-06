import { useEffect, useRef } from 'react';

function useDebounce(defalut_delay: number = 1500): [(FN?: Function, delay?: number) => Promise<void>] {
  let timer:any = useRef(null)
  const debounce:any = (FN: Function, delay: number = defalut_delay): Promise<void> => {
    return new Promise((resolve, reject) => {
      clearInterval(timer.current);
      timer.current = setTimeout(() => {
        FN && FN();
        resolve();
      }, delay);
    });
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);
  return [debounce];
}

export default useDebounce;
