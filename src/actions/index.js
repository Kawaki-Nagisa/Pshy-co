import {
  login as apiLogin,
  signup as apiSignup,
  changePassword as apiChangePassword,
  createServer as apiCreateServer,
  serverJoin as apiServerJoin,
  deleteServer as apiDeleteServer,
  retrieveServer as apiRetrieveServer,
  deleteChatMessage as apiDeleteChatMessage,
  updateChatMessage as apiUpdateChatMessage,
  sendMessage as apiSendMessage,
  getChatMessages as apiGetChatMessages,
  getUser as apiReterieveUser
} from "../utils/fetchFromAPI";

import { ActionTypes } from '../utils/constants';

export const login = (email, password) =>{
  return async (dispatch) => {
    try {
      const { user, accessToken } = await apiLogin(email, password);
      dispatch(loginSuccess({ user, accessToken }));
    } catch (error) {
      dispatch(loginFailure({ error: error.message }));
    }
  }
};

export const signup = (email, user_alias, password, password_confirm) =>{
  return async (dispatch) => {
    try {
      await apiSignup(email, user_alias, password, password_confirm);
    } catch (error) {
      dispatch(signupFailure({ error: error.message }));
    }
  }
};

export const changePassword = (oldPassword, password, password_confirm) => {
  return async (dispatch) => {
    try {
      await apiChangePassword(oldPassword, password, password_confirm);
      dispatch(changePasswordSuccess());
    } catch (error) {
      dispatch(changePasswordFailure({ error: error.message }));
    }
  };
};

export const getUser = (user_id) => {
  return async (dispatch) => {
    try{
      const user = await apiReterieveUser(user_id);
      dispatch(retrieveUserSuccess(user));
    }catch(error){
      dispatch(retrieveUserFailure({error:error.message}))
    }
  }
}

export const createServer = (serverName, description) => {
  return async (dispatch) => {
    try {
      const serverData = await apiCreateServer(serverName, description);
      dispatch(createServerSuccess({ serverData }));
    } catch (error) {
      dispatch(createServerFailure({ error: error.message }));
    }
  };
};


export const joinServer = (serverId) => {
  return async (dispatch) => {
    try {
      await apiServerJoin(serverId);
      dispatch(joinServerSuccess({ serverId }));
    } catch (error) {
      dispatch(joinServerFailure({ error: error.message }));
    }
  };
};

export const deleteServer = (serverId) => {
  return async (dispatch) => {
    try {
      await apiDeleteServer(serverId);
      dispatch(deleteServerSuccess({ serverId }));
    } catch (error) {
      dispatch(deleteServerFailure({ error: error.message }));
    }
  };
};

export const retrieveServer = (serverId) => {
  return async (dispatch) => {
    try {
      const serverData = await apiRetrieveServer(serverId);
      dispatch(retrieveServerSuccess({ serverData }));
    } catch (error) {
      dispatch(retrieveServerFailure({ error: error.message }));
    }
  };
};

export const deleteChatMessage = (messageId) => {
  return async (dispatch) => {
    try {
      await apiDeleteChatMessage(messageId);
      dispatch(deleteChatMessageSuccess({ messageId }));
    } catch (error) {
      dispatch(deleteChatMessageFailure({ error: error.message }));
    }
  };
};

export const updateChatMessage = ({ messageId, newContent }) => {
  return async (dispatch) => {
    try {
      const message = await apiUpdateChatMessage(messageId, newContent);
      dispatch(updateChatMessageSuccess({ message }));
    } catch (error) {
      dispatch(updateChatMessageFailure({ error: error.message }));
    }
  };
};

export const sendMessage = ({ server, content, sender }) => {
  return async (dispatch) => {
    try {
      const messageData = await apiSendMessage(server, content, sender);
      dispatch(sendMessageSuccess({ messageData }));
    } catch (error) {
      dispatch(sendMessageFailure({ error: error.message }));
    }
  };
};

export const getChatMessages = (serverId) => {
  return async (dispatch) => {
    try {
      const chatMessages = await apiGetChatMessages(serverId);
      dispatch(getChatMessagesSuccess({ chatMessages }));
    } catch (error) {
      dispatch(getChatMessagesFailure({ error: error.message }));
    }
  };
};

export const receiveChatMessage = (event) => async (dispatch) => {
  try {
    const message = JSON.parse(event.data);
    dispatch(receiveChatSuccess(message));
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
};


const loginSuccess = (payload) => ({ type: ActionTypes.LOGIN_SUCCESS, payload });
const loginFailure = (payload) => ({ type: ActionTypes.LOGIN_FAILURE, payload });
const signupFailure = (payload) => ({ type: ActionTypes.SIGNUP_FAILURE, payload });
const changePasswordSuccess = (payload) => ({ type: ActionTypes.CHANGE_PASSWORD_SUCCESS, payload });
const changePasswordFailure = (payload) => ({ type: ActionTypes.CHANGE_PASSWORD_FAILURE, payload });
const retrieveUserSuccess = (payload) => ({ type: ActionTypes.USER_RETERIVEAL_SUCCESS, payload });
const retrieveUserFailure = (payload) => ({ type: ActionTypes.USER_RETERIVEAL_FAILURE, payload });
const createServerSuccess = (payload) => ({ type: ActionTypes.CREATE_SERVER_SUCCESS, payload });
const createServerFailure = (payload) => ({ type: ActionTypes.CREATE_SERVER_FAILURE, payload });
const joinServerSuccess = (payload) => ({ type: ActionTypes.JOIN_SERVER_SUCCESS, payload });
const joinServerFailure = (payload) => ({ type: ActionTypes.JOIN_SERVER_FAILURE, payload });
const deleteServerSuccess = (payload) => ({ type: ActionTypes.DELETE_SERVER_SUCCESS, payload });
const deleteServerFailure = (payload) => ({ type: ActionTypes.DELETE_SERVER_FAILURE, payload });
const retrieveServerSuccess = (payload) => ({ type: ActionTypes.RETRIEVE_SERVER_SUCCESS, payload });
const retrieveServerFailure = (payload) => ({ type: ActionTypes.RETRIEVE_SERVER_FAILURE, payload });
const deleteChatMessageSuccess = (payload) => ({ type: ActionTypes.DELETE_CHAT_MESSAGE_SUCCESS, payload });
const deleteChatMessageFailure = (payload) => ({ type: ActionTypes.DELETE_CHAT_MESSAGE_FAILURE, payload });
const updateChatMessageSuccess = (payload) => ({ type: ActionTypes.UPDATE_CHAT_MESSAGE_SUCCESS, payload });
const updateChatMessageFailure = (payload) => ({ type: ActionTypes.UPDATE_CHAT_MESSAGE_FAILURE, payload });
const sendMessageSuccess = (payload) => ({ type: ActionTypes.SEND_MESSAGE_SUCCESS, payload });
const sendMessageFailure = (payload) => ({ type: ActionTypes.SEND_MESSAGE_FAILURE, payload });
const getChatMessagesSuccess = (payload) => ({ type: ActionTypes.GET_CHAT_MESSAGES_SUCCESS, payload });
const getChatMessagesFailure = (payload) => ({ type: ActionTypes.GET_CHAT_MESSAGES_FAILURE, payload });
const receiveChatSuccess = (message) => ({type: ActionTypes.RECEIVE_CHAT_MESSAGE,payload: message});
