import React, { useState } from "react";
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import { Grid, IconButton , makeStyles} from "@material-ui/core";




const useStyles = makeStyles((theme) => ({
root:{
    "&:hover":{
    backgroundColor:"maroon"

    }
},

 bottomDiv: {
        position: "absolute",
        width: "50%",
        zIndex: -1,
        bottom: "0px",
        backgroundColor: "#d3d3d3",
        alignItems: "centers",
        margin: "10px",
        [theme.breakpoints.up("xm")]: {
           float:"left",
           flexGrow:1,
           zIndex: -1, 
          },

    },

    topdiv :{

        marginLeft: "150px",
        marginRight: "80px",
        zIndex: 1,
        backgroundColor: "#d3d3d3",
        height: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        [theme.breakpoints.up("xm")]: {
            marginLeft: "0px",
            marginRight: "0px",
           },
    },



}));

function VideoCall() {
 const [micClicked, setmicClicked] = useState();
 const [camClicked, setcamClicked] = useState();

    const classes = useStyles();

    const IconStyles = {
        marginLeft: "45px",
        marginRight: "45px",
        marginTop: "5px",
        marginBottom: "5px",

    };


    const imgStyle = {
        marginTop: "80px",
        width: "100%",
        height: "100%",
        zIndex: -2,
        marginLeft: "0px",
        objectFit: "cover"
    }

   

    const bottomCam = {
        position: "absolute",
        width: "200px",
        height: "130px",
        zIndex: 3,
        bottom: 0,
        right: 0,
        backgroundColor: "grey"

    };

    const camimgStyle = {

        width: "100%",
        height: "auto",
        zIndex: -2,
        marginLeft: "0px",
        marginTop: "0px",
        objectFit: "cover"
    };

    const mic = {
        display: "inline",

    };

    const endcall = {
        display: "inline",
        backgroundColor: "maroon",
        padding: 0
    };
    const cam = {
        display: "inline",

    };



    return (
        <>
            {/* // <div style={{ background: "white", width: "100%", zIndex: 2, position: "fixed", height: "100vh" }}> */}
            <div className={classes.topdiv}>
                <img style={imgStyle} src="https://www.ringcentral.co.uk/gb/en/blog/wp-content/uploads/2021/04/photo-of-a-woman-wearing-headphones-smiling-and-waving-as-if-on-a-video-conferencing-call-scaled.jpg" />


                <div style={bottomCam}>
                    <img style={camimgStyle} src="https://thumbs.dreamstime.com/b/close-up-headshot-portrait-male-ceo-director-headphones-talk-speak-video-call-office-business-client-caucasian-210470690.jpg" />
                </div>

                <div className={classes.bottomDiv}>
                    <Grid align="center">

                        <IconButton style={IconStyles} onClick={() => setmicClicked(!micClicked)}>
                        {micClicked  ? <MicIcon color="primary" style={{fontSize:"2rem"}} /> : <MicOffIcon color="primary" style={{fontSize:"2rem"}} />}                            
                        </IconButton>

                        <IconButton style={IconStyles} onClick={() => setcamClicked(!camClicked)} >
                        {camClicked ? <VideocamIcon color="primary" style={{fontSize:"2rem"}} /> : <VideocamOffIcon color="primary" style={{fontSize:"2rem"}} />} 
                           
                        </IconButton>

                        <IconButton className={classes.root} style={IconStyles}>

                            <CallEndIcon color="primary" style={{fontSize:"2rem"}}/>

                        </IconButton>
                    </Grid>
                </div>







            </div>




        </>




    );

}

export default VideoCall;