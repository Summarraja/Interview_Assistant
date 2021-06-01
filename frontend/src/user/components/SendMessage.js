import React, { Fragment, useState, useContext } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Fab } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { AuthContext } from '../../shared/context/auth-context';
import { SocketContext } from "../../shared/context/socket-context";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    Typography: {
        fontFamily: theme.typography.fontFamily,
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
    },
    content: {
        textAlign: "center"
    },
    preview: {
        margin: "auto",
        display: "block",
        maxWidth: '60%',
        maxHeight: '60%'
    }
}));

const SendMessage = (props) => {
    const auth = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const classes = useStyles();
    const history = useHistory();

    function pushMessage() {
        if (!(/^ *$/.test(newMessage))) {
            let message = {
                sender: auth.userId,
                receiver: props.receiver,
                content: newMessage,
                time: (new Date()).toISOString(),
                chat: ''
            }
            let data = {
                message,
                file: '',
                fileName: '',
                previewUrl: '',
                token: "Bearer " + auth.token
            }
            socket.emit("message", data, function (error, success) {
                if (error) {
                    console.log(error);
                }
                if (success) {
                    setSending(false);
                    props.handleCloseDialog();
                    history.push({
                        pathname: '/chat',
                      });
                }
            });
            setSending(true);
        }
    }

    return (
        <Fragment>
            <Dialog open={props.open} fullWidth maxWidth="sm">
                <DialogTitle disableTypography>
                    <Typography variant="h4" align="center">
                        Send Text Message
          </Typography>

                    <CssBaseline />

                </DialogTitle>
                <DialogContent dividers>
                    <div className={classes.content}>
                        <br />
                        <>
                            <input type="text" placeholder="Type a message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                            <Fab color="secondary" size="small" component="span" aria-label="add" variant="extended" onClick={pushMessage}>Send</Fab>
                            {sending&&(<><br/><br/><CircularProgress /></>)}

                        </>
                    </div>

                </DialogContent>
                <DialogActions >
                    <Button autoFocus onClick={props.handleCloseDialog} color="primary">
                        CANCEL
          </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default SendMessage;
