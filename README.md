# SensCritique (unofficial) GraphQL API

## Disclaimer
Neither I, nor any developer who contributed to this project, accept any kind of liability for your use of this library.

This package is not endorsed or affiliated with SensCritique, SensCritique.com, or SENSCRITIQUE SARL.

## API Considerations

As SensCritique is mostly using GraphQL (except for authentication and registration), this API client is just a prepared GraphQL client with some query samples. It also includes Firebase authentication (user/password only for the moment). 

In order to help you to build queries, a Postman collection is attached with some useful queries (add wishes, add to list, search product...).

You can also find the GraphQL schema in the documentation. 

## Installation

```
npm i senscritique-graphql-api --save
``` 

## Usage 

Here is an example of usage that fetch your user details. 

```
import {SensCritiqueGqlClient} from "./SensCritiqueGqlClient";
import {gql} from "graphql-request";

const query = gql`
    query Me($avatarSize: String) {
        me {    
            id
            medias(avatarSize: $avatarSize) {
                avatar
                __typename
            }
            name
            __typename
        }
    }
`

const variables = {
    avatarSize: "70x70",
}

SensCritiqueGqlClient.build("youremailaddress@domain.com", "password").then(client => {
    client.request(query, variables).then(data => {
        console.log(JSON.stringify(data, undefined, 2))
    })
});
```

## User credentials persistence

You can dump the UserCredentials from the `SensCritiqueGqlClient` and serialize it to save its state (access token...).

```typescript
import {SensCritiqueGqlClient} from "./SensCritiqueGqlClient";

const client = SensCritiqueGqlClient.build("youremailaddress@domain.com", "password").then(client => {
    client.request(query, variables).then(data => {
        console.log(JSON.stringify(data, undefined, 2))
    })
});

const serializedUser = client.user.toJSON();

// Store it securely
``` 

```typescript

// Read serialized user from disk
const serializedUser = JSON.parse(serializedUserCredentials);
const user: firebase.User = new (firebase as any).User(serializedUser, serializedUser.stsTokenManager, serializedUser);
SensCritiqueApp.firebaseApp.auth().updateCurrentUser(user);
```