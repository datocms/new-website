import { LanguageConsumer } from 'components/LanguagePicker';
import Link from 'next/link';

const types = (t) => (Array.isArray(t) ? t : [t]);

const retrieveJobUrl = '/docs/content-management-api/resources/job-result/self';

export default function TargetSchema({ link }) {
  if (!link.targetSchema && !link.jobSchema) {
    return null;
  }

  const schema = link.jobSchema || link.targetSchema;
  const { data } = schema.properties;

  const isArray = types(data.type).includes('array') && data.items;
  const returnType = isArray ? data.items : data;

  if (!returnType.properties) {
    return null;
  }

  const resource = returnType.properties.type.example;
  const resourceUrl = `/docs/content-management-api/resources/${resource.replace(
    /_/g,
    '-',
  )}`;
  const resourceLink = (
    <Link href={resourceUrl}>
      <a>{resource}</a>
    </Link>
  );
  const returnDescription = isArray ? (
    <>an array of {resourceLink} resource objects</>
  ) : (
    <>a {resourceLink} resource object</>
  );

  return (
    <LanguageConsumer>
      {(language) => (
        <>
          <h2>Returns</h2>
          {language === 'http' ? (
            <>
              Returns{' '}
              {link.jobSchema ? (
                <>
                  a Job ID. You can then poll for the{' '}
                  <Link href={retrieveJobUrl}>completion of the job</Link>, that
                  will eventually return {returnDescription}
                </>
              ) : (
                returnDescription
              )}
              .
            </>
          ) : (
            <>Returns {returnDescription}.</>
          )}
        </>
      )}
    </LanguageConsumer>
  );
}
