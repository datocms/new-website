import s from './style.css';
import Wrapper from 'components/Wrapper';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export const QUERY = gql`
  query IntegrationsBannerQuery($limit: IntType!) {
    allIntegrations(first: $limit) {
      id

      logo {
        url
      }
      squareLogo {
        url
      }
    }
  }
`;

export default function IntegrationsBanner({ title, children }) {
  const { loading, error, data } = useQuery(QUERY, {
    variables: { limit: 30 },
  });

  if (loading || error) {
    return 'Loading...';
  }

  const { allIntegrations } = data;

  return (
    <div className={s.root}>
      <div className={s.background}>
        <div className={s.backgroundInner}>
          {allIntegrations.map(integration => (
            <div className={s.backgroundImage} key={integration.id}>
              <div className={s.backgroundImageInner}>
                <img
                  src={
                    integration.squareLogo
                      ? integration.squareLogo.url
                      : integration.logo.url
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Wrapper>
        <div className={s.foreground}>
          <div className={s.body}>
            <div className={s.title}>{title}</div>
            <div className={s.content}>{children}</div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
