import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Portal from "./Portal.jsx";
import { useSelector, useDispatch } from "react-redux";
import { authActions, portalActions } from "../store/index.js";
import axios from "axios";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WhatshotIcon from "@mui/icons-material/Whatshot";

axios.defaults.withCredentials = true;
const Navbar = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountMenuClicked, setAccountMenuClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const portalStates = useSelector((state) => state.portal);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setAccountMenuClicked(true);
    // console.log("onClick", accountMenuClicked);
    document.body.classList.add("account-menu-custom-style");
  };
  const handleDropDownClose = () => {
    setAnchorEl(null);
    setAccountMenuClicked(false);
    // console.log("onClose", accountMenuClicked);
    document.body.classList.remove("account-menu-custom-style");
  };
  const takeToHomePage = () => {
    navigate(`/`);
  };

  const takeToExercisesPage = () => {
    navigate(`/exercises/all`);
  };

  const sendLogoutReq = async () => {
    // console.log("logout");
    await axios
      .post(`${REACT_APP_BASE_URL}/auth/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          dispatch(authActions.logout());
          dispatch(authActions.setUser({}));
          navigate(`/`);
          // console.log(isLoggedIn);
          handleDropDownClose();
          return;
        }
        return new Error("Unable to log out. Please try again");
      })
      .catch((err) => {
        return new Error("Unable to log out. Please try again");
      });
  };

  function handleLogout() {
    sendLogoutReq();
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <nav id="nav">
        <h2 onClick={takeToHomePage} id="heading">
          FitHub
        </h2>

        <div className="links">
          {!isMobile && (
            <>
              <h3 onClick={takeToExercisesPage} className="link">
                Exercises
              </h3>
              <h3 onClick={() => navigate(`/recipes`)} className="link">
                Recipes
              </h3>
              {isLoggedIn && (
                <h3
                  onClick={() => navigate(`/${user?.username}/myworkouts`)}
                  className="link"
                >
                  My Workouts
                </h3>
              )}
            </>
          )}

          {!isLoggedIn ? (
            <button
              onClick={() => dispatch(portalActions.setPortalOpen())}
              className="login-btn"
            >
              Login
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {user?.streak > 0 && (
                <div
                  className="navbar-streak-badge"
                  onClick={() => navigate(`/${user?.username}/dashboard`)}
                  title={`${user.streak} Day Workout Streak!`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(255, 94, 98, 0.12)",
                    border: "1px solid rgba(255, 94, 98, 0.3)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <WhatshotIcon style={{ color: "#ff5e62", fontSize: "1.1rem" }} />
                  <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "0.85rem" }}>
                    {user.streak}
                  </span>
                </div>
              )}
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
                    {user?.username[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                className="account-menu"
                open={open}
                onClick={handleDropDownClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {isMobile && (
                  <div>
                    <MenuItem onClick={takeToExercisesPage}>Exercises</MenuItem>
                    <MenuItem onClick={() => navigate(`/recipes`)}>
                      Recipes
                    </MenuItem>
                    <Divider className="line" />
                  </div>
                )}
                <MenuItem
                  onClick={() => {
                    handleDropDownClose();
                    navigate(`/${user?.username}/myprofile`);
                  }}
                >
                  <Avatar className="account-menu-dropdown-icon" /> Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDropDownClose();
                    navigate(`/${user?.username}/myfavorite`);
                  }}
                >
                  <FavoriteIcon className="account-menu-dropdown-icon" />{" "}
                  Favorites
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDropDownClose();
                    navigate(`/${user?.username}/myworkouts`);
                  }}
                >
                  <ListAltIcon className="account-menu-dropdown-icon" /> My
                  workouts
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDropDownClose();
                    navigate(`/${user?.username}/settings`);
                  }}
                >
                  <Settings className="account-menu-dropdown-icon" /> Settings
                </MenuItem>
                <Divider className="line" />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout
                      className="account-menu-dropdown-icon"
                      fontSize="small"
                    />
                  </ListItemIcon>
                  <span>Logout</span>
                </MenuItem>
              </Menu>
            </div>
          )}
          {portalStates.isPortalOpen && <Portal />}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
