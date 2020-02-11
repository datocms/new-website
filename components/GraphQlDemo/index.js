import { useState, useEffect } from 'react';
import s from './style.css';
import cn from 'classnames';
import Highlight, { defaultProps } from 'prism-react-renderer';

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

export default function GraphQlDemo() {
  const [text, cursor, typer] = useTyper();
  const [result, setResult] = useState('{}');

  useEffect(() => {
    (async () => {
      while (true) {
        typer.insert('{\n  blogPost {}\n}');
        typer.moveTo(-3);

        await typer.wait(1000);

        typer.insert('\n');
        typer.insert('\n  ', { moveCursor: false });
        typer.indent(2);
        await typer.type('title');
        setResult(
          JSON.stringify({ blogPost: { title: 'Awesome post!' } }, null, 2),
        );

        await typer.wait(800);
        typer.insert('\n');
        typer.indent(2);

        await typer.type('coverImage {');
        typer.insert('}', { moveCursor: false });
        await typer.wait(300);
        typer.insert('\n');
        typer.insert('\n    ', { moveCursor: false });
        typer.indent(3);
        await typer.wait(150);
        await typer.type('url');
        setResult(
          JSON.stringify(
            {
              blogPost: {
                title: 'Awesome post!',
                coverImage: { url: 'https://datocms-assets.com/cover.png' },
              },
            },
            null,
            2,
          ),
        );
        await typer.wait(1000);

        await typer.moveTo(6, { animate: true });

        await typer.type('\n');
        typer.indent(2);

        await typer.type('author {');
        typer.insert('}', { moveCursor: false });
        await typer.wait(300);
        typer.insert('\n');
        typer.indent(3);
        typer.insert('\n    ', { moveCursor: false });
        await typer.wait(150);
        await typer.type('name');
        setResult(
          JSON.stringify(
            {
              blogPost: {
                title: 'Awesome post!',
                coverImage: { url: 'https://datocms-assets.com/cover.png' },
                author: { name: 'Mark Smith' },
              },
            },
            null,
            2,
          ),
        );
        await typer.wait(2000);

        await typer.typeBackspace(12);
        await typer.deleteForward(6);
        await typer.typeBackspace(55);
        await typer.deleteForward(3);

        typer.reset();
      }
    })();
  }, []);

  return (
    <div className={s.root}>
      <div className={s.code}>
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
          <pre className={cn(className, s.code, s.result)} style={style}>
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
