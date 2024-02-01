DatoCMS takes great care when handling users' personally identifiable data.

Details of this are given in this document,
in our [Terms of Service][datocms-terms-of-service]
and our [Privacy Policy][datocms-privacy-policy].

[datocms-terms-of-service]: https://www.datocms.com/legal/terms/
[datocms-privacy-policy]: https://www.datocms.com/legal/privacy-policy

## Personal data we collect

The system stores personal information for the signed up users:

- email
- first name
- last name
- company

For paying customers we collect also the company billing information.

We collect also IP addresses of end users visiting the projects created with DatoCMS.

## Data storage

Personal data is stored in the DatoCMS database.

DatoCMS runs on Heroku, in its "Europe" region.

Heroku's GDPR compliance is described [here][heroku-gdpr-compliance].  
Heroku's DPA (Data Processing Addendum) is [here][heroku-dpa].

[heroku-gdpr-compliance]: https://devcenter.heroku.com/articles/gdpr
[heroku-dpa]: https://www.salesforce.com/content/dam/web/en_us/www/documents/legal/Agreements/data-processing-addendum.pdf

## Data shared with third parties

### Chargebee

When you sign up for a paid plan, we ask for the information that is legally
required for invoicing and supply it directly to Chargebee. We do not store
this information in our systems.

The information is:

- email,
- first name,
- last name,
- company,
- VAT number,
- billing address.

[Chargebee GDPR Compliance](https://www.chargebee.com/security/gdpr/)

### Stripe

When adding a credit card to your billing profile we send the card information to Stripe directly, without reading that information ourselves.

We then forward the result of the card registration to Chargebee that triggers the card charges.

To Stripe we send:

- credit card details, which we cannot read ourselves apart the last 4 digits,
- email

[Stripe GDPR Compliance](https://stripe.com/guides/general-data-protection-regulation)

### Pipedrive

When you submit a contact form or when you become a paying customer we create a record on our CRM platform, Pipedrive.

We only collect the information that you provide or that is publicly available online.

The information is:

- email,
- first name,
- last name,
- company,
- any additional information that you provide on the contact form.

[Pipedrive GDPR Compliance](https://www.pipedrive.com/en/privacy)

### Fatture in Cloud

Our company needs to send certified digital invoices to our Italian customers and to
the government. To do that we use _Fatture in Cloud_.

The information passed on to _Fatture in Cloud_ are:

- email,
- first name,
- last name,
- company,
- VAT number,
- billing address.

[Fatture in Cloud GDPR Compliance](https://www.fattureincloud.it/gdpr/)

### Front

When you open a support ticket, via email or support form, we supply them the email address.

[Front GDPR Compliance](https://help.frontapp.com/t/m22vyb/is-front-compliant-with-gdpr)

### Calendly

To book meetings or support sessions we ask our users use Calendly. By using Calendly they need to provide their name, email address and optional additional inforamtion. Optionally the user can provide access to their Google Calendar.

[Calendly GDPR Compliance](https://help.calendly.com/hc/en-us/articles/360007032633-GDPR-FAQs)

### Google workspace

Underlying Front, we use Google workspace to send and receive email and to book meetings.

[Google GDPR Compliance](https://cloud.google.com/privacy/gdpr)

### MailerLite

If you opt to sign up for our newsletter, we register you on our MailerLite
account, supplying them with:

- email,
- first name,
- last name.

[MailerLite GDPR Compliance announcement](https://www.mailerlite.com/gdpr-compliance)

### Rollbar

We use Rollbar to track software errors. In certain situations, to help the tracking of the information, we supply them the email address.

[Rollbar GDPR Compliance](https://rollbar.com/compliance/gdpr/)

### AppSignal

We use AppSignal to compute performance metrics on API calls in order to find and optimize bottlenecks. AppSignal collects IP information and performance metrics for each server request.

[AppSignal GDPR compliance](https://docs.appsignal.com/appsignal/gdpr.html)

### PostHog

To better understand the product usage, we send to PostHog certain user actions performed in the CMS and website.

The information that we send are:

- email,
- first name,
- last name,
- company,
- action performed,
- device information,
- IP address.

[PostHog GDPR Compliance](https://posthog.com/handbook/company/security#gdpr)

## Legal basis

We collect and store your data for the following reasons:

- To fulfill contractual obligations with a data subject.
- To perform tasks at the request of a data subject who is in the process of
  entering into a contract with a data controller.

(For more information about these reasons, see [the explanation on Wikipedia][wikipedia-gdpr-lawful-basis])

[wikipedia-gdpr-lawful-basis]: https://en.wikipedia.org/wiki/General_Data_Protection_Regulation#Lawful_basis_for_processing

## Use and flow of the data

We use your data to do the following:

- to allow you to log in to the site. In this case your data stays in our main servers only.
- to send you an invoice, we never save your invoicing data, we delegate Stripe and Chargebee the storage and management of your data.
- as an Italian company we need to send electronic copy of all our invoices to the state. To do that we have an automated service that pulls the data from Chargebee and generates the invoices also on Fatture in Cloud. So your invoicing data will be both on Chargebee and Fatture in Cloud.
- to send you transactional emails about the service, promotional and marketing emails we use Mailchimp and Hubspot.
- on support request we ask your email address to contact you back and we share that information with Front, the service we use for customer care.
- when you fill the online forms and when you sign up we send the provided data to Pipedrive and Hubspot to improve the sale process.
- when an error occurs on the platform we automatically send some telemetry data to Rollbar to be notified about the errors and help us to resolve them. If the error happens on the CMS interface we also send the email address of the user to be able to easily get in touch to gain additional information.

## Duration of data retention

We store your data for the duration of your use of the system.

As soon as you cancel your account, your personal information is erased.

## Your rights over your personal data

We respect your right to do the following:

- request a copy of your data
- update your data
- request deletion of your data

Please contact us (at the address below) if you want to do any of the above.

## How to contact us

If you have any doubts, or wish to exercise your rights (as listed above),
please send us an email here: [support@datocms.com](mailto:support@datocms.com)

Latest update: February 24, 2023
