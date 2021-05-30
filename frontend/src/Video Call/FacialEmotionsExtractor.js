import { useState, useContext, useEffect } from "react";
import io from 'socket.io-client';
let socket = io.connect("http://localhost:5001");

function FacialEmotionsExtractor(props) {
  const [stats, setStats] = useState([0, 0, 0, 0, 0, 0, 0]);
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
      if(arg.emotion==-1){
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
  }, [props.stats])

  function takepicture() {
    var canvas = document.createElement('canvas');
    canvas.width = 1224;
    canvas.height = 768;

    let ctx = canvas.getContext('2d');
    var userVideo = document.getElementById("userVideo");
    ctx.drawImage(userVideo, 0, 0, 240, 200)
    socket.emit("image-emotions", canvas.toDataURL());
    console.log("sent")
  }
  return (
    <>
    </>
  );
}

export default FacialEmotionsExtractor;