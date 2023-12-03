import React, { useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, receiveChatMessage, getChatMessages } from "../actions";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const ChatBox = ({ index }) => {
  const dispatch = useDispatch();
  const serverData = useSelector((state) => state.Servers[index].serverData);
  const name = useSelector((state) => state.UserData.user.id);
  const [value, setValue] = React.useState("");
  const webSocketRef = useRef(null);

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (serverData) {
      const webSocketUrl = `ws://127.0.0.1:8000/ws/${serverData.name}/`;
      const newWebSocket = new W3CWebSocket(webSocketUrl);

      newWebSocket.onopen = () => {
        webSocketRef.current = newWebSocket;
      };

      newWebSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          dispatch(receiveChatMessage(message));
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      newWebSocket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      return () => {
        newWebSocket.close();
      };
    }
  }, [dispatch, serverData]);

  const handleSendMessage = () => {
    if (
      webSocketRef.current &&
      webSocketRef.current.readyState === W3CWebSocket.OPEN
    ) {
      const message = {
        content: value,
        sender: name,
        server: serverData.id,
      };

      webSocketRef.current.send(JSON.stringify(message));
      dispatch(sendMessage(message));
      setValue("");
    } else {
      console.error("WebSocket connection is not open.");
    }
  };

  useEffect(() => {
    if (serverData) {
      dispatch(getChatMessages(serverData.id))
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Error fetching messages:", error);
          setLoading(false);
        });
    }
  }, [dispatch, handleSendMessage, serverData]);
  const messages = useSelector((state) => state.ChatMessages);
  useEffect(() => {
  }, [messages]);

  return (
    <div>
      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="outline outline-offset-5 outline-gray-500 h-78 flex flex-col bg-gradient-to-t from-stone-950 to-transparent space-y-10">
          <div className="px-8 space-y-5">
            {messages.chatMessages.map((msg, index) => (
              <Message key={msg.id} index={index} />
            ))}
          </div>
          <div className="w-full px-8 py-4 bg-gradient-t from-stone-950 to-transparent  grid grid-flow-col-dense auto-col-max justify-items-center">
            <input
              type="text"
              placeholder="Type your message"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="px-4 py-2 w-full col-span-12 placeholder:text-rose-950 placeholder:hover:text-rose-800 placeholder:font-bold text-slate-400 rounded-full bg-transparent focus:outline-none focus:ring focus:ring-rose-800"
            />
            <button
              onClick={() => handleSendMessage()}
              className="flex self-center justify-self-end items-center justify-center w-8 h-8 outline-none text-neutral-900 outline-rose-800 rounded-full hover:bg-neutral-900 hover:text-rose-800"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
