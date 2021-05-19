import {  Paper, Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ProblemListItems from './ProblemListItems';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "30px auto",
    padding: "20px 50px",
  },
}));

const ProblemList = props => {
   const classes = useStyles();

  if (props.items.length === 0) {
    return (
   
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h4" color="primary" align="center">
           No Problem has been reported by User
          </Typography>
        </Paper>
     
    );
  }

 
  return (

<>  
      {props.items.map(problem => (
        <ProblemListItems
          key={problem._id}
          id={problem._id}
          title = {problem.title}
          answer = {problem.answer}   
          description = {problem.description} 
          setFaqs ={props.setFaqs}    
        />
      ))}
      </>
  );

};
export default ProblemList;
