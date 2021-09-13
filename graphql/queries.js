import gql from "graphql-tag";

export const categories = gql`
  query {
    categories {
      id
      name
      icon
      description
      img
      slug
    }
  }
`;

export const category = gql`
  query($id: ID!) {
    category(id: $id) {
      description
    }
  }
`;
