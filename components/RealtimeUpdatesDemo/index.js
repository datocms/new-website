import s from './style.module.css';
import { range } from 'range';
import { useRef, useState, useCallback, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import useInterval from '@use-it/interval';
import cn from 'classnames';

const images = [
  {
    url:
      'https://www.datocms-assets.com/205/1581080734-steady-hand-co-p7ggne15mys-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLCg0LDhgSFREZGhcUEhUVGBgZHSIrFiEgHyslGikoHRUWJjUxKC0vMjIyGS44PTcwPCsxMi8BCgsLDg0OHBAQHDsoIig7Ozs1Ozs7Ozs7Ozs7LzUvLzs7NTs7Ozs7Lzs7NTsvLzsvOy87Ly8vLy8vLy8vLy8vL//AABEIAA8AGAMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAAFBgcA/8QAGxAAAQUBAQAAAAAAAAAAAAAAAgABAwUhBBH/xAAWAQEBAQAAAAAAAAAAAAAAAAADBAD/xAAaEQACAwEBAAAAAAAAAAAAAAAAAgERMRID/9oADAMBAAIRAxEAPwBB5rGIX0mR+r7QKQX9U6aQ2fCdHafqkjIRJ/Ul9aM/smyWWqswCNtWStXTGUbastBQrxR//9k=',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080732-samsommer-vddcctqwal8-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAoLChILDhgYDQ0NDhENFhEYFx8ZGBYTIhUaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OFQUQHC8cHhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABAAGAMBIgACEQEDEQH/xAAZAAABBQAAAAAAAAAAAAAAAAAFAAEDBAf/xAAcEAACAgIDAAAAAAAAAAAAAAABAwACBBESITH/xAAWAQEBAQAAAAAAAAAAAAAAAAACAQD/xAAXEQADAQAAAAAAAAAAAAAAAAAAARIC/9oADAMBAAIRAxEAPwDRG0KxuVTmCp1CzVBtdQRl4PEkx2wLCGs0M8ikKqmvUU1ssI//2Q==',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080728-niklas-liniger-bzpt3qn09wq-unsplash.jpg?ar=2.5&fit=crop&w=500&crop=bottom',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoIDQgLCA0NDhYQBxIGGh0JFhENFxUZGBYfFhUaKysjGh0oHSEWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBANHC8oFh4vLy8vLy8vNS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA8AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAABgECBf/EABsQAAIDAAMAAAAAAAAAAAAAAAACAQNRBRVB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwD/xAAYEQADAQEAAAAAAAAAAAAAAAAAAQMCEv/aAAwDAQACEQMRAD8AcZrXSyoui5PONOk940R6O9sTMJm5dWugL1nONOgXbJymmf/Z',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080725-mitchell-luo-uisu4aucqea-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFgoLDhgQDg0NDh0dFhEdFx8lJSYfLiEaKysvJiUoHSEiJDUlLTkvNTIyGi49PTcwPCsxMi8BCgsLDg0OHBAQHDsoIig7Ozs7Ozs7Lzs7Ozs7Ozs7OzsvNTsvLzUvOzs7Ozs7Lzs7LzU7NTs7Ozs7Lzs7OzU7O//AABEIAA8AGAMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAAABgcD/8QAHhAAAQQDAAMAAAAAAAAAAAAAAQACAwUEETESISL/xAAWAQEBAQAAAAAAAAAAAAAAAAAEAwL/xAAbEQEAAgIDAAAAAAAAAAAAAAABAAIDEQQSIf/aAAwDAQACEQMRAD8AfrHJZFESSlSa5iMxb5BY3dw847tE8Uryb3KZaOcHfIdrSrxyzDZcA3AlaOUyQbBQkrCvHPhB98QnVXXszfH1dT//2Q==',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080722-luca-carra-pbgmlj-wsk4-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBhYRCAgLCw0NDhIQDQgNDBINFg4YFx8ZGBYTIhUaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OGg0QHDscIhwvLy8vLzsvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABAAGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAABAMFBv/EAB4QAAEDBAMAAAAAAAAAAAAAAAEAAwYCBAUhEzFB/8QAFgEBAQEAAAAAAAAAAAAAAAAABAMB/8QAGBEBAQEBAQAAAAAAAAAAAAAAAQADEgL/2gAMAwEAAhEDEQA/ANK5JmR6FLbSNpzohIPRcEIt47xHSW+yCZtZvZSlwaQlzjDSELO6hmX/2Q==',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080718-kyle-cut-media-hzr9rdxwbqo-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgVFhYLGRgVFQ0NGhIVHhEPFx8ZGCIaFiEmHzcjKh0oKSEWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLAg0OHBAQHDsoIig7Lzs7Ozs7Lzs7OzsvLy8vLzs7Oy8vLy8vLy8vLy8vLzU1Ly8vNS8vLzUvLy8vLy8vL//AABEIAA8AGAMBIgACEQEDEQH/xAAXAAEAAwAAAAAAAAAAAAAAAAAGAAQF/8QAHRAAAQQCAwAAAAAAAAAAAAAAAQACBAUDEhEhMf/EABUBAQEAAAAAAAAAAAAAAAAAAAQD/8QAHhEAAAUFAQAAAAAAAAAAAAAAAAEEBQYDERMhMQL/2gAMAwEAAhEDEQA/ALdfatD0ij27CAhUXDq8ApBDjcgdqnpNKy6CUHKFVC0FUaxaQosrGzQeqKWJ/DyUx6w//9k=',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080715-jake-nackos-gxyyby9ggk-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBw4OBhANEhMLCAcHDREHDgYIDxENDQkYFxUZGBYTIhUaHysjGh0oKRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OEQ8NHS8cGBwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABMAGAMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAAAAgMEBv/EABsQAQACAgMAAAAAAAAAAAAAAAABBAMhAhEx/8QAFwEBAAMAAAAAAAAAAAAAAAAAAQADBf/EABgRAAMBAQAAAAAAAAAAAAAAAAABEQIx/9oADAMBAAIRAxEAPwDo5lPj4xxnWxn0upnrChCyM1nOCisIq7WcZ0CMmeGO1IBA/9k=',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080712-ingmar-hoogerhoud-ghtxlvnwysu-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYJR8dGCIeIiEmKysjHSkoHSElJTUxKDkvPj4yHSI4PTc1SC0xMjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7Ozs7Ozs7Oy87Ozs7Ozs7Ozs7LzsvLy8vOy8vOy81Oy81LzU7Oy8vLy8vL//AABEIAA8AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwABBf/EACAQAAIBBAEFAAAAAAAAAAAAAAECAwAEBREGEhMhMVH/xAAWAQEBAQAAAAAAAAAAAAAAAAACBAH/xAAdEQABAwUBAAAAAAAAAAAAAAABAAJRAxEUITEE/9oADAMBAAIRAxEAPwBb4DCT3sxJRlX1siimbgonh2eqjfHYOCBtqoFbbWqLHrQrXVRfSpb4wTc9SKyHDbm1Y9tyw+EVKb91jYpm8qKuiajYTxDK/9k=',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080709-francesco-ungaro-gx81x7ktfiw-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBg4IFBQRDxULEw0NDg0SDRENEg4NFxYZGBYfFhUaHysjJh0oHSEWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBAQHC8oIh07Ly8vNTUvLzU1Ly8vNS8vNS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABIAGAMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAABAMFAf/EAB0QAAICAgMBAAAAAAAAAAAAAAACAQMEERMxQhL/xAAYAQADAQEAAAAAAAAAAAAAAAACAwYEAf/EABsRAAICAwEAAAAAAAAAAAAAAAABAiEDMnER/9oADAMBAAIRAxEAPwDgommLUX6Uh5Y2VVXQsFRklJOiTxpeWR51WpB5nXwwOp1YfDJTbyAGJkRZPYAFs1Q1P//Z',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080706-atul-vinayak-hziohcewsae-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFh0YIx8tMCIaIiEyKzUvMikuKSUiMDU2NDk7MjIyJSI4PTcwSCsyMi8BCgsLAg0OHBAQHDsoIig1Lzs7Ozs7Ozs7OzsvLy8vLy87Ozs7Ozs7LzsvLy8vOzU7Ozs1Oy8vLzs7LzUvNS8vL//AABEIAA8AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAFBgABB//EACIQAAEDAwMFAAAAAAAAAAAAAAEAAgMEBREGEyESFjFSkf/EABUBAQEAAAAAAAAAAAAAAAAAAAUE/8QAHxEAAAUEAwAAAAAAAAAAAAAAAAECFjEVMlGxAwQF/9oADAMBAAIRAxEAPwA1cKEbZ5SdcaFu4eUbuWoOmEnB8LPLnq2WSdzYWZAOMlD9auqgMczcTcCctuY5RLnclX6t+q0iSffyJDYJzox//9k=',
  },
  {
    url:
      'https://www.datocms-assets.com/205/1581080702-amanda-frank-mvsjxlqtkcy-unsplash.jpg?ar=2.5&fit=crop&w=500',
    blurUpThumb:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgSDRIVDg0QDQ4ZDhENDhESFx8ZGBYfFhUdHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OGBAQHC8oIigvLzU7Ly8vLy8vLzUvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABAAGAMBIgACEQEDEQH/xAAZAAABBQAAAAAAAAAAAAAAAAADAAIEBQb/xAAdEAACAQQDAAAAAAAAAAAAAAAAAQIDBBEhEhMU/8QAFwEAAwEAAAAAAAAAAAAAAAAAAQQFAP/EABgRAQEAAwAAAAAAAAAAAAAAAAEAETFh/9oADAMBAAIRAxEAPwDI2y8z2WCvIyjghce3SCwtnBZEHtONTa9wovIgdejyEEC2C//Z',
  },
];

const Copy = ({ lines }) => (
  <div className={s.paragraph}>
    {range(0, lines - 1).map((i) => (
      <div key={i} className={s.copy} />
    ))}
    <div className={s.copy} style={{ width: '60%' }} />
  </div>
);

export default function ProgressiveImagesDemo() {
  const [post, setPost] = useState(0);

  const next = useCallback(() => {
    setPost((post) => (post === images.length - 1 ? 0 : post + 1));
  }, [post]);

  useInterval(() => {
    next();
  }, 2000);

  useEffect(() => {
    images.forEach((image) => {
      const i = new Image();
      i.src = image.url;
    });
    next();
  }, []);

  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.window}>
          <div className={s.windowBar}>
            <div />
          </div>
          <div className={s.browserBar}>
            <div className={s.addressBar} />
          </div>
          <TransitionGroup className={s.page}>
            {range(post + 3, post, -1).map((i) => {
              const indexInRange =
                i < 0
                  ? i + images.length
                  : i >= images.length
                  ? i - images.length
                  : i;

              const image = images[indexInRange];

              return (
                <CSSTransition
                  key={i}
                  classNames={{
                    enter: s.postEnter,
                    enterActive: s.postEnterActive,
                    exit: s.postLeave,
                    exitActive: s.postLeaveActive,
                  }}
                  timeout={1400}
                >
                  <div className={s.post}>
                    <div
                      className={cn(s.image)}
                      style={{
                        backgroundImage: `url(${image.blurUpThumb})`,
                      }}
                    >
                      <img src={image.url} />
                    </div>
                    <Copy lines={2} />
                  </div>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
}
