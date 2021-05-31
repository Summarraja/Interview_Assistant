import React from 'react';
import { Bar } from 'react-chartjs-2';

const createData = (stats)=>{
  let arr = [0,0,0,0,0,0,0];
  stats.forEach(element => {
    arr[element]+=1;
  });
  return arr;
}
const HorizontalBarChart = (props) => {
  const FaicalData = {
    labels: ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"],
    datasets: [
      {
        label: '# of Votes',
        data: createData((props.data[0].type=='facial')?props.data[0].emotions:props.data[1].emotions),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(99, 255, 132, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(99, 255, 132, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };
  const VocalData = {
    labels: ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"],
    datasets: [
      {
        label: '# of Votes',
        data: createData((props.data[0].type=='vocal')?props.data[0].emotions:props.data[1].emotions),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(99, 255, 132, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(99, 255, 132, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
      },
    },
  };
  return (
    <>
      <div className='header'>
        <h1 className='title'>Facial Horizontal Bar Chart</h1>
      </div>
      <Bar data={FaicalData} options={options} />
      <div className='header'>
        <h1 className='title'>Vocal Horizontal Bar Chart</h1>
      </div>
      <Bar data={VocalData} options={options} />
    </>
  )
};

export default HorizontalBarChart;