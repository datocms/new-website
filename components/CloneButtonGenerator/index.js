import React from 'react';
import style from './style.module.css';
import styleForm from 'components/Form/style.module.css';
import Tabs, { Tab } from 'components/Tabs';
import Space from 'components/Space';

export default function CloneButtonGenerator() {
  const [cloneUrl, setCloneUrl] = React.useState(
    'https://dashboard.datocms.com/clone?projectId=YOUR-PROJECT-ID&name=YOUR-PROJECT-NAME',
  );
  const [touched, setTouched] = React.useState(false);

  const onChange = React.useCallback((event) => {
    const form = event.target.form;
    setCloneUrl(
      `${form.action}?${new URLSearchParams(new FormData(form)).toString()}`,
    );
    setTouched(true);
  }, []);

  return (
    <div>
      <Space top={1} bottom={1}>
        <form
          action="https://dashboard.datocms.com/clone"
          method="GET"
          onChange={onChange}
          className={style.form}
        >
          <div className={styleForm.field}>
            <label htmlFor="cbg-projectId">Project ID</label>
            <input
              type="number"
              name="projectId"
              placeholder="54321"
              id="cbg-projectId"
              required
              className={touched ? style.formField : undefined}
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="cbg-name">Project Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your project name"
              id="cbp-name"
              required
              className={touched ? style.formField : undefined}
            />
          </div>
        </form>
      </Space>

      <div className={style.result}>
        <p>
          Use the following code to share the button on your README file or
          documentation:
        </p>
        <Space top={1} bottom={1}>
          <Tabs>
            <Tab title="Markdown">
              <pre className={style.code}>
                <code>
                  [![Clone DatoCMS
                  project](https://dashboard.datocms.com/clone/button.svg)](
                  {cloneUrl})
                </code>
              </pre>
            </Tab>
            <Tab title="HTML">
              <pre className={style.code}>
                <code>
                  {`<a href="${cloneUrl}" target="_blank" rel="noopener">
  <img
    src="https://dashboard.datocms.com/clone/button.svg"
    alt="Clone DatoCMS project"
  />
</a>`}
                </code>
              </pre>
            </Tab>
            <Tab title="URL">
              <pre className={style.code}>
                <code>{cloneUrl}</code>
              </pre>
            </Tab>
            <Tab title="Button Preview">
              <a
                href={cloneUrl}
                target="_blank"
                rel="noopener"
                className={style.button}
              >
                <img
                  src="https://dashboard.datocms.com/clone/button.svg"
                  alt="clone project button"
                />
              </a>
            </Tab>
          </Tabs>
        </Space>
      </div>
    </div>
  );
}
