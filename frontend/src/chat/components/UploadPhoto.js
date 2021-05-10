import React, { Fragment, useState, useContext, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AddIcon from "@material-ui/icons/Add";
import { Fab } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

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

const UploadPhoto = (props) => {

    useEffect(() => {
        if (!props.file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            props.setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(props.file);
    }, [props.file]);

    const pickedHandler = event => {
        let pickedFile;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            props.setFile(pickedFile);
        }
    };

    const sendPhoto = async () => {
        props.pushMessage();
        props.handleCloseDialog();
    }
    const classes = useStyles();

    return (
        <Fragment>
            <Dialog open={props.open} fullWidth maxWidth="sm">
                <DialogTitle disableTypography>
                    <Typography variant="h4" align="center">
                        Upload Photo
          </Typography>

                    <CssBaseline />
                    <div className={classes.paper}>
                        <label htmlFor="upload-photo">
                            <input
                                style={{ display: "none" }}
                                id="upload-photo"
                                name="upload-photo"
                                type="file"
                                accept=".jpg,.png,.jpeg"
                                onChange={pickedHandler}

                            />
                            <Fab color="secondary" size="small" component="span" aria-label="add" variant="extended">
                                <AddIcon /> Choose photo
                            </Fab>
                        </label>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <div className={classes.content}>
                        <img className={classes.preview} src={props.previewUrl} />
                        <br />
                        {props.file && (
                            <>
                                <input type="text" placeholder="Type a message" value={props.newMessage} onChange={(e) => props.setNewMessage(e.target.value)} />
                                <Fab color="secondary" size="small" component="span" aria-label="add" variant="extended" onClick={sendPhoto}>Send</Fab>
                            </>
                        )}
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

export default UploadPhoto;
