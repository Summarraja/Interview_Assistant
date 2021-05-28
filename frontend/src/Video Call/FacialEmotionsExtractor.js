import { useState, useContext, useEffect } from "react";
import io from 'socket.io-client';
let socket = io.connect("http://localhost:5001");

function FacialEmotionsExtractor(props) {
  const [stats, setStats]=useState([0,0,0,0,0,0,0]);
  useEffect(() => {
    const timer = setInterval(() => {
      takepicture();
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, [])

  useEffect(() => {
    socket.on("image-emotions", arg => {
      let arr = arg.emotion.map(function(item) {
        return item * 100;
      })
      var sum = stats.map(function (num, idx) {
        return num + arr[idx];
      });
      console.log(sum);
      setStats(sum);
      props.setProgress(arr)
    })
    return () => {
      socket.off("image-emotions");
  };
  }, [])

  function takepicture() {
    var canvas = document.createElement('canvas');
    canvas.width = 1224;
    canvas.height = 768;

    let ctx = canvas.getContext('2d');
    var userVideo = document.getElementById("userVideo");
    ctx.drawImage(userVideo,0, 0, 240, 200)
    socket.emit("image-emotions", canvas.toDataURL());
  }
  return (
    <>
    </>
  );
}

export default FacialEmotionsExtractor;