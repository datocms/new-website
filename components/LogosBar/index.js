import { useQuery } from "@apollo/react-hooks";
import Wrapper from "components/Wrapper";
import gql from "graphql-tag";

import s from "./style.css";

export const QUERY = gql`
  query LogosBarQuery($limit: IntType!) {
    allCustomers(first: $limit) {
      id
      name
      logo {
        url
      }
    }
  }
`;

export default function LogosBar({ limit = 6 }) {
  const { loading, error, data } = useQuery(QUERY, { variables: { limit } });

  if (loading || error) {
    return "Loading...";
  }

  const { allCustomers } = data;

  return (
    <Wrapper>
      <div className={s.root}>
        {allCustomers.map(customer => (
          <div className={s.logo} key={customer.id}>
            <img src={customer.logo.url} />
          </div>
        ))}
      </div>
    </Wrapper>
  );
}
