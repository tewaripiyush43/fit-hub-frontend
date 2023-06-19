import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Portal from "./Portal.jsx";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/index.js";
import axios from "axios";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListAltIcon from "@mui/icons-material/ListAlt";

axios.defaults.withCredentials = true;
const Navbar = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountMenuClicked, setAccountMenuClicked] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const user = useSelector((state) => state.user);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setAccountMenuClicked(true);
    console.log(accountMenuClicked);
    document.body.classList.add("account-menu-custom-style");
  };
  const handleDropDownClose = () => {
    setAnchorEl(null);
    setAccountMenuClicked(false);
    console.log(accountMenuClicked);
    document.body.classList.remove("account-menu-custom-style");
  };
  const takeToHomePage = () => {
    navigate(`/`);
  };

  const takeToExercisesPage = () => {
    navigate(`/exercises/all`);
  };

  const takeToRecipesPage = () => {
    navigate(`/recipes`);
  };

  function handleOpen() {
    setIsOpen(true);
    document.documentElement.classList.add("modal-open");
  }

  function handleClose() {
    // console.log("yo");
    setIsOpen(false);
    document.documentElement.classList.remove("modal-open");
  }

  const sendLogoutReq = async () => {
    await axios
      .post(`${REACT_APP_BASE_URL}/auth/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          dispatch(authActions.logout());
          dispatch(authActions.setUser({}));
          // localStorage.removeItem("accessToken");
          navigate(`/`);
          console.log(isLoggedIn);
          return;
        }
        return new Error("Unable to log out. Please try again");
      })
      .catch((err) => {
        return new Error("Unable to log out. Please try again");
      });
  };
  const sendDeleteReq = async () => {
    await axios
      .delete(`${REACT_APP_BASE_URL}/auth/delete`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          dispatch(authActions.logout());
          dispatch(authActions.setUser({}));
          // localStorage.removeItem("accessToken");
          navigate(`/`);
          console.log(isLoggedIn);
          return;
        }
        return new Error("Unable to delete account. Please try again");
      })

      .catch((err) => {
        return new Error("Unable to delete account. Please try again");
      });
  };

  function handleLogout() {
    sendLogoutReq();
  }

  function handleAccountDelete() {
    sendDeleteReq();
  }

  return (
    <div>
      <nav id="nav">
        <h2 onClick={takeToHomePage} id="heading">
          FitHub
        </h2>

        <div className="links">
          <h3 onClick={takeToExercisesPage} className="link">
            Exercises
          </h3>
          <h3 onClick={takeToRecipesPage} className="link">
            Recipes
          </h3>

          {!isLoggedIn ? (
            <button
              onClick={() => {
                setIsOpen(true);
                handleOpen();
              }}
              className="login-btn"
            >
              Login
            </button>
          ) : (
            <div>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    className="profile-avatar"
                    sx={{ width: 32, height: 32 }}
                  >
                    {user?.name ? user?.name[0].toUpperCase() : <span>FH</span>}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleDropDownClose}
                onClick={handleDropDownClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleDropDownClose}>
                  <Avatar className="account-menu-dropdown-icon" /> Profile
                </MenuItem>
                <MenuItem onClick={handleDropDownClose}>
                  <Avatar className="account-menu-dropdown-icon" /> My account
                </MenuItem>
                <MenuItem onClick={handleDropDownClose}>
                  <FavoriteIcon className="account-menu-dropdown-icon" />{" "}
                  Favourites
                </MenuItem>
                <MenuItem onClick={handleDropDownClose}>
                  <ListAltIcon className="account-menu-dropdown-icon" /> My
                  workouts
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDropDownClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleDropDownClose}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <span onClick={handleLogout}>Logout</span>
                </MenuItem>
                <MenuItem onClick={handleAccountDelete}>
                  <span className="delete-account-text">DELETE ACCOUNT</span>
                </MenuItem>
              </Menu>
            </div>
          )}

          <Portal
            open={isOpen}
            onClose={() => {
              setIsOpen(false);
              handleClose();
            }}
          />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
