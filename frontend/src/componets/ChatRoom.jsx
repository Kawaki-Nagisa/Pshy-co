import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Stack } from "@mui/material";
import ServerCard from "./ServerCard";
import { MemberCard } from ".";
import ChatBox from "./ChatBox";
import { getUser } from "../actions";
import { useLocation } from "react-router-dom";

const ChatRoom = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const index = location.state?.index;
  const serverData = useSelector((state) => state.Servers[index].serverData);
  const [allUserDataRetrieved, setAllUserDataRetrieved] = useState(false);

  useEffect(() => {
    if (serverData) {
      Promise.all(
        serverData.members.map((memberId) => dispatch(getUser(memberId)))
      ).then(() => {
        setAllUserDataRetrieved(true);
      });
    }
  }, [dispatch, serverData]);

  if (!allUserDataRetrieved) {
    return null;
  }

  return (
    <Stack className="min-h-screen flex justify-between">
      <Box>
        <Box className="flex flex-col justify-items-center items-center py-12">
          <ServerCard index={index} rectangular={false}></ServerCard>
        </Box>
        <Box className="flex flex-row space-x-5 justify-center pb-12">
          {serverData.members.map((memberId) => (
            <MemberCard key={memberId} id={memberId}/>
          ))}
        </Box>
      </Box>
      <ChatBox index={index} className="flex-auto"></ChatBox>
    </Stack>
  );
};

export default ChatRoom;
