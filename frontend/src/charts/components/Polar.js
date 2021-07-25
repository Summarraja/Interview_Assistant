import React from 'react';
import { PolarArea } from 'react-chartjs-2';


const createData = (stats)=>{
  let arr = [0,0,0,0,0,0,0];
  stats.forEach(element => {
    arr[element]+=1;
  });
  return arr;
}
const Polar = (props) => {
  const FacialData = {
    labels: ["Angry","Disgusted", "Fearful","Happy", "Neutral", "Sad", "Surprised"],
    datasets: [
      {
        label: '# of Votes',
        data: createData((props.data[0].type==='facial')?props.data[0].emotions:props.data[1].emotions),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(99, 255, 132, 0.5)',

        ],
        borderWidth: 1,
      },
    ],
  };
  const VocalData = {
    labels: ["Angry","Disgusted", "Fearful","Happy", "Neutral", "Sad", "Surprised"],
    datasets: [
      {
        label: '# of Votes',
        data: createData((props.data[0].type==='vocal')?props.data[0].emotions:props.data[1].emotions),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(99, 255, 132, 0.5)',

        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className='header'>
        <h1 className='title'>Facial Polar Area Chart</h1>
      </div>
      <PolarArea data={FacialData} />
      <div className='header'>
        <h1 className='title'>Vocal Polar Area Chart</h1>
      </div>
      <PolarArea data={VocalData} />
    </>
  )
};

export default Polar;