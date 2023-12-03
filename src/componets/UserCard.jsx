import React from 'react';
import { connect } from 'react-redux';

const UserCard = ({ size, username }) => {
  const cardSizeClass = size === 'small' ? 'w-10 h-10' : size === 'large' ? 'w-14 h-14' : 'w-12 h-12';
  const textSizeClass = size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm';

  return (
    <div className="flex items-center justify-center">
      <div className={`relative rounded-full overflow-hidden ${cardSizeClass}`}>
        <img
          src="https://source.unsplash.com/random"
          alt="User Background"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 text-white text-center">
          <h1 className={`font-bold ${textSizeClass}`}>{username}</h1>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.UserData.user.user_alias || 'John Doe',
  };
};

export default connect(mapStateToProps)(UserCard);
