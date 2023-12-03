import axios from "axios";
import Cookies from 'js-cookie';
import { BASE_URL } from "./constants";

const instance = axios.create({
  baseURL: BASE_URL,
});

export const setToken = async (accessToken) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export const clearToken = () => {
  delete instance.defaults.headers.common["Authorization"];
}

export const login = async (email, password) => {
  try {
    clearToken()
    Cookies.set('reduxState', {});
    const response = await instance.post("/login/", {
      email,
      password,
    });

    const userData = response.data.user;
    const accessToken = response.data.access_token;
    setToken(accessToken);
    return {
      user: userData,
      accessToken,
    };
  } catch (error) {
    throw error;
  }
};

export const signup = async (email, user_alias, password, password_confirm) => {
  try {
    const response = await instance.post("/signup/", {email, user_alias, password, password_confirm,});
    return response.data
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword, password_confirm) => {
  try {
    const response = await instance.post("/change_password/", {
      current_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: password_confirm
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (user_id) => {
  try{
    const response = await instance.post("/user/reterieve/", {
    "user_id": user_id
  });
  return response.data;}
  catch(error)
  {
    throw error;
  }
}

export const createServer = async (name, description) => {
  try {
    console.log(name, description)
    const response = await instance.post("/server/create_server/", {
      name,
      description,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const serverJoin = async (server_id) => {
  try {
    const response = await instance.post('/server/join_server/', { server_id });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteServer = async (server_id) => {
  try {
    const response = await instance.delete(`/server/delete_server/`, {
      params: {
        server_id: server_id
      }
    });

    if (response.status === 204) {
      return "Server deleted successfully.";
    }
  } catch (error) {
    throw error;
  }
};

export const retrieveServer = async (server_id) => {
  try {
    const response = await instance.get(`/server/retrieve_data/`, {
      params: {
        server_id: server_id
      }
      });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteChatMessage = async (messageId) => {
  try {
    const response = await instance.delete(`/chat/delete_message/`, {
      data: { messageId },
    });

    if (response.status === 204) {
      return "Chat message deleted successfully.";
    }
  } catch (error) {
    throw error;
  }
};

export const updateChatMessage = async (message_Id, newContent) => {
  try {
    const response = await instance.patch(`/chat/update_message/`, {
      message_Id,
      content: newContent,
    });
    if (response.status=== 200){
      return "Chat message updated successfully.";
    }
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (server, content, sender) => {
  try {
    const response = await instance.post(`/chat/add_message/`, {
      server,
      content,
      sender,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatMessages = async (server_id) => {
  try {
    const response = await instance.post(`/chat/get_messages_for_server/`, {
      server_id
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
