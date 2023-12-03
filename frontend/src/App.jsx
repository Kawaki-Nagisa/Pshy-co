import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import {
  NavBar,
  Dashboard,
  GenericForm,
  ChatRoom,
} from "./componets";

const App = () => {
  return (
    <BrowserRouter>
      <Box className="bg-neutral-800">
        <Routes>
          <Route
            path="/login"
            exact
            element={<GenericForm formType="login" />}
          />
          <Route
            path="/signup"
            exact
            element={<GenericForm formType="signup" />}
          />
          <Route path="/change-password" exact element={<><NavBar /><GenericForm /></>} />
          <Route path="/chat" exact element={<><NavBar /><ChatRoom /></>} />
          <Route path="/dashboard" exact element={<><NavBar /><Dashboard /></>} />
          {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;
