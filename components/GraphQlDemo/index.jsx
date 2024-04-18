/* eslint-disable react/jsx-key */
import { useState, useEffect, useRef, useCallback } from 'react';
import s from './style.module.css';
import cn from 'classnames';
import Highlight, { defaultProps } from 'custom-prism-react-renderer';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useTyper = (setup) => {
  const [state, rawSetState] = useState({ text: '', cursor: 0 });

  const stopped = useRef(false);

  useEffect(() => {
    return () => {
      stopped.current = true;
    };
  }, []);

  const setState = useCallback(
    (state) => {
      if (!stopped.current) {
        rawSetState(state);
      }
    },
    [rawSetState, stopped],
  );

  const insert = (t, { moveCursor = true } = {}) => {
    setState(({ text, cursor }) => {
      return {
        text: [text.slice(0, cursor), t, text.slice(cursor)].join(''),
        cursor: moveCursor ? cursor + t.length : cursor,
      };
    });
  };

  const moveTo = async (index, { animate = false } = {}) => {
    if (animate) {
      for (let i = 0; i < Math.abs(index); i++) {
        moveTo(Math.sign(index));
        await wait(150);
      }
    } else {
      setState(({ text, cursor }) => {
        return {
          text,
          cursor: cursor + index,
        };
      });
    }
  };

  const indent = (count) => {
    for (let i = 0; i < count; i++) {
      insert('  ');
    }
  };

  const type = async (text) => {
    for (let i = 0; i < text.length; i++) {
      insert(text[i]);
      await wait(80);
    }
  };

  const reset = async () => {
    setState({
      text: '',
      cursor: 0,
    });
  };

  const backspace = async () => {
    setState(({ text, cursor }) => {
      return {
        text: [text.slice(0, cursor - 1), text.slice(cursor)].join(''),
        cursor: cursor - 1,
      };
    });
  };

  const deleteForward = async (count) => {
    setState(({ text, cursor }) => {
      return {
        text: [text.slice(0, cursor), text.slice(cursor + count)].join(''),
        cursor,
      };
    });
  };

  const typeBackspace = async (count) => {
    for (let i = 0; i < count; i++) {
      backspace();
      await wait(20);
    }
  };

  return [
    state.text,
    state.cursor,
    {
      insert,
      moveTo,
      indent,
      type,
      wait,
      backspace,
      typeBackspace,
      deleteForward,
      reset,
    },
  ];
};

function Char({ char }) {
  if (['{', '}'].includes(char)) {
    return <span className={s.keyword}>{char}</span>;
  }

  return char;
}

export default function GraphQlDemo({ height, children }) {
  const [text, cursor, typer] = useTyper();
  const [result, setResult] = useState('{}');

  useEffect(() => {
    let stopped = false;

    (async () => {
      const setter = (res) => {
        if (!stopped) {
          setResult(JSON.stringify(res, null, 2));
        }
      };

      while (!stopped) {
        await children(typer, setter);
      }
    })();

    return () => {
      stopped = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setResult]);

  const difference =
    text.slice(0, cursor).length -
    text.slice(0, cursor).replace(/  /g, '\t').length;

  return (
    <div className={s.root}>
      <div
        className={s.code}
        style={{ height: `calc(${1.3 * height}em + var(--padding) * 2)` }}
      >
        {text
          .replace(/  /g, '\t')
          .slice(0, cursor - difference)
          .split('')
          .map((c, i) => (
            <Char key={i} char={c} />
          ))}
        <div className={s.cursor} />
        {text
          .replace(/  /g, '\t')
          .slice(cursor - difference)
          .split('')
          .map((c, i) => (
            <Char key={i} char={c} />
          ))}
      </div>

      <Highlight
        {...defaultProps}
        code={result.replace(/  /g, '\t')}
        language="json"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(className, s.code, s.result)}
            key={result}
            style={{
              ...style,
              height: `calc(${1.3 * height}em + var(--padding) * 2)`,
            }}
          >
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
