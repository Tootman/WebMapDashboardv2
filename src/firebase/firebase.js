import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const prodConfig = {
    apiKey: "AIzaSyB977vJdWTGA-JJ03xotQkeu8X4_Ds_BLQ",
  authDomain: "fir-realtime-db-24299.firebaseapp.com",
  databaseURL: "https://fir-realtime-db-24299.firebaseio.com",
  projectId: "fir-realtime-db-24299",
  storageBucket: "fir-realtime-db-24299.appspot.com",
  messagingSenderId: "546067641349"
};

const devConfig = {
    apiKey: "AIzaSyB977vJdWTGA-JJ03xotQkeu8X4_Ds_BLQ",
  authDomain: "fir-realtime-db-24299.firebaseapp.com",
  databaseURL: "https://fir-realtime-db-24299.firebaseio.com",
  projectId: "fir-realtime-db-24299",
  storageBucket: "fir-realtime-db-24299.appspot.com",
  messagingSenderId: "546067641349"
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();


 const getRelatedData  =  (mapIndex) =>{
  console.log("hello from geteRelatedData")
}






export {
  db,
  auth,
  getRelatedData
};
