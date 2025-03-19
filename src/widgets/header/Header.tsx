import React, { useState } from "react";
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Path } from "../../shared/constants/routes";
import Logo from "../../shared/platform/logo/Logo";
import PersonIcon from "@mui/icons-material/Person";
import s from "./Header.module.scss";
import { useLogoutMutation } from "../../store/api/authApi";
import { useDispatch } from "../../store/assets/hooks";
import { logout } from "../../store/slices/authSlice";
import { useMediaQuery } from "react-responsive";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: "760px" });

  const [value, setValue] = React.useState("recents");

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!anchorEl) {
      setAnchorEl(event.currentTarget);
    } else {
      handleClose();
    }
  };

  const [logOut] = useLogoutMutation();

  const handleLogOut = () => {
    logOut();
    dispatch(logout());
  };

  if (isMobile) {
    return (
      <BottomNavigation
        value={value}
        onChange={handleChange}
        className={s.mobile_nav}
      >
        <BottomNavigationAction
          label="Browse"
          value="browse"
          icon={<SearchIcon />}
          onClick={() => navigate(Path.LIST)}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteBorderIcon />}
          onClick={() => navigate(Path.FAVOURITES)}
        />
        <BottomNavigationAction
          label="Log Out"
          value="logout"
          icon={<LogoutIcon />}
          onClick={handleLogOut}
        />
      </BottomNavigation>
    );
  }

  return (
    <div className={s.container}>
      <Logo />

      <div className={s.content}>
        <div className={s.nav}>
          <Button onClick={() => navigate(Path.LIST)} href="#text-buttons">
            Browse
          </Button>
          <Button
            onClick={() => navigate(Path.FAVOURITES)}
            href="#text-buttons"
          >
            Favourites
          </Button>
        </div>
        <div className={s.profile} onClick={handleClick}>
          <Avatar className={s.avatar}>
            <PersonIcon />
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            className={s.menu}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
