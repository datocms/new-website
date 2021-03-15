import React from 'react';
import style from './style.module.css';
import styleForm from 'components/Form/style.module.css';
import Tabs, { Tab } from 'components/Tabs';

export default function CloneButtonGenerator() {
  const [cloneUrl, setCloneUrl] = React.useState(
    'https://dashboard.datocms.com/clone?projectId=54321&Structured-Text-Demo',
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
      <form
        action="https://dashboard.datocms.com/clone"
        method="GET"
        onChange={onChange}
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
            placeholder="Structured Text demo"
            id="cbp-name"
            required
            className={touched ? style.formField : undefined}
          />
        </div>
      </form>

      <h4>Preview</h4>
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
      <Tabs>
        <Tab title="URL">
          <code className={style.code}>{cloneUrl}</code>
        </Tab>
        <Tab title="Markdown">
          <code className={style.code}>
            [![Clone DatoCMS
            project](https://dashboard.datocms.com/clone/button.svg)](
            {cloneUrl})
          </code>
        </Tab>
        <Tab title="HTML">
          <code className={style.code}>
            {`<a href="${cloneUrl}" target="_blank" rel="noopener">
  <img
    src="https://dashboard.datocms.com/clone/button.svg"
    alt="clone project button"
  />
</a>`}
          </code>
        </Tab>
      </Tabs>
    </div>
  );
}
