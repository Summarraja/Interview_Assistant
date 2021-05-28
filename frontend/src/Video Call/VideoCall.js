import React, { useState, useEffect, useContext, useRef } from "react";
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import { Grid, IconButton, makeStyles } from "@material-ui/core";
import { AuthContext } from "../shared/context/auth-context";
import { SocketContext } from "../shared/context/socket-context";
import { useHistory } from 'react-router-dom';
import Peer from "simple-peer";
import Black from './black.png';
import Emotions from './Emotions';
import FacialEmotionsExtractor from './FacialEmotionsExtractor';
import VocalEmotionsExtractor from './VocalEmotionsExtractor';

const useStyles = makeStyles((theme) => ({

    bottomDiv: {
        marginLeft: 'auto',
        marginRight: 'auto',
        position: "absolute",
        width: "30%",
        zIndex: 10,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.5,
        backgroundColor: "#d3d3d3",
        alignItems: "center",
        margin: "10px",
        [theme.breakpoints.up("xm")]: {
            float: "left",
            flexGrow: 1,
            zIndex: -1,
        },

    },

    topdiv: {
        width: '100vw',
        height: '100vh',
    },
    userVideo: {
        width: '100%',
        bdcolor: 'rgba(255,255,255 ,1)',

    },

    userVideoStyles: {

        maxWidth: '15rem',
        maxHeight: '15rem',
        height: 'auto',
        width: 'auto',
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 3,
    },
    partnerVideoStyles: {
        width: '100%',
        height: '100%',
        zIndex: '99',
        backgroundColor: 'rgba(50,50,50,1)',
    },
    IconStyles: {
        marginLeft: "1rem",
        marginRight: "1rem",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
    },
    message: {
        position: 'absolute',
        top: '50%',
        textAlign: 'center',
        width: '100%',
        height: '100px',
        color: 'white',
        fontSize: 30,
    },
    mediaMessage: {
        position: 'absolute',
        top: '60%',
        textAlign: 'center',
        width: '100%',
        height: '100px',
        color: 'white',
        fontSize: 30,
    },
    showFaceEmotions: {
        maxWidth: '15rem',
        maxHeight: '15rem',
        height: '15rem',
        width: '10rem',
        position: 'absolute',
        bottom: '50%',
        right: 30,
        zIndex: 3,
        color: 'white',
    },
    showVoiceEmotions: {
        maxWidth: '15rem',
        maxHeight: '15rem',
        height: '15rem',
        width: '10rem',
        position: 'absolute',
        bottom: '50%',
        left: 30,
        zIndex: 3,
        color: 'white',
    },

}));

function VideoCall(props) {
    const classes = useStyles();
    const history = useHistory();

    const [audioMuted, setAudioMuted] = useState(false);
    const [videoMuted, setVideoMuted] = useState(props.location.state.type=='audio');
    const [stream, setStream] = useState();
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [message, setMessage] = useState('');
    const [mediaMessage, setMediaMessage] = useState('');
    const [showFaceEmotions, setShowFaceEmotions] = useState(false);
    const [showVoiceEmotions, setShowVoiceEmotions] = useState(false);
    const [partnerStream, setPartnerSstream] = useState(false);
    const [facialEmotionState, setFacialEmotionState] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [vocalEmotionState, setVocalEmotionState] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [isInterviewer,setIsInterviewer] = useState(false);
    const socket = useContext(SocketContext);
    const auth = useContext(AuthContext);

    const userVideo = useRef();
    const partnerVideo = useRef();
    const myPeer = useRef();

    useEffect(() => {

        window.addEventListener("popstate", goBack);
        window.addEventListener("beforeunload", alertUser);

        return () => {
            window.removeEventListener("beforeunload", alertUser);
            // window.removeEventListener("popstate", goBack);
        };
    }, [myPeer, stream, socket]);
    const alertUser = (e) => {
        e.preventDefault();
        e.returnValue = "";
    };
    const goBack = () => {
        if (myPeer.current)
            myPeer.current.destroy()
        socket.emit('close', { to: caller })
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });

        }
    };
    useEffect(() => {
        if (props.location.state && props.location.state.to){
            callPeer(props.location.state.to, props.location.state.type);
            if(props.location.state.type=='interview')
                setIsInterviewer(true);

        }
        if (props.location.state && props.location.state.caller) {
            setCaller(props.location.state.caller);
            setCallerSignal(props.location.state.callerSignal);
        }
    }, []);
    useEffect(()=>{
        if(videoMuted && stream){
            stream.getVideoTracks()[0].enabled = !videoMuted;
        }
    },[stream])
    useEffect(() => {
        if (caller && callerSignal)
            acceptCall();
    }, [caller, callerSignal]);

    useEffect(() => {
        if (audioMuted || videoMuted)
            setMediaMessage("Your mic/camera is muted..")
        else
            setMediaMessage("")

    }, [audioMuted, videoMuted])
    useEffect(() => {
        return () => {
            socket.off("callAccepted");
            socket.off("close");
            socket.off("rejected");
        };
    }, [])
    function callPeer(id,type) {
        if (id !== '' && id !== auth.userId) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                setStream(stream);
                setCaller(id)
                setMessage("Calling...");
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;
                }
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    config: {

                        iceServers: [
                            // {
                            //     urls: "stun:numb.viagenie.ca",
                            //     username: "sultan1640@gmail.com",
                            //     credential: "98376683"
                            // },
                            // {
                            //     urls: "turn:numb.viagenie.ca",
                            //     username: "sultan1640@gmail.com",
                            //     credential: "98376683"
                            // }
                            { url: 'stun:stun01.sipphone.com' },
                            { url: 'stun:stun.ekiga.net' },
                            { url: 'stun:stun.fwdnet.net' },
                            { url: 'stun:stun.ideasip.com' },
                            { url: 'stun:stun.iptel.org' },
                            { url: 'stun:stun.rixtelecom.se' },
                            { url: 'stun:stun.schlund.de' },
                            { url: 'stun:stun.l.google.com:19302' },
                            { url: 'stun:stun1.l.google.com:19302' },
                            { url: 'stun:stun2.l.google.com:19302' },
                            { url: 'stun:stun3.l.google.com:19302' },
                            { url: 'stun:stun4.l.google.com:19302' },
                            { url: 'stun:stunserver.org' },
                            { url: 'stun:stun.softjoys.com' },
                            { url: 'stun:stun.voiparound.com' },
                            { url: 'stun:stun.voipbuster.com' },
                            { url: 'stun:stun.voipstunt.com' },
                            { url: 'stun:stun.voxgratia.org' },
                            { url: 'stun:stun.xten.com' },
                            {
                                url: 'turn:numb.viagenie.ca',
                                credential: 'muazkh',
                                username: 'webrtc@live.com'
                            },
                            {
                                url: 'turn:192.158.29.39:3478?transport=udp',
                                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                username: '28224511:1379330808'
                            },
                            {
                                url: 'turn:192.158.29.39:3478?transport=tcp',
                                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                username: '28224511:1379330808'
                            }
                        ]
                    },
                    stream: stream,
                });

                myPeer.current = peer;

                peer.on("signal", data => {
                    console.log("signal")
                    socket.emit("callUser", { userToCall: props.location.state.to, signalData: data, fromId: auth.userId, fromName: auth.resume.fullname, fromImage: auth.resume.image , type:type})
                })

                peer.on("stream", stream => {
                    console.log("stream got", stream)
                    setMessage("");
                    if (partnerVideo.current) {
                        partnerVideo.current.srcObject = stream;
                        setPartnerSstream(true);
                    }
                });

                peer.on('error', (err) => {
                    console.log('on error')
                    endCall()
                })

                socket.on("callAccepted", signal => {
                    setCallAccepted(true);
                    console.log("accepted")
                    peer.signal(signal);
                })

                socket.on('close', () => {
                    console.log('on close')
                    myPeer.current.destroy()
                    setMessage("Call Ended..");
                    setTimeout(() => {
                        stream.getTracks().forEach((track) => {
                            track.stop();
                        });
                        history.goBack();
                    }, 2000);
                })

                socket.on('rejected', () => {
                    console.log('on rejected')
                    setMessage("Call Declined..");
                    setTimeout(() => {
                        stream.getTracks().forEach((track) => {
                            track.stop();
                        });
                        history.goBack();
                    }, 2000);
                })
                socket.on('busy', () => {
                    console.log('on busy')
                    setMessage("User is Busy..");
                    setTimeout(() => {
                        stream.getTracks().forEach((track) => {
                            track.stop();
                        });
                        history.goBack();
                    }, 2000);
                })
            })
                .catch(() => {
                    console.log("error")
                    alert('You cannot place/ receive a call without granting video and audio permissions! Please change your settings.')
                })
        } else {
            console.log("error2")
            return
        }
    }
    function acceptCall() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
            setCallAccepted(true);
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream,
            });

            myPeer.current = peer

            peer.on("signal", data => {
                console.log('on signal')

                socket.emit("acceptCall", { signal: data, to: caller })
            })

            peer.on("stream", stream => {
                console.log('stream got', stream)
                partnerVideo.current.srcObject = stream;
                setPartnerSstream(true);
            });

            peer.on('error', (err) => {
                console.log('on error')
                endCall()
            })

            peer.signal(callerSignal);

            socket.on('close', () => {
                console.log('on close')
                myPeer.current.destroy()
                setMessage("Call Ended..");
                setTimeout(() => {
                    stream.getTracks().forEach((track) => {
                        track.stop();
                    });
                    history.goBack();
                }, 2000);
                // window.location.reload()
            })
        })
            .catch((err) => {
                //   setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
                //   setModalVisible(true)
                console.log(err)
            })
    }
    function endCall() {
        console.log("ended")
        if (myPeer.current)
            myPeer.current.destroy()
        socket.emit('close', { to: caller })
        setMessage("Call Ended..");
        setTimeout(() => {
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
            history.goBack();
        }, 2000);
    }
    function showFaceEmotionsHandler() {
        setShowFaceEmotions(!showFaceEmotions);
    }
    function showVoiceEmotionsHandler() {
        setShowVoiceEmotions(!showVoiceEmotions);
    }
    function toggleMuteAudio() {
        if (stream) {
            setAudioMuted(!audioMuted)
            stream.getAudioTracks()[0].enabled = audioMuted
        }
    }
    function toggleMuteVideo() {
        if (stream) {
            setVideoMuted(!videoMuted)
            stream.getVideoTracks()[0].enabled = videoMuted
        }
    }
    return (
        <>
            <div className={classes.topdiv}>
                {showFaceEmotions && (
                    <>
                        <FacialEmotionsExtractor setProgress={setFacialEmotionState} />
                        <div className={classes.showFaceEmotions}>Facail Emotions<br/><Emotions progress={facialEmotionState} /></div>
                    </>
                )}
                {showVoiceEmotions && (
                    <>
                        <VocalEmotionsExtractor setProgress={setVocalEmotionState} />
                        <div className={classes.showVoiceEmotions}>Vocal Emotions<br/><Emotions progress={vocalEmotionState} /></div>
                    </>
                )}
                <div className={classes.message}>{message}</div>
                <div className={classes.mediaMessage}>{mediaMessage}</div>
                <div className={classes.partnerVideoStyles}>
                    {callAccepted && (<video width='100%' height='100%' playsInline ref={partnerVideo} poster={Black} autoPlay />)}
                </div>
                <div className={classes.userVideoStyles}>
                    {stream && (<video id="userVideo" className={classes.userVideo} playsInline muted ref={userVideo} poster={Black} autoPlay />)}
                </div>
                <div className={classes.bottomDiv}>
                    <Grid align="center">
                        <IconButton className={classes.IconStyles} onClick={toggleMuteAudio}>
                            {audioMuted ? <MicIcon color="primary" style={{ fontSize: "2rem" }} /> : <MicOffIcon color="primary" style={{ fontSize: "2rem" }} />}
                        </IconButton>
                        <IconButton className={classes.IconStyles} onClick={toggleMuteVideo} >
                            {videoMuted ? <VideocamIcon color="primary" style={{ fontSize: "2rem" }} /> : <VideocamOffIcon color="primary" style={{ fontSize: "2rem" }} />}
                        </IconButton>
                        <IconButton className={classes.IconStyles} onClick={() => endCall()}>
                            <CallEndIcon color="primary" style={{ fontSize: "2rem" }} />
                        </IconButton>
                        {isInterviewer && (
                            <IconButton className={classes.IconStyles} onClick={() => showFaceEmotionsHandler()}>
                                <SentimentVerySatisfiedIcon color="primary" style={{ fontSize: "2rem" }} />
                            </IconButton>
                        )}
                        {isInterviewer && (
                            <IconButton className={classes.IconStyles} onClick={() => showVoiceEmotionsHandler()}>
                                <RecordVoiceOverIcon color="primary" style={{ fontSize: "2rem" }} />
                            </IconButton>
                        )}
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default VideoCall;
