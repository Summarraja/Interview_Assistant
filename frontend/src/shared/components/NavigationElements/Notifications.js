import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Typography,
    Menu,
    makeStyles,
    MenuItem,
    Divider,
    Grid,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { VscClearAll } from "react-icons/vsc";
import { AiFillCloseSquare } from "react-icons/ai";
import { AuthContext } from "../../context/auth-context";
import { SocketContext } from "../../context/socket-context";
import { useHttpClient } from "../../hooks/http-hook";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: "auto 8px",
    },

    NotiTitle: {
        [theme.breakpoints.up("xs")]: {
            flexGrow: 1,
        },
    }
}));
const notification = [
    // {

    //     id: 1,
    //     message: "Your request for an interview has been accepted by the Intervier",
    //     time: "12:22",
    //     isRead: true,
    //     uid: 1
    // },
    // {
    //     id: 1,
    //     message: "Your request for an interview has been accepted by the Intervier",
    //     time: "12:22",
    //     isRead: false,
    //     uid: 1
    // },
    // {
    //     id: 1,
    //     message: "Your request for an interview has been accepted by the Intervier",
    //     time: "12:22",
    //     isRead: true,
    //     uid: 2
    // },

    {
        id: 1,
        message: "Your request for an interview has been accepted by the Intervier",
        time: "12:22",
        isRead: false,
        uid: 5
    },
    {
        id: 1,
        message: "Your request for an interview has been accepted by the Intervier",
        time: "12:22",
        isRead: true,
        uid: 5
    },

    {
        id: 1,
        message: "Your request for an interview has been accepted by the Intervier",
        time: "12:22",
        isRead: true,
        uid: 5
    },

    {
        id: 1,
        message: "Your request for an interview has been accepted by the Intervier",
        time: "12:22",
        isRead: true,
        uid: 5
    },

    {
        id: 1,
        message: "Your certificate has been approved by Admin",
        time: "12:22",
        isRead: true,
        uid: 5
    },
    {
        id: 1,
        message: "Your request for an interview has been accepted by the Intervier",
        time: "12:22",
        isRead: true,
        uid: 5
    },

    {
        id: 1,
        message: "Your request for an interview has been accepted by the Intervier",
        time: "12:22",
        isRead: true,
        uid: 5
    },

    {
        id: 1,
        message: "Your certificate has been approved by Admin",
        time: "12:22",
        isRead: true,
        uid: 5
    },

]
const ITEM_HEIGHT = 130;

const Notifications = (props) => {
    const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
    const notiRef = useRef();
    const auth = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (notiRef.current) {
                if (!notiRef.current.contains(event.target)) {
                    props.closeNotiMenu();
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notiRef]);

    useEffect(() => {
        if (!socket) return;
        socket.on("notification", (data) => {
            setNotifications([data, ...notifications]);
        });

        return () => {
            socket.off("notification");
        };
    }, [socket, notifications]);

    useEffect(() => {
        if (!auth.userId) return;
        getNotifications();
    }, [auth.userId]);
    const getNotifications = async () => {
        try {
            const responseData = await sendRequest(
                `http://localhost:5000/api/notifications/${auth.userId}`,
                "GET",
                null,
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            setNotifications(responseData.notifications);
        } catch (err) { }
    };
    const clearNotifications = async () => {
        try {
            const responseData = await sendRequest(
                `http://localhost:5000/api/notifications/clear/${auth.userId}`,
                "GET",
                null,
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            setNotifications([]);
        } catch (err) { }
    };
    const getDate = (datetime) => {
        let d = new Date(datetime);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
    }
    const getTime = (datetime) => {
        let d = new Date(datetime);
        return d.getHours() + ":" + d.getMinutes();
    }

    const classes = useStyles();

    return (
        <Menu
            anchorEl={props.notiMenuAnchorEl}
            id="notification-menu"
            keepMounted
            open={props.isNotiMenuOpen}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            PaperProps={{
                style: {
                    height: ITEM_HEIGHT * 3,
                    width: '50ch',
                },
            }}

            transformOrigin={{
                vertical: -10,
                horizontal: 180,
            }}
            getContentAnchorEl={null}
        >
            <div ref={notiRef}>
                    <Grid container >
                        <Grid item sm={7} className={classes.NotiTitle}
                        >
                            <Typography variant="h5" style={{ padding: "10px" }}>Notifications</Typography>
                        </Grid>
                        <Grid item sm={4} align="right" onClick={clearNotifications} >
                            <IconButton color="primary">
                                <VscClearAll />
                            </IconButton>
                            <IconButton color="primary" float="left" onClick={props.closeNotiMenu}>
                                <AiFillCloseSquare />
                            </IconButton>
                        </Grid>
                    </Grid>

                <Divider variant="middle" />
                {(notifications && notifications.length == 0) && (
                    <Grid item sm={9} className={classes.NotiTitle}>
                        <Typography variant="subtitle1" >You have no new Notification..</Typography>
                    </Grid>
                )}
                    {notifications && notifications.map((noti, k) => (
                        <>
                        <MenuItem key={k} >
                            <Grid item sm={9} className={classes.NotiTitle}>
                                <Typography variant="subtitle1" >{noti.message}</Typography>
                            </Grid>
                            <Grid item sm={3} align="center" style={{ marginBottom: "10px" }}>
                                <Typography variant="subtitle1">{getDate(noti.time)}</Typography>
                                <Typography variant="subtitle1">{getTime(noti.time)}</Typography>
                            </Grid>
                        </MenuItem>
                        <Divider variant="middle" />
                        </>
                    ))}

            </div>
        </Menu>
    );
};

export default Notifications;