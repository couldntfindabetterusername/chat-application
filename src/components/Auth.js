import React from "react";
import { auth, provider } from "../firebase-config.js";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import "../styles/Auth.css";
import { addDoc, onSnapshot, query, where } from "firebase/firestore";

const cookies = new Cookies();

const Auth = (props) => {
  const { setIsAuth, usersRef } = props;

  const signInwithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // console.log(result);

      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
      console.log(usersRef);
      const q = query(usersRef, where("email", "==", result.user.email));
      onSnapshot(q, (snapshot) => {
        console.log(snapshot.docs);
        if (snapshot.docs.length === 0) {
          addDoc(usersRef, {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          });
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="auth">
      <p> Chat with your friends and family here.Login to begin </p>{" "}
      <button onClick={signInwithGoogle}> Sign in with Google </button>{" "}
    </div>
  );
};

export default Auth;
