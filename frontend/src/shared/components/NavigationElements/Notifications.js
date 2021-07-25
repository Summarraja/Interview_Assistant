import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Typography,
    Menu,
    makeStyles,
    MenuItem,
    Divider,
    Grid,
    Button,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { AiFillCloseSquare } from "react-icons/ai";
import { AuthContext } from "../../context/auth-context";
import { SocketContext } from "../../context/socket-context";
import { useHttpClient } from "../../hooks/http-hook";
import { useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: "auto 8px",
    },

    NotiTitle: {
        [theme.breakpoints.up("xs")]: {
            flexGrow: 1,
        },
    },
    notification: {
        // color:'white',
        background: '#d3d3d3',
        margin: '0.1rem'
    },
    noNoti: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
        marginTop: '1rem',
        padding: 0,
    }
}));

const ITEM_HEIGHT = 130;

const Notifications = (props) => {
    const { isLoading, sendRequest } = useHttpClient();
    const notiRef = useRef();
    const auth = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (notiRef.current) {
                if (!event.target.contains(notiRef.current) && !notiRef.current.contains(event.target)) {
                    props.closeNotiMenu();
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notiRef,props]);

    const openNotifications = useCallback( async () => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_NODE_URL}/settings/openNotifications/${auth.userId}`,
                "PATCH",
                null,
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
        } catch (err) { }
    },[auth.token,auth.userId,sendRequest]);
    useEffect(() => {
        if (!socket) return;
        socket.on("notification", (data) => {
            setNotifications([data, ...notifications]);
            openNotifications();
        });

        return () => {
            socket.off("notification");
        };
    }, [socket, notifications,openNotifications]);

    const getNotifications = useCallback(async () => {
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_NODE_URL}/notifications/${auth.userId}`,
                "GET",
                null,
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );
            setNotifications(responseData.notifications);
        } catch (err) { }
    },[auth.token,auth.userId,sendRequest]) ;
    useEffect(() => {
        if (!auth.userId) return;
        getNotifications();
    }, [auth.userId,getNotifications]);
    const clearNotifications = async () => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_NODE_URL}/notifications/clear/${auth.userId}`,
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
            ref={notiRef}
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
                        <Typography variant="h5" style={{ paddingLeft: "10px" }}>Notifications</Typography>
                    </Grid>
                    <Grid item sm={5} align="center"  >
                        <Button onClick={clearNotifications} style={{ visibility: (notifications && notifications.length === 0) ? 'hidden' : 'visible' }} color="primary">Clear All</Button>
                        <IconButton color="primary" float="left" onClick={props.closeNotiMenu}>
                            <AiFillCloseSquare />
                        </IconButton>
                    </Grid>
                </Grid>

                <Divider variant="middle" />
                {(notifications && notifications.length === 0) && (
                    <MenuItem className={classes.noNoti}>
                        <Grid item sm={9} className={classes.NotiTitle}>
                            <Typography variant="h5" >{isLoading ? "Loading..." : "You have no new Notification.."}</Typography>
                        </Grid>
                    </MenuItem>
                )}
                {notifications && notifications.map((noti, k) => (
                    <>
                        <MenuItem key={k} className={classes.notification}>
                            <Grid item sm={11} className={classes.NotiTitle}>
                                <Typography variant="subtitle1" >{noti.message}</Typography>
                            </Grid>
                            <Grid item sm={1} align="top" style={{ alignItems: 'top', marginRight: "15px" }}>
                                <Typography variant="subtitle2">{getDate(noti.time)}</Typography>
                                <Typography variant="subtitle2">{getTime(noti.time)}</Typography>
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