import { useRef, useState, useEffect } from 'react';
import useComponentSize from '@rehooks/component-size';

const BackgroundImage = ({ src, ...other }) => {
  const [dpr, setDpr] = useState(null);
  const ref = useRef(null);
  const size = useComponentSize(ref);

  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  const url = new URL(src);
  let params = new URLSearchParams(url.search.slice(1));

  if (size) {
    params.set('w', size.width);
    params.set('h', size.height);
  }

  if (dpr) {
    params.set('dpr', dpr);
  }

  url.search = params.toString();

  return (
    <div
      {...other}
      ref={ref}
      style={{
        backgroundImage: dpr && size && `url(${url.toString()})`,
      }}
    />
  );
};

export default BackgroundImage;