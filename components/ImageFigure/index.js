import { Image } from 'react-datocms';

export default function ImageFigure({ data, imageClassName }) {
  return (
    <figure>
      {data.format === 'gif' && (
        <video
          poster={`${data.url}?fm=jpg&fit=max&w=900`}
          style={{ maxWidth: `${data.width}px` }}
          autoPlay
          loop
        >
          <source src={`${data.url}?fm=webm&w=900`} type="video/webm" />
          <source src={`${data.url}?fm=mp4&w=900`} type="video/mp4" />
        </video>
      )}
      {data.format !== 'gif' && data.responsiveImage && (
        <Image
          className={imageClassName}
          data={data.responsiveImage}
        />
      )}
      {data.format !== 'gif' && !data.responsiveImage && (
        <img
          alt={data.alt}
          style={{ maxWidth: `${data.width}px` }}
          src={`${data.url}?auto=format&fit=max&w=900`}
        />
      )}
      {data.title && <figcaption>{data.title}</figcaption>}
    </figure>
  );
}
