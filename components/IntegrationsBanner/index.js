import s from './style.css';
import GenericIntegrationsBanner from 'components/GenericIntegrationsBanner';
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

export default function IntegrationsBanner({ bubbles, ...other }) {
  const { loading, error, data } = useQuery(QUERY, {
    variables: { limit: 30 },
  });

  if (loading || error) {
    return 'Loading...';
  }

  const { allIntegrations } = data;

  return (
    <GenericIntegrationsBanner
      {...other}
      bubbles={allIntegrations.map(integration => (
        <img
          key={integration.id}
          src={
            integration.squareLogo
              ? integration.squareLogo.url
              : integration.logo.url
          }
        />
      ))}
    />
  );
}
