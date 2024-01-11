import MuxPlayer from '@mux/mux-player-react/lazy';

export default function VideoPlayer({
  playbackId,
  thumbnailTime,
  autoPlayAndLoop,
  title,
  width,
  height,
  blurUpThumb,
}) {
  return (
    <MuxPlayer
      loading="page"
      streamType="on-demand"
      playbackId={playbackId}
      autoPlay={autoPlayAndLoop ? 'muted' : false}
      loop={autoPlayAndLoop}
      accentColor="#ff593d"
      title={title}
      placeholder={blurUpThumb}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
      thumbnailTime={thumbnailTime || 0}
    />
  );
}
