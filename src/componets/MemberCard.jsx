import React from "react";
import { connect } from "react-redux";

const MemberCard = ({ username }) => {

  return (
    <div className="flex items-center justify-center">
      <div className="relative rounded-full overflow-hidden w-10 h-10">
        <img
          src="https://source.unsplash.com/random"
          alt="User Background"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 text-white text-center">
          <h1 className="font-bold text-xs">{username}</h1>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps;
    const index = state.Members.findIndex(member => member[0].id === id);
    if (index !== -1) {
      return {
        username: state.Members[index][0].user_alias,
      };
    } else {
      return {
        username: "User not found",
      };
    }
  };
  
  export default connect(mapStateToProps)(MemberCard);
  
  
