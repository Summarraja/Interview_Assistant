import React, { useContext, useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Avatar from "@material-ui/core/Avatar";
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { SocketContext } from "./shared/context/socket-context";
import ringtone from './Sounds/ringtone.mp3';
import { Howl } from 'howler';
import { useHistory } from 'react-router-dom';

const ringtoneSound = new Howl({
    src: [ringtone],
    loop: true,
    preload: true
})
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const RTC = () => {
    const [callerData, setCallerData] = useState({ name: '', image: '' });
    const [receivingCall, setReceivingCall] = useState(false);
    const [callerSignal, setCallerSignal] = useState();
    const [callMessage, setCallMessage] = useState('is calling you..');

    const socket = useContext(SocketContext);
    const history = useHistory();

    useEffect(() => {
        console.log('rtc')
        if (!socket)
            return;
        socket.on("hey", (data) => {
            console.log('hey')
            if(receivingCall){
                socket.emit("busy", { to: data.fromId })
            }else{
                setReceivingCall(true);
                ringtoneSound.load();
                ringtoneSound.play();
                setCallerData({
                    id: data.fromId,
                    name: data.fromName,
                    image: data.fromImage
                });
                setCallerSignal(data.signal);
            }
        })
        socket.on("close", (data) => {
            setReceivingCall(false);
            ringtoneSound.unload();
            setCallerData({ name: '', image: '' });
            setCallerSignal(null);
        })

        return () => {
            socket.off("hey");
            socket.off("close");
        };
    }, [socket]);


    function acceptCall() {
        ringtoneSound.unload();
        setReceivingCall(false);
        history.push({
            pathname: '/videocall',
            state: { from: true, caller: callerData.id, callerSignal }
        });
    }


    function rejectCall() {
        ringtoneSound.unload();
        setReceivingCall(false);
        socket.emit('rejected', { to: callerData.id })
    }
    return (
        <>
            <Dialog
                open={receivingCall}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >

                <DialogTitle id="alert-dialog-slide-title">
                    Friend's Call
                </DialogTitle>
                <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center', margin: '5%' }}>
                    <Avatar src={'http://localhost:5000/' + callerData.image} style={{ height: "20%", width: "20%", margin: "10px" }}></Avatar>
                    {callerData.name} {callMessage}
                </div>

                <DialogActions>
                    <Button onClick={rejectCall} style={{ color: 'red' }}>Reject Call</Button>
                    <Button onClick={acceptCall} style={{ color: 'green' }}>Accept Call</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RTC;