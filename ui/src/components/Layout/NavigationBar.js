import {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import AuthContext from "../../store/auth-context";
import {
    AppBar,
    Box,
    FormControlLabel,
    FormGroup,
    IconButton,
    Menu,
    MenuItem,
    Switch,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {AccountCircle} from "@mui/icons-material";

const NavigationBar = () => {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const authContext = useContext(AuthContext);

    const loggedIn = authContext.loggedIn;

    const logoutHandler = () => {
        if (!loggedIn) {
            history.replace("/auth");
        } else {
            authContext.logout();
            history.replace('/');
        }
    };

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
      setAnchorEl(null);
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <FormGroup>
                <FormControlLabel control={
                        <Switch
                            checked={loggedIn}
                            onChange={logoutHandler}
                            aria-label="login switch"
                        />
                    } label={loggedIn ? 'Logout' : 'Login'}
                />
            </FormGroup>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Maaad
                    </Typography>
                        {loggedIn && (
                            <div>
                                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit" >
                                    <AccountCircle/>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    >
                                    <MenuItem><Link underline="none" to="/my-recipes" onClick={handleClose}> My Recipes</Link></MenuItem>
                                    {/*<MenuItem href="/my-recipes" to="/my-recipes" onClick={handleClose}>My Recipes</MenuItem>*/}
                                </Menu>
                            </div>
                        )}
                </Toolbar>
            </AppBar>
        </Box>

    );
}

export default NavigationBar;