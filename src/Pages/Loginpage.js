import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import LinearProgress from '@mui/material/LinearProgress';

import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function LoginPage() {
    const [username, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [authErr, setAuthErr] = React.useState("");
    const [loader, setLoader] = React.useState(false);

    //validator
    const [init, setInit] = React.useState(false);
    const [isValidUserName, setIsValidUserName] = React.useState(false);
    const [isValidPassword, setIsValidPassword] = React.useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setInit(true);
        if (!(isValidUserName && isValidPassword)) { return; }

        setLoader(true);
        try {

            const data = await axios.post("http://localhost:8000/api/v1/login", {
                username,
                password,
            });

            if (data.data === "User not found" || data.data === "Incorrect Password") {
                setAuthErr(data.data);
            } else {
                setAuthErr("");
                window.localStorage.setItem("token", data.data);
                navigate("/");
            }
        }
        catch (err) {
            setAuthErr(err.message.toUpperCase());
        }
        setLoader(false);
    };

    const handleUserName = (e) => { setUserName(e.target.value); setIsValidUserName(e.target.value !== '' && e.target.value.length < 255); }
    const handlePassword = (e) => { setPassword(e.target.value); setIsValidPassword(e.target.value.length >= 8 && e.target.value.length < 10485750); }


    React.useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token !== null) { navigate("/"); }
    }, [navigate]);

    return (
        <>
            <LinearProgress style={{ visibility: loader ? 'visible' : 'hidden' }} />
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                value={username}
                                onChange={handleUserName}
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="off"
                                variant="standard"
                                autoFocus
                                error={init && !isValidUserName}
                                helperText={init && !isValidUserName && "Please enter a valid username"}
                            />
                            <TextField
                                value={password}
                                onChange={handlePassword}
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="off"
                                variant="standard"
                                error={init && !isValidPassword}
                                helperText={init && !isValidPassword && "Password should be at least 8 characters long"}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Login{loader && '...'}
                            </Button>
                            {authErr && <Alert severity="error">{authErr}</Alert>}
                            <Grid container>
                                <Grid item>
                                    <Link to="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}