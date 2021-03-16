import React from 'react';
import style from './style.module.css';
import styleForm from 'components/Form/style.module.css';
import CodeExcerpt from 'components/CodeExcerpt';
import Tabs, { Tab } from 'components/Tabs';
import Space from 'components/Space';

export default function CloneButtonGenerator() {
  const [touched, setTouched] = React.useState(false);

  const [deployUrl, setDeployUrl] = React.useState(
    'https://dashboard.datocms.com/deploy?repo=datocms/structured-text-demo:main',
  );

  const [datocmsJson, setDatocmsJson] = React.useState({});
  const formRef = React.useRef();

  const onFormChange = React.useCallback((event) => {
    const form = event.target.form;
    const formData = new FormData(form);
    const json = {};
    for (let [key, val, ...rest] of formData.entries()) {
      if (val !== '') {
        json[key] = val;
      } else if (form.elements[key] && form.elements[key].required) {
        json[key] = 'THIS FIELD IS MANDATORY. PLEASE PROVIDE A VALUE.';
      }
    }
    if (json.deploymentType === 'copyRepo') {
      delete json.datocmsApiTokenEnvName;
      delete json.buildCommand;
    }
    setDatocmsJson(json);
    setTouched(true);
    setDeployUrl(
      `https://dashboard.datocms.com/deploy?${new URLSearchParams({
        repo: formData.get('repo') || 'YOUR-GITHUB-REPO',
      }).toString()}`,
    );
  }, []);

  React.useEffect(() => {
    if (formRef.current) {
      onFormChange({ target: { form: formRef.current } });
    }
  }, []);

  return (
    <div>
      <Space top={1} bottom={1}>
        <form
          action="#"
          method="GET"
          onChange={onFormChange}
          ref={formRef}
          className={style.form}
        >
          <div className={styleForm.field}>
            <label htmlFor="dbg-name">Starter name</label>
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
              placeholder="Insert a short description for the project starter"
              id="dbg-description"
              className={touched ? style.formField : undefined}
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="dbg-previewImage">
              Frontend preview screenshot
            </label>
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
            <label htmlFor="dbg-livePreviewUrl">
              URL of an example of a successful deployment
            </label>
            <input
              type="url"
              name="livePreviewUrl"
              placeholder="https://my-project-starter.netlify.app/"
              id="dbg-livePreviewUrl"
              className={touched ? style.formField : undefined}
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="dbg-repo">Github repository to fork</label>
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
            <label htmlFor="dbg-deploymentType">
              How the project can be built and deployed?
            </label>
            <select
              name="deploymentType"
              required
              className={touched ? style.formField : undefined}
            >
              <option value="copyRepo">
                Simply fork the template repository
              </option>
              <option value="static">
                It can be deployed to any static hosting (Vercel, Netlify)
              </option>
              <option value="vercel">It can be deployed only to Vercel</option>
              <option value="netlify">
                It can be deployed only to Netlify
              </option>
              <option value="heroku">It can be deployed only to Heroku</option>
            </select>
          </div>
          {datocmsJson.deploymentType !== 'copyRepo' && (
            <>
              <div className={styleForm.field}>
                <label htmlFor="dbg-datocmsApiTokenEnvName">
                  Name of the env variable for the read-only DatoCMS API token
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
                <label htmlFor="dbg-buildCommand">Build Command</label>
                <input
                  required
                  type="text"
                  name="buildCommand"
                  placeholder="npm run build"
                  id="dbg-buildCommand"
                  className={touched ? style.formField : undefined}
                />
              </div>
            </>
          )}
        </form>
      </Space>
      <Space top={1} bottom={1}>
        <h5>Result</h5>
        <p>
          Copy the following code and add it to your Git repository in a file
          called <code>datocms.json</code>:
        </p>
        <div className={style.datocmsJsonContainer}>
          <CodeExcerpt
            language="json"
            code={JSON.stringify(datocmsJson, null, 2)}
          />
        </div>
      </Space>
      <Space top={1} bottom={1}>
        <p>
          Use the following code to share the button on your README file or
          documentation:
        </p>
        <Tabs>
          <Tab title="Markdown">
            <pre className={style.code}>
              <code>
                [![Clone DatoCMS
                project](https://dashboard.datocms.com/clone/button.svg)](
                {deployUrl})
              </code>
            </pre>
          </Tab>
          <Tab title="HTML">
            <pre className={style.code}>
              <code>
                {`<a href="${deployUrl}" target="_blank" rel="noopener">
  <img
    src="https://dashboard.datocms.com/deploy/button.svg"
    alt="deploy project button"
  />
</a>`}
              </code>
            </pre>
          </Tab>
          <Tab title="URL">
            <pre className={style.code}>
              <code>{deployUrl}</code>
            </pre>
          </Tab>
          <Tab title="Button Preview">
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
          </Tab>
        </Tabs>
      </Space>
    </div>
  );
}
