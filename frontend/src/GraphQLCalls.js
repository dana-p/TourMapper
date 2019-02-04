import gql from "graphql-tag";

// ************ TOURS ****************

export const AllToursQuery = gql`
  {
    tours {
      id
      title
      description
      location
      comments {
        comment
      }
    }
  }
`;

export const TourQuery = gql`
  query GetTour($id: ID!) {
    tour(id: $id) {
      id
      title
      description
      attractions {
        title
        description
        markerPosition {
          lat
          lng
        }
      }
      author
      authorId
      comments {
        comment
        author
      }
    }
  }
`;

export const ToursByUser = gql`
  query GetToursByUser($userId: String!) {
    toursByUser(userId: $userId) {
      id
      title
      description
      location
      comments {
        comment
      }
    }
  }
`;

export const DeleteTour = gql`
  mutation DeleteTour($id: ID!) {
    deleteTour(id: $id) {
      id
      title
      description
      comments {
        comment
      }
    }
  }
`;

export const CreateTourMutation = gql`
  mutation CreateTour(
    $title: String!
    $description: String!
    $location: String!
    $attractions: String!
  ) {
    createTour(
      title: $title
      description: $description
      location: $location
      attractions: $attractions
    ) {
      id
      title
      description
      location
      attractions {
        title
      }
      comments {
        comment
        author
      }
    }
  }
`; // DANATODO: Do I need to return comments?

export const SubmitCommentMutation = gql`
  mutation AddComment($id: ID!, $comment: String!) {
    addCommentToTour(id: $id, comment: $comment) {
      id
      title
      description
      attractions {
        title
        description
        markerPosition {
          lat
          lng
        }
      }
      comments {
        comment
        author
      }
    }
  }
`;

// ************ USER ****************

export const UserQuery = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      picture
      email
      tours
      paypal
    }
  }
`;

export const AddPaypalAndEmail = gql`
  mutation AddPaypalAndEmail($id: ID!, $paypal: String, $email: String) {
    addPaypalAndEmail(id: $id, paypal: $paypal, email: $email) {
      id
      name
      picture
      email
      paypal
    }
  }
`;

export const GetUser = gql`
  mutation {
    createUser {
      id
      name
      email
      tours
      firstName
      lastName
      userIdentifier
      picture
    }
  }
`; // DANATODO: Do I need more information for the tours? Do I even need the tours???
