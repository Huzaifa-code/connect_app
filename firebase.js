import * as firebase from 'firebase/compat';
import "firebase/firestore";
import "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCQlilRnBsIdsz7Q0l4u5dCd8F0JIXXA9c",
    authDomain: "signal-clone-73a18.firebaseapp.com",
    projectId: "signal-clone-73a18",
    storageBucket: "signal-clone-73a18.appspot.com",
    messagingSenderId: "506226393944",
    appId: "1:506226393944:web:bea88ae525dbeb82b15b2d"
};

let app;

if(firebase.apps.length == 0){
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
// const storage = firebase.storage();
const storage = getStorage(app);

export { db, auth, storage };