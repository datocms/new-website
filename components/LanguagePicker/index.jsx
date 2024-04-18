import cn from 'classnames';
import { createContext } from 'react';
import useLocalStorage from 'utils/useLocalStorage';
import s from './style.module.css';

const LanguageContext = createContext('javascript');

export const LanguageConsumer = LanguageContext.Consumer;

export default function LanguagePicker({ children }) {
  const [language, setLanguage] = useLocalStorage(
    'docsPreferredLanguage',
    'javascript',
  );

  return (
    <>
      <div className={s.picker}>
        <div className={s.pickerLabel}>Show examples in:</div>
        <button
          type="button"
          className={cn(s.pickerButton, {
            [s.pickerButtonActive]: language === 'javascript',
          })}
          onClick={() => setLanguage('javascript')}
        >
          Javascript
        </button>
        <button
          type="button"
          className={cn(s.pickerButton, {
            [s.pickerButtonActive]: language === 'http',
          })}
          onClick={() => setLanguage('http')}
        >
          HTTP
        </button>
      </div>
      <LanguageContext.Provider value={language}>
        {children}
      </LanguageContext.Provider>
    </>
  );
}
