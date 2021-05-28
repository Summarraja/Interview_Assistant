import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import VerticalBar from '../components/VerticalBar';
import HorizontalBar from '../components/HorizontalBar';
import DoughnutChart from '../components/DoughnutChart';
import Polar from '../components/Polar';

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: "#fff",
      margin: '10%',
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
      },
    },
}));
const Charts = (props) => {
    const classes = useStyles();
    console.log(props)
    return (
        <div className={classes.root}>
            <VerticalBar/>
            <HorizontalBar/>
            <DoughnutChart/>
            <Polar/>
        </div>
    );
};

export default Charts;