In this document we are going to analyze how DatoCMS works, what are the main security choices that we've taken and what are our main security policies in the company.

### Infrastructure

Our hard infrastructure is made of servers running our main application and its ancillary services plus a global network of delivery that moves the data from DatoCMS to its final destination.

#### Data centers

Our application run on the best data centers in the world, all of them ensure compliance with the most known industry standards:

- **ISO 27001**
- **SOC 1 and SOC 2**

Physical security of the data centers is also certified at various levels by all the data centers we use.

Data centers guarantee 24/7 security guard services, intrusion detection systems and stringent policies for personnel access. Only the minimal number of people are allowed in the data centers and their actions are routinely audited.

All the data centers have also backup battery and generators to provide energy in case of black out.

Risk of fire has been reduced with automatic fire detection and suppression equipment.

**All our servers are based in Europe**, shared between Ireland, UK, Netherlands and Germany.

#### Network

All our servers and services are protected by firewalls that let traffic through explicitely allowed ports and protocols. Even applications on the same host cannot communicate via localhost, to further improve network separation from other virtual machines.

**Our global CDN provides DDoS mitigation techniques** to spread the load across the globe and minimise the impact of those attacks.

**Automatic Web Application Firewalls are enabled in front of our applications**, to prevent the most common attacks to be performed. In particular the top 10 OWASP vulnerabilities are always tested plus a set of custom dynamic rules are enforced to maximise the protection while adding less than 1ms of latency.

**Every connection to our service and in between services is encrypted using TLS**. This guarantees that all the traffic securely traverse our services and reach our users without being snooped or compromised.

**We enforce a network rate limit** to prevent malicious actors to degrade performance across different accounts and guarantee a good performance to everyone.

#### More details

Read more about the security policies of the infrastructure providers that we use:

- [Heroku](https://www.heroku.com/policy/security)
- [Digital Ocean](https://www.digitalocean.com/legal/compliance/)
- [AWS](https://aws.amazon.com/security/)
- [Netlify](https://www.netlify.com/security/)
- [Cloudflare](https://www.cloudflare.com/security/)
- [Fastly](https://docs.fastly.com/en/guides/security-program)

### Application

Our web servers are running in self contained environments, with isolate processes, memory, and file system. We are using standard Heroku dynos, more details on their [dyno page](https://devcenter.heroku.com/articles/dynos#isolation-and-security).

#### PCI

To process the payments we use [Stripe](https://stripe.com/docs/security/stripe) and [Chargebee](https://www.chargebee.com/security/). Both of them are PCI compliant for encrypting and processing credit card payments. We don't handle directly any credit card detail.

#### Development

Every change made in the production environment has previously passed a set of automated tests and we routinely do manual testing to ensure that the application has a consistent and expected behaviour.

We have warnings in place from our continuous integration system about logical errors and also coding style violations, which helps us maintain a quality code base, which means that is clean and more secure.

Routinely we upgrade dependencies in order to keep our development processes as up to date as possible while bringing on all the security fixes that the tools implement.

#### Third parties

We interact with many third parties that are useful for various parts of the application. In every case we give access to the minimal set of information that we need to give them and for every third party we use a unique password/access token. In doing this we try to minimise the risk of one system being compromised and having access to everything else.

We make sure that every third party that we use is as careful as we are on security.

Here's the list of the third parties that we are using with links to their security or compliance page and why we use them:

- [Redis Labs](https://redislabs.com/company/compliance-and-privacy/) as a caching layer and as a volatile database
- [Scout APM](https://docs.scoutapm.com/#security) to find performance bottlenecks on our server

### Data

All the **data is encrypted in transit with TLS**, both internally between services and externally when reaching the users.

All our **database data are encrypted at rest**. We retain database backups for up to a week.

If you delete your project we delete all data from the live database immediately but we'll retain copies in our backups that are not accessible from the live system.

The user passwords are hashed using Bcrypt and then stored in our database.

#### What the users can do to protect their account

**We provide Single Sign-On capabilites** using SAML via Okta and OneLogin. This allows Enterprise users to safely provision and deprovision users while doing their usual workflow. We also allow group/role management integrated with the SSO providers.

**2 Factor Authentication is available for everyone**, adding a layer of security to prevent unintended access to someone's account. On a project basis you can enforce collaborators to have 2FA enabled, to prevent one compromised password to gain access to an entire project.

**Passwords have a minimum complexity level** that have to be matched. In particular we ask our users to have at least a lowercase letter, uppercase letter, a number and a minimum length of 8 characters.

From the CMS interface you can very **easily rotate the API tokens** used to access the API programmatically, allowing a smooth process to rotate the access keys across projects. The rotation is also possible using the APIs, making the process completely automatic.

**Each user can have a specific role** attached which allows a very granular configuration on what is visible and editable for each role. The roles can be customised and created by the project admins.

### Reliability

**Our entire infrastructure is highly reliable and easy to reproduce by design**. We rely on Heroku's platform-as-a-service which means that we are able to reprovision our entire application in a single deploy.

Our network is globally distributed. We use two layers of caching, helping our servers to serve as little calls as possible, reducing the risk of downtime in case of server issues.

In case of incidents we have a team of developers getting notifications on their mobile phone, so that they can take action as soon as possible. We are alerted in case of high error rate or servers unreachable.

We collect status metrics both on our servers and from third parties making checks from servers spread all across the globe, giving us a good visibility on our CDN current status. We expose a public report on our [status page](https://status.datocms.com/).

### People

DatoCMS's team is made of highly trained professionals that are very careful with their own personal security.

Nevertheless we have the following team policies:

- **2FA**: we access all the services hosting DatoCMS with 2FA-enabled accounts
- **remote access**: we minimise the access points to our production environment
- **computer security**: we enforce strong passwords for our computers, we encrypt disks, we use password managers to create strong passwords and store them safely.

Our offices are also secured with CCTVs and alarm systems.

### Vulnerability disclosure

If you have found a security vulnerability, please get in touch via [security@datocms.com](mailto:security@datocms.com). You can encrypt the message with our PGP key that you can find [on our site](https://www.datocms.com/.well-known/DatoCMS_security_pub.asc) and on [keys.openpgp.org](https://keys.openpgp.org/search?q=3FBD73EFD6C5268A21C33FE27B94FBC69CD5C678).
