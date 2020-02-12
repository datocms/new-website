import s from './style.css';
import GenericIntegrationsBanner from 'components/GenericIntegrationsBanner';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export const QUERY = gql`
  query IntegrationsBannerQuery(
    $limit: IntType!
    $integrationType: LinkFilter!
  ) {
    allIntegrations(
      first: $limit
      filter: { integrationType: $integrationType }
    ) {
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

export default function IntegrationsBanner({ integrationTypeId, ...other }) {
  const { loading, error, data } = useQuery(QUERY, {
    variables: {
      limit: 30,
      integrationType: Array.isArray(integrationTypeId)
        ? { in: integrationTypeId }
        : { eq: integrationTypeId },
    },
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
