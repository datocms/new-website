import React, { useState } from 'react';
import style from './style.module.css';
import styleForm from 'components/Form/style.module.css';
import Prism from 'components/Prism';
import Tabs, { Tab } from 'components/Tabs';
import Space from 'components/Space';
import { useForm, useFieldArray } from 'react-hook-form';

export default function CloneButtonGenerator() {
  const {
    handleSubmit: submitFn,
    register,
    control,
    watch,
  } = useForm({
    defaultValues: {
      deploymentType: 'copyRepo',
      environmentVariables: [
        {
          environmentVariableName: 'DATOCMS_READ_ONLY_API_TOKEN',
          apiTokenName: 'Read-only API token',
        },
      ],
    },
  });

  const {
    fields: environmentVariableFields,
    append: addEnvironmentVariable,
    remove: removeEnvironmentVariable,
  } = useFieldArray({ control, name: 'environmentVariables' });

  const formValues = watch();

  const mandatory = 'THIS FIELD IS MANDATORY. PLEASE PROVIDE A VALUE!';

  const deploymentType = formValues['deploymentType'];

  console.log(formValues['environmentVariables']);

  const datocmsJson = {
    name: formValues['name'] || mandatory,
    description: formValues['description'] || mandatory,
    previewImage: formValues['previewImage'] || mandatory,
    livePreviewUrl: formValues['livePreviewUrl'] || undefined,
    datocmsProjectId: formValues['datocmsProjectId'] || mandatory,
    deploymentType: formValues['deploymentType'] || mandatory,
    environmentVariables:
      deploymentType !== 'copyRepo'
        ? formValues['environmentVariables'].reduce(
            (acc, entry) =>
              entry.environmentVariableName && entry.apiTokenName
                ? {
                    ...acc,
                    [entry.environmentVariableName]: entry.apiTokenName,
                  }
                : acc,
            {},
          )
        : undefined,
    buildCommand:
      deploymentType !== 'copyRepo'
        ? formValues['buildCommand'] || mandatory
        : undefined,
    postInstallUrl:
      deploymentType !== 'copyRepo'
        ? formValues['postInstallUrl'] || undefined
        : undefined,
  };

  const deployUrl = `https://dashboard.datocms.com/deploy?${new URLSearchParams(
    {
      repo: formValues['repo'] || 'YOUR-GITHUB-REPO',
    },
  ).toString()}`;

  function handleSubmit() {}

  return (
    <div>
      <Space top={1} bottom={1}>
        <form onSubmit={submitFn(handleSubmit)} className={style.form}>
          <div className={styleForm.field}>
            <label htmlFor="dbg-name">Project starter name</label>
            <input
              required
              type="text"
              {...register('name')}
              placeholder="Project Template Name"
              id="dbg-name"
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="dbg-description">Description</label>
            <input
              required
              type="text"
              {...register('description')}
              placeholder="Insert a short description for the project starter"
              id="dbg-description"
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="dbg-previewImage">
              Frontend preview screenshot
            </label>
            <input
              required
              type="url"
              {...register('previewImage')}
              placeholder="https://acme.com/preview.png"
              id="dbg-previewImage"
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="dbg-livePreviewUrl">
              URL of an example of a successful deployment
            </label>
            <input
              type="url"
              {...register('livePreviewUrl')}
              placeholder="https://my-project-starter.netlify.app/"
              id="dbg-livePreviewUrl"
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="dbg-repo">
              Github repository that will be copied
            </label>
            <input
              type="text"
              {...register('repo')}
              placeholder="orgName/repoName:branchName"
              id="dbg-repo"
              pattern="[^/]+\/[^:]+:.*"
              required
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="dbg-datocmsProjectId">
              DatoCMS Project ID that will be duplicated
            </label>
            <input
              required
              type="number"
              {...register('datocmsProjectId')}
              placeholder="54321"
              id="dbg-datocmsProjectId"
            />
          </div>
          <div className={styleForm.field}>
            <label htmlFor="dbg-deploymentType">
              How the project can be built and deployed?
            </label>
            <select {...register('deploymentType')} required>
              <option value="copyRepo">
                Simply make a copy of the template repository
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
          {deploymentType !== 'copyRepo' && (
            <>
              <div className={styleForm.group}>
                <label>
                  API Tokens exposed as environment variables on hosting
                </label>
                <div className={styleForm.fieldArray}>
                  {environmentVariableFields.map((field, index) => (
                    <div key={field.id} className={styleForm.fieldArrayItem}>
                      <div
                        className={styleForm.fieldArrayItemField}
                        style={{ flex: 2 }}
                      >
                        <input
                          required
                          type="text"
                          {...register(
                            `environmentVariables.${index}.environmentVariableName`,
                          )}
                          placeholder="ENV_NAME"
                        />
                      </div>
                      <div
                        className={styleForm.fieldArrayItemField}
                        style={{ flex: 1 }}
                      >
                        <input
                          required
                          type="text"
                          {...register(
                            `environmentVariables.${index}.apiTokenName`,
                          )}
                          placeholder="Read-only API token"
                        />
                      </div>
                      <button
                        className={styleForm.fieldArrayButton}
                        onClick={(e) => {
                          e.preventDefault();
                          removeEnvironmentVariable(index);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    className={styleForm.fieldArrayButton}
                    onClick={(e) => {
                      e.preventDefault();
                      addEnvironmentVariable({
                        environmentVariableName: '',
                        apiTokenName: '',
                      });
                    }}
                  >
                    Add environment variable
                  </button>
                </div>
              </div>
              <div className={styleForm.field}>
                <label htmlFor="dbg-buildCommand">Build Command</label>
                <input
                  required
                  type="text"
                  {...register('buildCommand')}
                  placeholder="npm run build"
                  id="dbg-buildCommand"
                />
              </div>
              <div className={styleForm.field}>
                <label htmlFor="dbg-postInstallUrl">
                  Post-deploy install URL
                </label>
                <input
                  type="text"
                  {...register('postInstallUrl')}
                  placeholder="/api/post-install"
                  id="dbg-postInstallUrl"
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
          <Prism code={JSON.stringify(datocmsJson, null, 2)} language="json" />
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
              rel="noopener noreferrer"
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
