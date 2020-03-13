import { useRef, useState, useEffect } from 'react';
import useComponentSize from '@rehooks/component-size';
import { useDebounce } from 'use-debounce';

const BackgroundImage = ({ src, scale = 1.0, ...other }) => {
  const imageLoader = useRef(typeof Image === 'function' ? new Image() : null);
  const [dpr, setDpr] = useState(null);
  const [url, setUrl] = useState(null);
  const ref = useRef(null);
  const size = useComponentSize(ref);

  const { width, height } = size;

  // const [width] = useDebounce(size.width, 1000);
  // const [height] = useDebounce(size.height, 1000);

  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  useEffect(() => {
    const parsedSrc = new URL(src);
    let params = new URLSearchParams(parsedSrc.search.slice(1));

    if (dpr && size) {
      params.set('w', parseInt(width * scale));
      params.set('h', parseInt(height * scale));
      params.set('dpr', dpr);
      parsedSrc.search = params.toString();

      imageLoader.current.src = parsedSrc.toString();
      imageLoader.current.onload = () => {
        setUrl(parsedSrc.toString());
      };
    }
  }, [src, dpr, width, height]);

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
