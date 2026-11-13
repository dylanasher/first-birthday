import { useEffect, useState } from 'react';

function read() {
  const vv = window.visualViewport;
  return {
    width: vv ? vv.width : window.innerWidth,
    height: vv ? vv.height : window.innerHeight,
  };
}

export function useViewport() {
  const [size, setSize] = useState(read);
  useEffect(() => {
    const on = () => setSize(read());
    window.addEventListener('resize', on);
    window.visualViewport?.addEventListener('resize', on);
    return () => {
      window.removeEventListener('resize', on);
      window.visualViewport?.removeEventListener('resize', on);
    };
  }, []);
  return size;
}
