import { ImageResponse } from '@vercel/og';
import FullLogo from 'public/images/brand-assets/svg/icon-text/color/color_full_logo_alt.svg';
import ChromeDesktopOg from 'public/images/illustrations/chromeDesktopOg.svg';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);

  const title = searchParams.get('title') || 'General Concepts';
  const kicker = searchParams.get('kicker');

  console.log(kicker);

  const colfaxBold = await fetch(
    new URL('public/fonts/colfax-web-700.woff', import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        fontSize: '75px',
        background: 'white',
        width: '100%',
        height: '100%',
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bolder',
        fontFamily: 'colfax',
        position: 'relative',
      }}
    >
      <FullLogo
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.7)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          height: '45%',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '1.8rem',
            color: '#9E9E9E',
            fontFamily: 'colfaxBold',
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            marginBottom: '2%',
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontFamily: 'colfaxBold',
            fontSize: '6rem',
            letterSpacing: '-0.04em',
            lineHeight: '1',
            textDecorationColor: '#F5BE50',
            textDecorationLine: 'underline',
            textDecorationThickness: '0.6rem',
            textDecorationStyle: 'solid',
            textDecorationSkipInk: 'auto',
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: '100%',
          left: '0%',
          bottom: '0%',
        }}
      >
        <ChromeDesktopOg />
      </div>
    </div>,
    {
      fonts: [
        {
          name: 'colfaxBold',
          data: colfaxBold,
          style: 'normal',
          weight: 500,
        },
      ],
      width: 1176,
      height: 756,
    },
  );
}
