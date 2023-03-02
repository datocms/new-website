import TagManager from 'react-gtm-module';
import { getCookie, setCookie } from 'utils/cookies';
import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import s from './style.module.css';

export default function CookiesManager({ children }) {
  const [showCookiesConsent, setShowCookiesConsent] = useState(
    !getCookie('cookies-accepted'),
  );
  const gtmInitialized = useRef(false);

  const accept = useCallback(() => {
    setCookie('cookies-accepted', 'true', 500);
    setShowCookiesConsent(false);
  }, []);

  const decline = useCallback(() => {
    setShowCookiesConsent(false);
  }, []);

  useEffect(() => {
    if (getCookie('cookies-accepted') && !gtmInitialized.current) {
      gtmInitialized.current = true;
      TagManager.initialize({
        gtmId: 'GTM-TJRM9NT',
      });
    }
  }, [showCookiesConsent]);

  return (
    <>
      {children}

      {showCookiesConsent ? (
        <div>
          <div className={s.cookies}>
            <div className={s.cookiesText}>
              We use cookies to enhance the user experience. Do you consent
              their use in accordance with{' '}
              <Link href="/legal/cookie-policy">
                <a>our cookie policy</a>
              </Link>
              ?
            </div>

            <button
              className={cn(s.cookiesButton, s.cookiesPrimaryButton)}
              onClick={accept}
            >
              I consent
            </button>

            <button className={s.cookiesButton} onClick={decline}>
              I decline
            </button>
          </div>
        </div>
      ) : undefined}
    </>
  );
}
