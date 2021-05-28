import { useCallback, useState, useEffect } from 'react';
import { Image } from 'react-datocms';
import { Portal } from 'utils/usePortal';
import s from './style.module.css';

function Zoom({ children, onClose }) {
  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    },
    [onClose],
  );

  const handleClick = useCallback(
    (event) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      event.stopPropagation();
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  return (
    <Portal>
      <div className={s.zoom} onClick={handleClick}>
        <div className={s.zoomContainer}>{children}</div>
      </div>
    </Portal>
  );
}

function Zoomable({ children, content }) {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(() => true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(() => false);
  }, [setOpen]);

  return (
    <div onClick={handleClick} style={content ? { cursor: 'zoom-in' } : {}}>
      {children}
      {open && content && <Zoom onClose={handleClose}>{content}</Zoom>}
    </div>
  );
}

export default function ImageFigure({ data, imageClassName }) {
  return (
    <figure>
      {data.format === 'gif' && (
        <Zoomable
          content={
            data.width > 900 && (
              <video
                poster={`${data.url}?fm=jpg&fit=max&w=1500`}
                style={{ width: `${data.width}px` }}
                autoPlay
                loop
                style={{ display: 'block' }}
              >
                <source src={`${data.url}?fm=webm&w=1500`} type="video/webm" />
                <source src={`${data.url}?fm=mp4&w=1500`} type="video/mp4" />
              </video>
            )
          }
        >
          <video
            poster={`${data.url}?fm=jpg&fit=max&w=900`}
            style={{ width: `${data.width}px` }}
            autoPlay
            loop
          >
            <source src={`${data.url}?fm=webm&w=900`} type="video/webm" />
            <source src={`${data.url}?fm=mp4&w=900`} type="video/mp4" />
          </video>
        </Zoomable>
      )}
      {data.format !== 'gif' && data.responsiveImage && (
        <Zoomable
          content={
            data.zoomableResponsiveImage &&
            data.width > 900 && (
              <Image
                className={imageClassName}
                data={data.zoomableResponsiveImage}
              />
            )
          }
        >
          <Image
            className={imageClassName}
            data={data.responsiveImage}
            style={{ display: 'inline-block' }}
          />
        </Zoomable>
      )}
      {data.format !== 'gif' && !data.responsiveImage && (
        <Zoomable
          content={
            (data.format === 'svg' || data.width > 900) && (
              <img
                alt={data.alt}
                src={`${data.url}?auto=format&fit=max&w=1500`}
                style={{ display: 'block' }}
              />
            )
          }
        >
          <img alt={data.alt} src={`${data.url}?auto=format&fit=max&w=900`} />
        </Zoomable>
      )}
      {(data.title || (data.responsiveImage && data.responsiveImage.title)) && (
        <figcaption>{data.title || data.responsiveImage.title}</figcaption>
      )}
    </figure>
  );
}
