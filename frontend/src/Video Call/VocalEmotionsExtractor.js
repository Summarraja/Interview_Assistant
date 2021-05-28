import { useState, useContext, useEffect } from "react";
import io from 'socket.io-client';
import Recorder from 'recorder-js';

let socket = io.connect("http://localhost:5001");

function VocalEmotionsExtractor(props) {

    const [audioContext, setAudiocontext] = useState(new (window.AudioContext || window.webkitAudioContext)());
    const [recorder, setRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(true);
    const [stats, setStats] = useState([0, 0, 0, 0, 0, 0, 0]);


    useEffect(() => {
        if (audioContext && !recorder)
            setRecorder(new Recorder(audioContext, {}));
        if (recorder) {
            var userVideo = document.getElementById("userVideo");
            recorder.init(userVideo.srcObject);
            startRecording();
        }
    }, [audioContext, recorder])

    useEffect(() => {
        if (!isRecording) {
            startRecording();
        }
    }, [isRecording])

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

            if (emotion[arg.emotion] != 7)
                arr[emotion[arg.emotion]] = 1;
            props.setProgress(arr)
            var sum = arr.map(function (num, idx) {
                return num + stats[idx];
            });
            console.log(sum);
            setStats(sum);
        })
        return () => {
            socket.off("voice-emotions");
        };
    }, [stats])

    function startRecording() {
        recorder.start()
            .then(() => {
                setIsRecording(true);
                setTimeout(() => {
                    stopRecording()
                }, 3000);
            });
    }

    function stopRecording() {
        recorder.stop()
            .then(({ blob, buffer }) => {
                socket.emit("voice-emotions", blob);
                setIsRecording(false);
                // Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
                // buffer is an AudioBuffer
            });
    }

    return (
        <>
        </>
    );
}

export default VocalEmotionsExtractor;