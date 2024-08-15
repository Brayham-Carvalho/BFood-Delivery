"use client";

import { gql, DocumentNode } from "@apollo/client";

export const RESET_PASSWORD: DocumentNode = gql`
  query {
   mutation resetPassword( $password: String!, $activationToken: String! ) {
      resetPassword(resetPasswordDto: { password: $password, activationToken: $activationToken }) {
        user{
            id
            name
            email
            role
            password

        }
    }
  }
`;
