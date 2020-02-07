import { useRef, useEffect } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ url }) {
  const ref = useRef();

  useEffect(() => {
    var hls = new Hls();
    hls.attachMedia(ref.current);

    hls.on(Hls.Events.MEDIA_ATTACHED, function() {
      console.log('video and hls.js are now bound together !');

      hls.loadSource(url);

      hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
        console.log(
          'manifest loaded, found ' + data.levels.length + ' quality level',
        );

        ref.current.play();
      });
    });
  }, []);

  return <video autoplay loop controls controlsList="nodownload noremote foobar" ref={ref} />;
}
