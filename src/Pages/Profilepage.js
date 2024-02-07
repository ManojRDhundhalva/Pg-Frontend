import * as React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {

    // const [username, setUserName] = React.useState('');
    // const [emailid, setEmailId] = React.useState('');

    const navigate = useNavigate();
    const handlelogout = () => {
        window.localStorage.removeItem("token");
        navigate("/login");
    }
    return (
        <>
            <h1>Profile</h1>
            <Button variant="contained" onClick={handlelogout}>LogOut</Button>
        </>
    );
};

export default ProfilePage;