import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCard } from ".";
import SettingsIcon from "@mui/icons-material/Settings";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/change-password");
  };

  return (
    <nav className="bg-gradient-to-t from-neutral-900 to-neutral-800 flex flex-row justify-between px-8 py-4">
      <div>
        <UserCard size="large"></UserCard>
      </div>
      <div className="">
        <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-slate-950 relative inline-block bg-transparent">
          <span className="relative text-rose-800">
            <h2 className="text-5xl font-bold">Pshy co</h2>
          </span>
        </span>
      </div>
      <div>
        <button
          onClick={handleSettingsClick} // Call the handleSettingsClick function on button click
          className="flex items-center justify-center w-14 h-14 bg-rose-800 rounded-full hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-800 hover:text-rose-800"
        >
          <SettingsIcon></SettingsIcon>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
