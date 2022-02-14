import {useState, useRef, useContext} from "react";
import {useHistory} from 'react-router-dom';

import AuthContext from "../../store/auth-context";
import Errors from "../Errors/Errors";
import {Box, Button, Container, CssBaseline, Grid, TextField, Typography, Avatar} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AuthForm = () => {
    const history = useHistory();
    const usernameRef = useRef()
    const passwordRef = useRef();

    const authContext = useContext(AuthContext);

    const [loggingIn, setLoggingIn] = useState(true);
    const [errors, setErrors] = useState({});

    const switchModeHandler = () => {
        setLoggingIn((prevState) => !prevState);
        setErrors({});
    };

    const endpoint = loggingIn ? '/api/signin' : '/api/signup';

    async function submitHandler(event) {
        event.preventDefault();
        setErrors({});

        const form = new FormData(event.currentTarget);

        try {
            const response = await fetch(endpoint,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        Username: form.get('username'),
                        Password: form.get('password'),
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            const data = await response.json();
            if (!response.ok) {
                let errorText = loggingIn ? 'Login failed' : 'Sign up failed';
                if (!data.hasOwnProperty('error')) {
                    throw new Error(errorText);
                }
                if ((typeof data['error'] === 'string')) {
                    setErrors({'unknown': data['error']});
                } else {
                    setErrors(data['error']);
                }
            } else {
                authContext.login(data.jwt);
                history.replace('/');
            }
        } catch (error) {
            setErrors({"error": error.message});
        }
    };

    const header = loggingIn ? 'Login' : 'Sign up';
    const mainButtonText = loggingIn ? 'Login' : 'Create account';
    const switchModeButtonText = loggingIn ? 'Create new account' : 'Login with existing account';
    const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors);

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {header}
                </Typography>
                <Box component="form" onSubmit={submitHandler} novalidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Email Address"
                        name="username"
                        autoComplete="email"
                        autoFocus
                        ref={usernameRef}
                        />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        ref={passwordRef}
                        />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}>
                        {mainButtonText}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={switchModeHandler}
                                sx={{mt: 3, mb: 2}}>
                                {switchModeButtonText}
                            </Button>
                        </Grid>
                    </Grid>
                    {errorContent}
                </Box>
            </Box>
        </Container>
        // {/*</Container>*/}
        // {/*<section>*/}
        // {/*    <h1 className="text-center">{header}</h1>*/}
        // {/*    <div className="container w-50">*/}
        // {/*        <form onSubmit={submitHandler}>*/}
        // {/*            <div className="form-group pb-3">*/}
        // {/*                <label htmlFor="username">Username</label>*/}
        // {/*                <input id="username" type="text" className="form-control" required ref={usernameRef} ></input>*/}
        // {/*            </div>*/}
        // {/*            <div className="form-group pb-3">*/}
        // {/*                <label htmlFor="password">Password</label>*/}
        // {/*                <input id="password" type="password" className="form-control" required ref={passwordRef} ></input>*/}
        // {/*            </div>*/}
        // {/*            <div className="pt-3 d-flex justify-content-between">*/}
        // {/*                <button type="submit" className="btn btn-success">{mainButtonText}</button>*/}
        // {/*                <button type="button" className="btn btn-link" onClick={switchModeHandler}>{switchModeButtonText}</button>*/}
        // {/*            </div>*/}
        // {/*        </form>*/}
        // {/*        {errorContent}*/}
        // {/*    </div>*/}
        // {/*</section>*/}
    );
}

export default AuthForm;