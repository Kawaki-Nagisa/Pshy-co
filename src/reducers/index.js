const initialState = {
  UserData: [],
  Servers: [],
  Members:[],
  ChatMessages: [],
  accessToken: null,
  error: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        UserData: action.payload,
        Servers: [],
        accessToken: action.payload.accessToken,
        error: null,
      };

    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        UserData: [],
        error: action.payload.error,
      };

    case 'CREATE_SERVER_SUCCESS':
    case 'RETRIEVE_SERVER_SUCCESS':
        const newServer = action.payload;
        const existingServerIndex = state.Servers.findIndex(
          (server) => server.serverData.id === newServer.serverData.id
        );
        
  
        if (existingServerIndex === -1) {
          return {
            ...state,
            UserData: {
              ...state.UserData,
              servers: [...state.UserData.user.servers, newServer.serverData.id],
            },
            Servers: [...state.Servers, newServer],
            error: null,
          };
        } else {
          console.warn(`Server with ID ${newServer.serverData.id} already exists.`);
          return {
            ...state,
            error: `Server with ID ${newServer.serverData.id} already exists.`,
          }
        }
        

    case 'JOIN_SERVER_SUCCESS':
      return {
        ...state,
        UserData: {
          ...state.UserData,
          servers: [...state.UserData.user.servers, action.payload.serverId],
        },
        error: null,
      };

    case 'DELETE_SERVER_SUCCESS':
      return {
        ...state,
        Servers: state.Servers.filter(
          (server) => server.id !== action.payload
        ),
        error: null,
      };
    
      case "USER_RETERIVEAL_SUCCESS":
        const newMember = action.payload;
        if (!state.Members.some((member) => member[0].id === newMember[0].id)) {
          
          return {
            ...state,
            Members: [...state.Members, newMember],
            error: null,
          };
        } else {
          return state;
        }
      
      

    case 'CREATE_SERVER_FAILURE':
    case 'JOIN_SERVER_FAILURE':
    case 'DELETE_SERVER_FAILURE':
    case 'RETRIEVE_SERVER_FAILURE':
    case 'FETCH_SERVER_ERROR':
    case "USER_RETERIVEAL_FAILURE":
      return {
        ...state,
        error: action.payload.error,
      };

    case 'DELETE_CHAT_MESSAGE_SUCCESS':
      return {
        ...state,
        ChatMessages: state.ChatMessages.filter(
          (message) => message.id !== action.payload
        ),
        error: null,
      };
    case 'UPDATE_CHAT_MESSAGE_SUCCESS':
      const updatedMessageId = action.payload;  
      const updatedChatMessages = state.ChatMessages.map((message) => {  
      if (message.id === updatedMessageId) {
          return {
            ...message,
            content: action.payload.updatedContent,
          };
        }
        return message;
      });
    
      return {
        ...state,
        ChatMessages: updatedChatMessages,
        error: null,
      };
      
    case 'SEND_MESSAGE_SUCCESS':
    case 'RECEIVE_CHAT_MESSAGE':
      return {
        ...state,
        ChatMessages: [...state.ChatMessages, action.payload],
        error: null,
      };
    case 'GET_CHAT_MESSAGES_SUCCESS': 
    return {
        ...state,
        ChatMessages: action.payload,
        error: null,
      };

    case 'DELETE_CHAT_MESSAGE_FAILURE':
    case 'UPDATE_CHAT_MESSAGE_FAILURE':
    case 'SEND_MESSAGE_FAILURE':
    case 'GET_CHAT_MESSAGES_FAILURE':
    case 'FETCH_CHAT_MESSAGES_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };


    case 'CHANGE_PASSWORD_SUCCESS':
      return {
        ...state,
        error: null,
      };

    case 'CHANGE_PASSWORD_FAILURE':
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export default rootReducer;
