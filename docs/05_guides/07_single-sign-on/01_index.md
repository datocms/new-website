---
title: Introduction to Single Sign-On
excerpt: Learn how to simplify your organization sign-in experience with automatic provisioning of users
---

Single Sign-On (SSO) allows users to use a single login for multiple applications, simplifying the lives of both IT and your team on DatoCMS. Our SAML + SCIM implementation will allow team members to sign in securely through any identity provider.

Single Sign-On is only available for Ultimate and Enterprise plans.

### Supported Identity Providers

You can integrate DatoCMS with any provider that uses SAML 2.0 + Scim 2.0. The following articles provide instructions for specific providers.

* [Okta](/docs/guides/single-sign-on/configure-sso-with-okta)
* [One Login](/docs/guides/single-sign-on/configure-sso-with-onelogin)
* Microsoft Azure Active Directory

### SSO Authentication process

When a user attempts to access an SSO-enabled protected resource, such as a DatoCMS project or administration console, the user is redirected to the identity provider. If the user still has an active session with the identity provider, the user is automatically redirected to the desired resource. If the user does not have an active session, the user is prompted to enter credentials. Once authenticated, the user has access for a configurable period of time to all resources protected by the identity provider.

* Service provider: DatoCMS
* User agent: The user web browers
* Identity provider: Any SAML 2.0 identity provider that supports SAML HTTP POST binding

The following diagram describes how the DatoCMS platform components and the SSO identity provider interact.

1. When a user attempts to sign in, the user agent sends a sign-in request to the service provider.
2. The service provider refers the user agent to the identity provider's SSO URL.
3. The user agent sends an authentication request to the identity provider.
4. The identity provider authenticates the user and provides the user agent with a SAML authentication token.
5. The user agent sends the authentication token to the service provider.
6. The service provider accepts the authentication token and grants the user access to the user agent.
