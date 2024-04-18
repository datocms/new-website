import useComponentSize from '@rehooks/component-size';
import { useEffect, useRef, useState } from 'react';

const BackgroundImage = ({ src, scale = 1.0, ...other }) => {
  const imageLoader = useRef(typeof Image === 'function' ? new Image() : null);
  const [dpr, setDpr] = useState(null);
  const [url, setUrl] = useState(null);
  const ref = useRef(null);
  const size = useComponentSize(ref);

  const { width, height } = size;

  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  useEffect(() => {
    const parsedSrc = new URL(src);
    const params = new URLSearchParams(parsedSrc.search.slice(1));

    if (dpr && size) {
      params.set('w', Number.parseInt(width * scale));
      params.set('h', Number.parseInt(height * scale));
      params.set('dpr', dpr);
      parsedSrc.search = params.toString();

      imageLoader.current.src = parsedSrc.toString();
      imageLoader.current.onload = () => {
        setUrl(parsedSrc.toString());
      };
    }
  }, [src, dpr, width, height, scale, size]);

  return (
    <div
      {...other}
      ref={ref}
      style={{
        backgroundImage: url && `url(${url})`,
      }}
    />
  );
};

export default BackgroundImage;
