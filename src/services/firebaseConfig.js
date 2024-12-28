import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQNwOE6jmM8g3A46JbVY1L_GxvhWPqBk8",
  authDomain: "trinhdeptrai-84120.firebaseapp.com",
  databaseURL: "https://trinhdeptrai-84120-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trinhdeptrai-84120",
  storageBucket: "trinhdeptrai-84120.appspot.com",
  messagingSenderId: "175262163725",
  appId: "1:175262163725:web:462ac9a003be3103c74644",
  measurementId: "G-WSZLD85T8D"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
var db = getFirestore(app);

const provider = new GoogleAuthProvider();

export function Stater() {
  const [authState, setAuthState] = useState();

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      let some = document.querySelectorAll('[class*="logged"]');
      let signElements = document.querySelectorAll('.sign');
      if (user) {
        for (let i = 0; i < some.length; i++) {
          some[i].style.display = "unset";
        }
        for (let i = 0; i < signElements.length; i++) {
          signElements[i].style.display = "none";
        }
        const name = document.querySelector("#displayName");
        if(name) {
          name.innerHTML = user.displayName;
        }
        const avatarElement = document.querySelector("#profileAvatar");
        if (avatarElement) {
          avatarElement.src = user.photoURL || `require("../../images/Avatar.png")`;
        }
      } else {
        for (let i = 0; i < some.length; i++) {
          some[i].style.display = "none";
        }
        for (let i = 0; i < signElements.length; i++) {
          signElements[i].style.display = "block";
        }
      }
    });
  }, [authState]);

  this.signInWithGoogle = () => {
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        setAuthState();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
      });
  };

  this.signOutWithGoogle = () => {
    getAuth()
      .signOut()
      .then(() => {
        setAuthState();
        window.location = "/";
      })
      .catch((e) => console.log(e));
  };
}
// export storage;
// export default db;
export var storage = getStorage(app);
export var auth = getAuth(app);
// export var firestore = db;
export default db;
