import React from 'react';
import { Line } from 'react-chartjs-2';
const createData = (stats)=>{
  let arr = [0,0,0,0,0,0,0];
  stats.forEach(element => {
    arr[element]+=1;
  });
  return arr;
}

const MultiAxisLine = (props) => {

  const data = {
    labels: ["Angry","Disgusted", "Fearful","Happy", "Neutral", "Sad", "Surprised"],
    datasets: [
      {
        label: 'Facial Emotions',
        data: createData((props.data[0].type=='facial')?props.data[0].emotions:props.data[1].emotions),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y-axis-1',
      },
      {
        label: 'Vocal Emotions',
        data: createData((props.data[0].type=='vocal')?props.data[0].emotions:props.data[1].emotions),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y-axis-2',
      },
    ],
  };
  
  const options = {
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          gridLines: {
            drawOnArea: false,
          },
        },
      ],
    },
  };
  
  return (
    <>
      <div className='header'>
        <h1 className='title'>Multiple Axis Line Chart</h1>
      </div>
      <Line  data={data} options={options} />
    </>
  )
};

export default MultiAxisLine;