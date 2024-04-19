import * as firebase from 'firebase/compat';
import "firebase/firestore";
import "firebase/auth";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


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


const loginGoogle = () => {

  const provider = new GoogleAuthProvider();

  return  auth.signInWithPopup(provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    return result;
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

}



export { db, auth, storage, loginGoogle };