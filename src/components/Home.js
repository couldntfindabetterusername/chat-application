import React, { useRef } from "react";
import Cookies from "universal-cookie";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import "../styles/Home.css";
import { onSnapshot, query, where } from "firebase/firestore";
import { useNavigate } from "react-router";
const cookies = new Cookies();

const Home = (props) => {
  const {
    setIsAuth,
    setRoom,
    setIsPrivate,
    secondUser,
    setSecondUser,
    usersRef,
  } = props;

  //room input and private chat email input refrences
  const roomInputRef = useRef();
  const userInputRef = useRef();

  const navigate = useNavigate();

  //signout is an inbuilt firebase authentication function where we just delete the cookie from user's application
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  //here we check if the entered email is a registered email or not. If it is not registered then user is notified and if it is registered then user is redirected to the private chat window
  const handleEnterPrivatChat = () => {
    const q = query(usersRef, where("email", "==", userInputRef.current.value));
    onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length === 0) {
        window.alert("User doesn't exist");
        setSecondUser(null);
      } else {
        snapshot.forEach((doc) => {
          setSecondUser(doc.data());
        });
      }
    });

    if (secondUser && secondUser.email !== auth.currentUser.email) {
      setIsPrivate(true);
      setRoom(
        userInputRef.current.value > auth.currentUser.email
          ? userInputRef.current.value + auth.currentUser.email
          : auth.currentUser.email + userInputRef.current.value
      );
      navigate("/chat");
    }
  };

  //navigates to the room's chat window
  const handleEnterRoom = () => {
    setRoom(roomInputRef.current.value);
    navigate("/chat");
  };

  return (
    <>
      <div className="container">
        <div className="room">
          <section>
            <label> Enter Room Name: </label> <input ref={roomInputRef} />
            <button onClick={() => handleEnterRoom()}> Enter Room </button>{" "}
          </section>{" "}
          <section>
            <span> OR </span>{" "}
          </section>{" "}
          <section>
            <label> Enter email to chat privately: </label>{" "}
            <input ref={userInputRef} />{" "}
            <button onClick={() => handleEnterPrivatChat()}>
              {" "}
              Enter Chat{" "}
            </button>{" "}
          </section>{" "}
        </div>{" "}
        <div className="sign-out">
          <button onClick={signUserOut}> Sign Out </button>{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
};

export default Home;
