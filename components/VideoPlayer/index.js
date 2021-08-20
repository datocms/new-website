import { useRef, useEffect } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ src, autoPlay, ...other }) {
  const ref = useRef();

  useEffect(() => {
    const videoEl = ref.current;

    if (!videoEl) {
      return;
    }

    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('HLS supported natively!');
      // This will run in safari, where HLS is supported natively
      videoEl.src = src;
      return;
    }

    if (!Hls.isSupported()) {
      console.log('HLS not supported and HLS is not supported natively!');
      return;
    }

    const hls = new Hls();

    hls.attachMedia(ref.current);

    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      hls.loadSource(src);
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        if (autoPlay) {
          ref.current.play();
        }
      });
    });

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [autoPlay, src]);

  const poster =
    other.poster ||
    src
      .replace('stream.mux.com', 'image.mux.com')
      .replace('.m3u8', '/thumbnail.jpg?height=600');

  return (
    <video
      playsInline
      muted={autoPlay}
      {...other}
      ref={ref}
      poster={poster}
      style={{ display: 'block' }}
    />
  );
}
