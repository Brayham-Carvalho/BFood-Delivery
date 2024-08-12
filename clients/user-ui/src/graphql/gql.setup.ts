import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { create } from "domain";
import { access } from "fs";
import Cookies from "js-cookie"; // Add this import

const httpLink = createHttpLink({ uri: process.env.NEXT_PUBLIC_SERVER_URI });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      accesstoken: Cookies.get("access_token"),
      refreshToken: Cookies.get("refresh_token"),
    },
  });
  return forward(operation);
});

export const graphQlClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
});
