---
title: Deploying to S3 with CircleCI
---

**This guide assumes you have a working static website project on your machine integrated with DatoCMS**

If that's not your case, you can return to the previous sections of this documentation to see how to properly configure the DatoCMS administrative area and how to integrate DatoCMS with your favorite static website generator. 

### Create your Git repository

Create a new repository on [GitHub](https://github.com/new). To avoid errors, do not initialize the new repository with README, license, or gitignore files. You can add these files after your project has been pushed to GitHub.

```bash
$ git init
$ git add .
```

Commit the files that you've staged in your local repository.

```bash
$ git commit -m 'First commit'
```

At the top of your GitHub repository's Quick Setup page, click the clipboard icon to copy the remote repository URL. In Terminal, add the URL for the remote repository where your local repository will be pushed.

```bash
$ git remote add origin YOUR_GITHUB_REPOSITORY_URL
```

Now, it's time to push the changes in your local repository to GitHub.

```bash
git push -u origin master
```

Now that your project is up and running on GitHub, let's connect it to CircleCI.

### Enable CircleCI

Sign in to CircleCI and [add a new project](https://circleci.com/add-projects) for the repository you want to build clicking on the *Build project* button.

![foo](../../images/circleci/add-project.png)

### Add the DatoCMS API token as environment variable

Reach the settings page of your new CircleCI project, and add an environment variable called `DATO_API_TOKEN` containing the read-only API token of your DatoCMS administrative area:

![foo](../../images/circleci/env.png)

You can find the API token in the *Admin area > API tokens* section:

![foo](../../images/api-token.png)

### Configure circle.yml

The next step is to add a `circle.yml` file to your repository. CircleCI uses this file in the root of your repository to learn about your project and how you want your builds to be executed. How this file needs to be structured differs a lot depending on the static website generator you are using. Here we'll show you some examples to get started. 

Please refer to the official CircleCI documentation to learn everything regarding [how to configure your build](https://circleci.com/docs/1.0/configuration/) and how to properly [deploy the actual website to S3](https://circleci.com/docs/1.0/continuous-deployment-with-amazon-s3/).

#### Jekyll

```yaml
test:
  override:
    # first dump all the remote content as local files
    - bundle exec dato dump
    # then generate the website
    - bundle exec dato jekyll build
deployment:
  production:
    branch: master
    commands:
      - aws s3 sync public s3://metalsmith-demo/ --delete
```

#### Hugo

```yaml
machine:
  node:
    version: 6.7.0
dependencies:
  override:
    # if your project uses Yarn as package manager, replace "npm install" with "yarn"
    - npm install
    # download latest version of hugo
    - wget https://github.com/spf13/hugo/releases/download/v0.19/hugo_0.19-64bit.deb
    # install it
    - sudo dpkg -i hugo*.deb
test:
  override:
    # first dump all the remote content as local files
    - ./node_modules/.bin/dato dump
    # then generate the website
    - hugo
deployment:
  production:
    branch: master
    commands:
      - aws s3 sync public s3://your-bucket-name/ --delete
```

#### Middleman

```yaml
test:
  override:
    - bundle exec middleman build
deployment:
  production:
    branch: master
    commands:
      - aws s3 sync build s3://metalsmith-demo/ --delete
```

#### Metalsmith

```yaml
machine:
  node:
    version: 6.7.0
# if your project uses Yarn as package manager, uncomment these lines:
# dependencies:
#   override:
#     - yarn
test:
  override:
    # first dump all the remote content as local files
    - ./node_modules/.bin/dato dump
    # then generate the website
    - node index.js
deployment:
  production:
    branch: master
    commands:
      - aws s3 sync build s3://your-bucket-name/ --delete
```

### Connect CircleCI to DatoCMS

There's only one last step needed: connecting DatoCMS to CircleCI, so that everytime one of your editors press the *Publish changes* button in your administrative area, a new build process (thus a new publication of the final website) gets triggered.

To do so, go to the *Admin area > Deployment settings* and select *CircleCI*:

![foo](../../images/netlify/9.png)

In the window that will appear, follow the instructions to conclude the integration:

![foo](../../images/circleci/dato.png)

When everything is done, confirm the integration pressing the *Save Settings* button.


