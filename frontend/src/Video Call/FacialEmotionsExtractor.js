import {  useEffect } from "react";
import io from 'socket.io-client';
let socket = io.connect(process.env.REACT_APP_BACKEND_PYTHON_URL);

function FacialEmotionsExtractor(props) {
  useEffect(() => {
    const timer = setInterval(() => {
      takepicture();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [])

  useEffect(() => {
    socket.on("image-emotions", arg => {
      let arr = [0, 0, 0, 0, 0, 0, 0]
      if(arg.emotion===-1){
        props.setProgress(arr)
      }
      else{
        arr[arg.emotion] = 1;
        props.setStats([...props.stats,arg.emotion]);
        props.setProgress(arr)
      }
    })
    return () => {
      socket.off("image-emotions");
    };
  }, [props.stats,props])

  function takepicture() {
    var canvas = document.createElement('canvas');
    canvas.width = 1224;
    canvas.height = 768;

    let ctx = canvas.getContext('2d');
    var userVideo = document.getElementById("partnerVideo");
    ctx.drawImage(userVideo, 0, 0, 240, 200)
    socket.emit("image-emotions", canvas.toDataURL());
  }
  return (
    <>
    </>
  );
}

export default FacialEmotionsExtractor;