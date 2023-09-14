import { useState, useMemo } from "react";
import { Socket } from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";

interface PropTypes {
  socket: Socket;
  username: string;
  room: string;
}

interface Message {
  room: string;
  author: string;
  message: string;
  time: string;
}

export default function Chat({ socket, username, room }: PropTypes) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes() +
          ":" +
          new Date(Date.now()).getSeconds(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((oldList) => [...oldList, messageData]);
      setCurrentMessage("");
    }
  };

  useMemo(() => {
    socket.on("receive_message", (data) => {
      setMessageList((oldList) => [...oldList, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((message, index) => (
            <div
              className="message"
              key={index}
              id={username === message.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{message.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{message.time}</p>
                  <p id="author">{message.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type Message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}
