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

export default function RegisterPage() {
    const [username, setUserName] = React.useState("");
    const [emailid, setEmailId] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [authErr, setAuthErr] = React.useState("");
    const [loader, setLoader] = React.useState(false);

    //validator
    const [init, setInit] = React.useState(false);
    const [isValidUserName, setIsValidUserName] = React.useState(false);
    const [isValidEmail, setIsValidEmail] = React.useState(false);
    const [isValidPassword, setIsValidPassword] = React.useState(false);

    const navigate = useNavigate();

    function checkValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleSubmit = async (event) => {

        event.preventDefault();
        setInit(true);
        if (!(isValidUserName && isValidEmail && isValidPassword)) { return; }

        setLoader(true);
        try {
            const data = await axios.post("http://localhost:8000/api/v1/register", {
                username,
                emailid,
                password,
            });
            if (data.data === "UserName Already Exist" || data.data === "Email-id is Already Registered") {
                setAuthErr(data.data);
            } else {
                setAuthErr("");
                navigate("/login");
            }
        } catch (err) {
            setAuthErr(err.message.toUpperCase());
        }
        setLoader(false);
    };

    const handleUserName = (e) => { setUserName(e.target.value); setIsValidUserName(e.target.value !== '' && e.target.value.length < 255); }
    const handleEmailId = (e) => { setEmailId(e.target.value); setIsValidEmail(e.target.value.length < 255 && checkValidEmail(e.target.value)); }
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
                            Create An Account
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
                                autoFocus
                                variant="standard"
                                error={init && !isValidUserName}
                                helperText={init && !isValidUserName && "Please enter a valid username"}
                            />
                            <TextField
                                value={emailid}
                                onChange={handleEmailId}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="off"
                                variant="standard"
                                error={init && !isValidEmail}
                                helperText={init && !isValidEmail && "Please enter a valid email address"}
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
                                Sign Up{loader && '...'}
                            </Button>
                            {authErr && <Alert severity="error">{authErr}</Alert>}
                            <Grid container>
                                <Grid item>
                                    <Link to="/login" variant="body2">
                                        {"Already have an account? LogIn"}
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