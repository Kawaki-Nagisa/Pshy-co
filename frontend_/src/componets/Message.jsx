import React from "react";
import { connect } from "react-redux";
import { MemberCard } from ".";

const Message = ({ user_id, isSender, message, timestamp }) => {
  const messageClass = isSender
    ? "bg-gradient-to-r from-rose-800 to-transparent hover:outline hover: outline-offset-2 hover:outline-cyan-600"
    : "bg-gradient-to-l from-slate-800 to-transparent hover:outline hover: outline-offset-2 hover:outline-rose-600";
  const containerClass = isSender ? "flex-row-reverse" : "flex-row";


  return (
    <div className={` flex flex-row items-center space-x-4 ${containerClass}`}>
      <MemberCard id={user_id}/>
      <div
        className={`font-bold mx-10 px-4 text-neutral-200 rounded-xl ${messageClass}`}
      >
        <span>{message}</span>
        <span className="text-green-600">{timestamp}</span>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { messageId, index } = ownProps;
  const message = state.ChatMessages.chatMessages[index]
  return {
    user_id: message.sender,
    isSender: message.sender === state.UserData.user.id,
    message: message.content || "(Loading)",
    timestamp: message.timestamp || "09:11",
  };
};
export default connect(mapStateToProps)(Message);
