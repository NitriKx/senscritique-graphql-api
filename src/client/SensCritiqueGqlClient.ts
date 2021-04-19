import { GraphQLClient } from "graphql-request";
import firebase from "firebase";
import { SensCritiqueApp } from "./SensCritiqueApp";
import {GraphQLError, RequestDocument, Variables} from "graphql-request/dist/types";
import {Headers, RequestInit} from "graphql-request/dist/types.dom";
import { decode } from "jose/util/base64url";
import {TextDecoder} from "util";

export class SensCritiqueGqlClient extends GraphQLClient {
    private idToken: string | null = null;

    constructor(url: string, public readonly userCredentials: firebase.auth.UserCredential) {
        super(url);
    }

    public static async build(email: string, password: string): Promise<SensCritiqueGqlClient> {
        return SensCritiqueApp.firebaseApp.auth().signInWithEmailAndPassword(email, password).then(userCredentials => {
            return new SensCritiqueGqlClient(SensCritiqueApp.senscritiqueGQLApi, userCredentials);
        })
    }

    public static buildFromState(userCredentials: firebase.auth.UserCredential): SensCritiqueGqlClient {
        return new SensCritiqueGqlClient(SensCritiqueApp.senscritiqueGQLApi, userCredentials);
    }

    async rawRequest<T = any, V = Variables>(query: string, variables?: V, requestHeaders?: RequestInit["headers"]): Promise<{ data?: T; extensions?: any; headers: Headers; status: number; errors?: GraphQLError[] }> {
        // Refresh the ID token in the headers
        const idToken = await this.getIdToken();
        this.setHeader("Authorization", idToken);
        return super.rawRequest(query, variables, requestHeaders);
    }

    async request<T = any, V = Variables>(document: RequestDocument, variables?: V, requestHeaders?: RequestInit["headers"]): Promise<T> {
        // Inject the ID token in the request
        const idToken = await this.getIdToken();
        this.setHeader("Authorization", idToken);
        return super.request(document, variables, requestHeaders);
    }



    /**
     *
     * @private
     */
    public getIdToken(): Promise<string> {
        if (this.idToken) {
            // Check if the token is expired
            const claims = JSON.parse(new TextDecoder().decode(decode(this.idToken.split('.')[1])));
            const expirationMillis = claims.exp * 1000;
            if (expirationMillis) {
                const now = new Date();
                const utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
                // If the token is not expired we return it as is
                if (expirationMillis > utc_timestamp) {
                    const token = this.idToken;
                    return new Promise(resolve => resolve(token));
                }
            }
        }

        // If the token has never been created or is expired, we request a new one
        if (this.userCredentials.user) {
            return this.userCredentials.user?.getIdToken().then((idToken) => {
               this.idToken = idToken;
               return idToken;
            });
        } else {
            throw new Error("User is undefined")
        }
    }

}