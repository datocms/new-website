import { useRef, useEffect } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ src, autoPlay, ...other }) {
  const ref = useRef();

  useEffect(() => {
    var hls = new Hls();
    hls.attachMedia(ref.current);

    hls.on(Hls.Events.MEDIA_ATTACHED, function() {
      hls.loadSource(src);
      hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
        if (autoPlay) {
          ref.current.play();
        }
      });
    });
  }, []);

  return <video {...other} ref={ref} />;
}