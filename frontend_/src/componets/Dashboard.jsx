import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from 'react-redux';
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import ServerCard from "./ServerCard";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  retrieveServer,
  joinServer,
  createServer,
  deleteServer,
} from "../actions";

const Dashboard = ({userServers}) => {
  const dispatch = useDispatch();
  // const userServers = useSelector((state) => state.UserData.user.servers || []);
  const [serversRetrieved, setServersRetrieved] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleCreateServer = (formData) => {
    dispatch(createServer(formData.serverName, formData.serverDescription))
      .then(() => {
        handleAddDialogClose();
      })
      .catch((error) => {
        console.error("Error creating server:", error);
      });
  };

  const handleJoinServer = (formData) => {
    dispatch(joinServer(formData.serverId))
      .then(() => {
        handleAddDialogClose();
      })
      .catch((error) => {
        console.error("Error joining server:", error);
      });
  };

  const handleDeleteServer = (formData) => {
    dispatch(deleteServer(formData.serverId))
      .then(() => {
        handleDeleteDialogClose();
      })
      .catch((error) => {
        console.error("Error deleting server:", error);
      });
  };

  useEffect(() => {
    const retrieveServers = async () => {
      Promise.all(
        userServers.map((serverId) => dispatch(retrieveServer(serverId)))
      ).then(() => {
        setServersRetrieved(true);
      });
    };

    retrieveServers();
  }, [dispatch, userServers]);
  const [joinServerId, setJoinServerId] = useState("");
  const [createServerName, setCreateServerName] = useState("");
  const [createServerDescription, setCreateServerDescription] = useState("");
  if (!serversRetrieved) {
    return null;
  }
  return (
    <Stack className="min-h-screen space-y-20">
      <Box className="flex flex-row justify-center py-40">
        <AddIcon
          className="text-rose-800 self-center cursor-pointer"
          style={{ fontSize: "18rem" }}
          onClick={handleAddDialogOpen}
        />
        <Box className="flex flex-col w-2/6 justify-items-center items-center space-y-4">
          {userServers.map((server_id) => (
            <ServerCard key={server_id} id={server_id} />
          ))}
        </Box>
        <DeleteForeverIcon
          className="text-rose-800 self-center cursor-pointer"
          style={{ fontSize: "18rem" }}
          onClick={handleDeleteDialogOpen}
        />
      </Box>

      {/* Add Server Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle>Add Server</DialogTitle>
        <DialogContent>
          <TextField
            label="Server ID"
            fullWidth
            value={joinServerId}
            onChange={(e) => setJoinServerId(e.target.value)}
          />
          <TextField
            label="Server Name"
            fullWidth
            value={createServerName}
            onChange={(e) => setCreateServerName(e.target.value)}
          />
          <TextField
            label="Server Description"
            fullWidth
            value={createServerDescription}
            onChange={(e) => setCreateServerDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button
            onClick={() =>
              handleJoinServer({ action: "join", serverId: joinServerId })
            }
          >
            Join
          </Button>
          <Button
            onClick={() =>
              handleCreateServer({
                action: "create",
                serverName: createServerName,
                serverDescription: createServerDescription,
              })
            }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Server Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Server</DialogTitle>
        <DialogContent>
          <TextField
            label="Server ID"
            fullWidth
            value={joinServerId}
            onChange={(e) => setJoinServerId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteDialogClose}>Cancel</Button>
          <Button
            onClick={() =>
              handleDeleteServer({
                action: "delete",
                serverId: joinServerId,
              })
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

const mapStateToProps = (state) => {
  console.log(state.UserData.user.servers)
  return {
    userServers: state.UserData.user.servers
  };
};

export default connect(mapStateToProps)(Dashboard);
