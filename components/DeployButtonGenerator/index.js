import React from 'react';
import style from './style.module.css';
import styleForm from 'components/Form/style.module.css';
import CodeExcerpt from 'components/CodeExcerpt';
import Tabs, { Tab } from 'components/Tabs';

export default function CloneButtonGenerator() {
  const [touched, setTouched] = React.useState();

  const [deployUrl, setDeployUrl] = React.useState(
    'https://dashboard.datocms.com/deploy?repo=datocms/structured-text-demo:main',
  );

  const onRepoFormChange = React.useCallback((event) => {
    const form = event.target.form;
    setDeployUrl(
      `${form.action}?${new URLSearchParams(new FormData(form)).toString()}`,
    );
  }, []);

  const [datocmsJson, setDatocmsJson] = React.useState({});
  const jsonFormRef = React.useRef();

  const onJsonFormChange = React.useCallback((event) => {
    const form = event.target.form;
    const json = {};
    for (let [key, val, ...rest] of new FormData(form).entries()) {
      if (val !== '') {
        json[key] = val;
      } else if (form.elements[key] && form.elements[key].required) {
        json[key] = 'THIS FIELD IS MANDATORY. PLEASE PROVIDE A VALUE.';
      }
    }
    setDatocmsJson(json);
    setTouched((touched) => {
      // Accounts for the initial call to onJsonFormChange on mount.
      if (typeof touched === 'undefined') {
        return false;
      }
      return true;
    });
  }, []);

  React.useEffect(() => {
    if (jsonFormRef.current) {
      onJsonFormChange({ target: { form: jsonFormRef.current } });
    }
  }, []);

  return (
    <div>
      <form
        action="https://dashboard.datocms.com/deploy"
        method="GET"
        onChange={onRepoFormChange}
      >
        <div className={styleForm.field}>
          <label htmlFor="dbg-repo">Repo</label>
          <input
            type="text"
            name="repo"
            placeholder="orgName/repoName:branchName"
            id="dbg-repo"
            pattern="[^/]+\/[^:]+:.*"
            required
            className={style.formField}
          />
        </div>
      </form>

      <h4>Preview</h4>
      <a
        href={deployUrl}
        target="_blank"
        rel="noopener"
        className={style.button}
      >
        <img
          src="https://dashboard.datocms.com/deploy/button.svg"
          alt="deploy project button"
        />
      </a>
      <Tabs>
        <Tab title="URL">
          <code className={style.code}>{deployUrl}</code>
        </Tab>
        <Tab title="Markdown">
          <code className={style.code}>
            [![Clone DatoCMS
            project](https://dashboard.datocms.com/clone/button.svg)](
            {deployUrl})
          </code>
        </Tab>
        <Tab title="HTML">
          <code className={style.code}>
            {`<a href="${deployUrl}" target="_blank" rel="noopener">
  <img
    src="https://dashboard.datocms.com/deploy/button.svg"
    alt="deploy project button"
  />
</a>`}
          </code>
        </Tab>
      </Tabs>

      <h4>datocms.json generator</h4>

      <form
        action="#"
        method="GET"
        onChange={onJsonFormChange}
        ref={jsonFormRef}
      >
        <div className={styleForm.field}>
          <label htmlFor="dbg-name">Name</label>
          <input
            required
            type="text"
            name="name"
            placeholder="Project Template Name"
            id="dbg-name"
            className={touched ? style.formField : undefined}
          />
        </div>
        <div className={styleForm.field}>
          <label htmlFor="dbg-description">Description</label>
          <input
            required
            type="text"
            name="description"
            placeholder="Fully customizable starter kit for your site."
            id="dbg-description"
            className={touched ? style.formField : undefined}
          />
        </div>
        <div className={styleForm.field}>
          <label htmlFor="dbg-previewImage">Preview Image</label>
          <input
            required
            type="url"
            name="previewImage"
            placeholder="https://acme.com/preview.png"
            id="dbg-previewImage"
            className={touched ? style.formField : undefined}
          />
        </div>
        <div className={styleForm.field}>
          <label htmlFor="dbg-livePreviewUrl">Live Preview URL</label>
          <input
            type="url"
            name="livePreviewUrl"
            placeholder="https://demo.acme.com"
            id="dbg-livePreviewUrl"
            className={touched ? style.formField : undefined}
          />
        </div>
        <div className={styleForm.field}>
          <label htmlFor="dbg-datocmsProjectId">DatoCMS Project ID</label>
          <input
            required
            type="number"
            name="datocmsProjectId"
            placeholder="54321"
            id="dbg-datocmsProjectId"
            className={touched ? style.formField : undefined}
          />
        </div>
        <div className={styleForm.field}>
          <label htmlFor="dbg-datocmsApiTokenEnvName">
            DatoCMS API Token Env Name
          </label>
          <input
            required
            type="text"
            name="datocmsApiTokenEnvName"
            placeholder="DATOCMS_READ_ONLY_API_TOKEN"
            id="dbg-datocmsApiTokenEnvName"
            className={touched ? style.formField : undefined}
          />
        </div>
        <div className={styleForm.field}>
          <label htmlFor="dbg-deploymentType">Deployment Type</label>
          <select
            name="deploymentType"
            required
            className={touched ? style.formField : undefined}
          >
            <option value="copyRepo">copyRepo</option>
            <option value="vercel">Vercel</option>
            <option value="netlify">Netlify</option>
            <option value="heroku">Heroku</option>
          </select>
        </div>
        <div className={styleForm.field}>
          <label htmlFor="dbg-buildCommand">Build Command</label>
          <input
            type="text"
            name="buildCommand"
            placeholder="npm run build"
            id="dbg-buildCommand"
            className={touched ? style.formField : undefined}
          />
        </div>
      </form>

      <h5>Result</h5>
      <div className={style.datocmsJsonContainer}>
        <CodeExcerpt
          language="JSON"
          code={JSON.stringify(datocmsJson, null, 2)}
        />
      </div>
    </div>
  );
}
