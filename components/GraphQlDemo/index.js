import { useState, useEffect } from 'react';
import s from './style.css';
import cn from 'classnames';
import Highlight, { defaultProps } from 'custom-prism-react-renderer';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const useTyper = setup => {
  const [state, setState] = useState({ text: '', cursor: 0 });

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

  const indent = count => {
    for (let i = 0; i < count; i++) {
      insert('  ');
    }
  };

  const type = async text => {
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

  const deleteForward = async count => {
    setState(({ text, cursor }) => {
      return {
        text: [text.slice(0, cursor), text.slice(cursor + count)].join(''),
        cursor,
      };
    });
  };

  const typeBackspace = async count => {
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
    (async () => {
      const setter = res => setResult(JSON.stringify(res, null, 2));

      while (true) {
        await children(typer, setter);
      }
    })();
  }, []);

  return (
    <div className={s.root}>
      <div className={s.code} style={{ height: `${1.3 * height}em` }}>
        {text
          .slice(0, cursor)
          .split('')
          .map((c, i) => (
            <Char key={i} char={c} />
          ))}
        <div className={s.cursor} />
        {text
          .slice(cursor)
          .split('')
          .map((c, i) => (
            <Char key={i} char={c} />
          ))}
      </div>

      <Highlight {...defaultProps} code={result} language="json">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={cn(className, s.code, s.result)} style={{ ...style, height: `${1.3 * height}em` }}>
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
