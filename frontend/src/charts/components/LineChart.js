import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = (props) => {
  const FacialData = {
    labels: [...Array(((props.data[0].type==='facial')?props.data[0].emotions:props.data[1].emotions).length-1).keys()],
    datasets: [
      {
        label: '# of Votes',
        data: (props.data[0].type==='facial')?props.data[0].emotions:props.data[1].emotions,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };
  const VocalData = {
    labels: [...Array(((props.data[0].type==='vocal')?props.data[0].emotions:props.data[1].emotions).length-1).keys()],
    datasets: [
      {
        label: '# of Votes',
        data: (props.data[0].type==='vocal')?props.data[0].emotions:props.data[1].emotions,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 6,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            let arr = ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"];
              return arr[value];
          }
      }
      }
    },
  };

  return (
    <>
      <div className='header'>
        <h1 className='title'>Facial Emotions Line Chart</h1>
      </div>
      <Line data={FacialData} options={options} />
      <div className='header'>
        <h1 className='title'>Vocal Emotions Line Chart</h1>
      </div>
      <Line data={VocalData} options={options} />
    </>
  )
};

export default LineChart;