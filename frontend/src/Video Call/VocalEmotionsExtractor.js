import { useState, useEffect } from "react";
import io from 'socket.io-client';
import Recorder from 'recorder-js';
import { useCallback } from "react";

let socket = io.connect(process.env.REACT_APP_BACKEND_PYTHON_URL);

function VocalEmotionsExtractor(props) {

    const [audioContext ] = useState(new (window.AudioContext || window.webkitAudioContext)());
    const [recorder, setRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(true);


    useEffect(() => {
        socket.on("voice-emotions", arg => {

            let emotion = {
                "angry": 0,
                "disgust": 1,
                "fearful": 2,
                "happy": 3,
                "neutral": 4,
                "sad": 5,
                "surprised": 6,
                "calm": 7,
            }
            let arr = [0, 0, 0, 0, 0, 0, 0];

            if (emotion[arg.emotion] !== 7) {
                arr[emotion[arg.emotion]] = 1;
                props.setStats([...props.stats, emotion[arg.emotion]]);
            }
            props.setProgress(arr)
        })
        return () => {
            socket.off("voice-emotions");
        };
    }, [props.stats,props])
    const stopRecording= useCallback( ()=> {
        recorder.stop()
            .then(({ blob, buffer }) => {
                socket.emit("voice-emotions", blob);
                setIsRecording(false);
                // Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
                // buffer is an AudioBuffer
            });
    },[recorder])
    const startRecording= useCallback(()=> {
        recorder.start()
            .then(() => {
                setIsRecording(true);
                setTimeout(() => {
                    stopRecording()
                }, 3000);
            });
    },[recorder,stopRecording])

    useEffect(() => {
        if (audioContext && !recorder)
            setRecorder(new Recorder(audioContext, {}));
        if (recorder) {
            var userVideo = document.getElementById("partnerVideo");
            recorder.init(userVideo.srcObject);
            startRecording();
        }
    }, [audioContext, recorder,startRecording])

    useEffect(() => {
        if (!isRecording) {
            startRecording();
        }
    }, [isRecording,startRecording])


    return (
        <>
        </>
    );
}

export default VocalEmotionsExtractor;