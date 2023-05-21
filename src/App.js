import React, { useState } from "react";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
import Chat from "./components/Chat";
import { db } from "./firebase-config";
import { collection } from "firebase/firestore";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
const cookies = new Cookies();

function App() {
  //required states:
  //1. isAuth verifies whether any user has logged in or not
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));

  //2. room is defined as the chat group id(whether it be group or private)
  const [room, setRoom] = useState(null);

  //3. isPrivate confirms if the chat is private or group
  const [isPrivate, setIsPrivate] = useState(false);

  //4. in case of a private chat, secondUser is defined as the second user of the chat
  const [secondUser, setSecondUser] = useState(null);

  //refrences to the 2 collections
  const messagesRef = collection(db, "messages");
  const usersRef = collection(db, "users");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            isAuth ? (
              <Home
                setIsAuth={setIsAuth}
                setRoom={setRoom}
                setIsPrivate={setIsPrivate}
                secondUser={secondUser}
                setSecondUser={setSecondUser}
                usersRef={usersRef}
              />
            ) : (
              <Auth setIsAuth={setIsAuth} usersRef={usersRef} />
            )
          }
        />{" "}
        <Route
          path="/chat"
          element={
            <Chat
              room={room}
              setRoom={setRoom}
              isPrivate={isPrivate}
              setIsPrivate={setIsPrivate}
              secondUser={secondUser}
              setSecondUser={setSecondUser}
              messagesRef={messagesRef}
            />
          }
        />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}

export default App;
