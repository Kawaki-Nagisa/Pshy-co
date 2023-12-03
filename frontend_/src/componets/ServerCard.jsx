import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const ServerCard = ({
  index,
  rectangular = true,
  serverName,
  serverDescription,
}) => {
  const navigate = useNavigate();

  const cardClass = rectangular
    ? "w-72 h-44"
    : "w-72 h-72 rounded-full overflow-hidden";
  const cardText = rectangular
    ? "bottom-0 left-0 p-4"
    : "inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 text-white text-center";

  const handleConnectClick = () => {
    navigate(`/chat`, { state: { index } });
  };

  return (
    <div className={`relative ${cardClass}`}>
      <div className="absolute inset-0">
        <img
          src="https://source.unsplash.com/random"
          alt="server background"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
      <div className={`absolute ${cardText}`}>
        <h1 className="text-white text-2xl font-bold">{serverName}</h1>
        {rectangular && (
          <p className="text-white text-sm">{serverDescription}</p>
        )}
      </div>
      {rectangular && (
        <div className="absolute bottom-0 right-0 m-4">
          <button
            className="bg-rose-800 text-white px-4 py-2 rounded shadow opacity-50 hover:opacity-100"
            onClick={handleConnectClick}
          >
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;

  let index;

  if (ownProps.hasOwnProperty('index')) {
    index = ownProps.index;
  } else {
    index = state.Servers.findIndex(member => member.serverData.id === id);
  }

  if (index !== -1) {
    return {
      index: index,
      serverName: state.Servers[index].serverData.name,
      serverDescription: state.Servers[index].serverData.description
    };
  } else {
    return {
      serverName: "Server not found",
      serverDescription: "Server not found"
    };
  }
};

export default connect(mapStateToProps)(ServerCard);

