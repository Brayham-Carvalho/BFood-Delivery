import { metadata } from "../../app/layout";
import { access } from "fs";
("use client");

import { gql, DocumentNode } from "@apollo/client";

export const LOGIN_USER: DocumentNode = gql`
  mutation LoginUser($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      user {
        id
        name
        email
        password
        address
        phone_number
      }
      accessToken
      refreshToken
      error {
        message
      }
    }
  }
`;
