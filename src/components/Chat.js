import { useState, React, useEffect } from "react";
import {
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth} from "../firebase-config";
import "../styles/Chat.css";

const Chat = (props) => {
  const { room, setRoom, isPrivate, setIsPrivate, secondUser, setSecondUser,messagesRef } = props;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  //current user
  const currUser = {
    displayName: auth.currentUser.displayName,
    email: auth.currentUser.email,
    photoURL: auth.currentUser.photoURL,
  };

  //fetching the messages of the respective room
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      console.log(snapshot);
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log("NEWMESSAGE");
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [room]);

  //adds the new message to the messages collection in database 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: currUser,
      room,
    });

    setNewMessage("");
  };
  
  return (
    <div className="chat-app">
      <div className="header">
        {isPrivate ? <h1>{secondUser.displayName}</h1> : <h1> Welcome to: {room.toUpperCase()} </h1>}
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div className={`message ${message.user.email===currUser.email && "right-align"}`} key={message.id}>
            {message.user.email !== currUser.email && <div className="sender">
            {!isPrivate && <img className="user-photo-msg" src={message.user.photoURL} alt="user"/>}
            <span
              className="user"
              onClick={() => {
                if (currUser.email === message.user.email) return;
                setIsPrivate(true);
                setSecondUser(message.user);
                setRoom(
                  currUser.email > message.user.email
                    ? currUser.email + message.user.email
                    : message.user.email + currUser.email
                );
              }}
            >
              {message.user.displayName}
            </span>
            </div>}
            
            <div className="msg-container">
              <span className="msg-txt">
            {message.text}
            </span>
            </div>
            {/* <div className="timestamp-container">
              <span className="timestamp">{Date(message.createdAt).trim()}</span>
            </div> */}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          className="new-message-input"
          placeholder="Type your message here..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />{" "}
        <button type="submit" className="send-button">
          Send
        </button> 
      </form>
    </div>
  );
};

export default Chat;
