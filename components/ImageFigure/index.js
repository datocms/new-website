import { Image as DatoImage } from 'react-datocms';
import Zoomable from 'components/Zoomable';

export default function ImageFigure({ data, imageClassName, alt, title }) {
  return (
    <figure>
      {data.format === 'gif' && (
        <Zoomable
          content={
            data.width > 900 && (
              <video
                poster={`${data.url}?fm=jpg&fit=max&w=1500`}
                autoPlay
                loop
                style={{ width: `${data.width}px`, display: 'block' }}
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
              <DatoImage
                className={imageClassName}
                data={data.zoomableResponsiveImage}
              />
            )
          }
        >
          <DatoImage
            className={imageClassName}
            data={{ ...data.responsiveImage, alt, title }}
            style={{
              display: 'inline-block',
              maxWidth: `${data.responsiveImage.width}px`,
            }}
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
