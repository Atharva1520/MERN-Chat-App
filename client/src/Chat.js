import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="w-1/3 flex flex-col h-1/2 bg-gray-200 rounded-lg overflow-hidden">
    <div className="chat-header bg-blue-500 text-white py-2 px-4">
      <p className="text-lg font-bold">Live Chat</p>
    </div>
    <div className="chat-body flex-1 overflow-y-auto">
    <ScrollToBottom className="p-4">
  {messageList.map((messageContent, index) => (
    <div
      key={index}
      className={`flex ${
        username === messageContent.author ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div>
        <div className="text-lg">
          <p>{messageContent.message}</p>
        </div>
        <div className="gap-1 flex justify-between text-sm text-gray-500">
        <p>{messageContent.author}</p>
        <p>{messageContent.time}</p>
        </div>
      </div>
    </div>
  ))}
</ScrollToBottom>
    </div>
    <div className="flex justify-between bg-gray-300 p-4">
      <input
        type="text"
        value={currentMessage}
        placeholder="Type a Message"
        className="border border-gray-400 p-2 rounded focus:outline-none w-5/6"
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
        onKeyPress={(event) => {
          event.key === "Enter" && sendMessage();
        }}
      />
      <button
        onClick={sendMessage}
        className="ml-2 w-1/6 bg-blue-500 text-white p-2 rounded focus:outline-none"
      >
        &#9658;
      </button>
    </div>
  </div>
  
  );
}

export default Chat;