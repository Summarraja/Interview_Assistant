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
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

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

        alignContent: "center",
        width: "60%",
        height: "60%"
    }
}));

const UploadPhoto = (props) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState();
    const { isLoading, sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedHandler = event => {
        let pickedFile;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
        }
    };

    const uploadPhoto = async () => {
        try {
            const formData = new FormData();
            formData.append('userId', auth.userId);
            formData.append('image', file);
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/uploadImage',
                'POST',
                formData,
                {
                    Authorization: "Bearer " + auth.token,
                }
            );
            if (responseData) {

                const storedData = JSON.parse(localStorage.getItem('userData'));
                storedData.resume.image = responseData.image;
                auth.resume.image = responseData.image;
                localStorage.setItem('userData', JSON.stringify(storedData));
                props.handleCloseDialog();
            }
        } catch (err) {
        }
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
                        <img className={classes.preview} src={previewUrl} alt="User's profile" />
                        <br />
                        {file && (<Fab color="secondary" size="small" component="span" aria-label="add" variant="extended" onClick={uploadPhoto}>Upload</Fab>)}
                        {isLoading&&(<><br/><br/><CircularProgress /></>)}
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