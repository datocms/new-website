---
title: Custom webhooks
---

If our integrations with the most popular CI systems don't fit your use case, you can always fall back to custom webhooks.

With custom webhooks, every time an editor requires a new publication of the website with the *Publish changes* button, a POST request will be performed to a custom-endpoint you are in charge of specifying in the settings. The endpoint must respond with a 200 status code, and react producing a new publication of the website. 

### Notifying DatoCMS about the result

Once you complete the publication process, you need to let DatoCMS how did it go, so we can in turn notify the editor. To do this, you need to make a POST request to a specific endpoint with a different JSON body depending on whether the publication was completed with success or it failed.

```bash
# Successful build notification example
curl -n -X POST https://webhooks.datocms.com/XXXXXXXXXXXXXXXXXXXX/deploy-results -H 'Content-Type: application/json' -d '{ "status": "success" }'

# Failed build notification example
curl -n -X POST https://webhooks.datocms.com/XXXXXXXXXXXXXXXXXXXX/deploy-results -H 'Content-Type: application/json' -d '{ "status": "error" }'
```
