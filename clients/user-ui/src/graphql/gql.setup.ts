import { ApolloClient, InMemoryCache } from "@apollo/client";

console.log(process.env.SERVER_URI);

export const graphQlClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SERVER_URI,
  cache: new InMemoryCache(),
});
