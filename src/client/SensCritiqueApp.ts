import firebase from "firebase";

export class SensCritiqueApp {

    public static readonly senscritiqueGQLApi = "https://gql.senscritique.com/graphql";

    public static readonly firebaseConfig = {
        apiKey: 'AIzaSyAHxGE6otUcjogt6EXNzXrAZJr99WZ1MdI',
        authDomain: 'fir-sc-ea332.firebaseapp.com',
        databaseURL: 'https://fir-sc-ea332.firebaseio.com',
        projectId: 'fir-sc-ea332',
        storageBucket: 'fir-sc-ea332.appspot.com'
    }

    public static readonly firebaseApp = firebase.initializeApp(SensCritiqueApp.firebaseConfig);

}