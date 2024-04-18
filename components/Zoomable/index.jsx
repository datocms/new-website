import { Portal } from 'utils/usePortal';
import s from './style.module.css';
import { useCallback, useState, useEffect } from 'react';

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
  }, [escFunction]);

  return (
    <Portal>
      <div className={s.zoom} onClick={handleClick}>
        <div className={s.zoomContainer}>{children}</div>
      </div>
    </Portal>
  );
}

export default function Zoomable({ children, content }) {
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
