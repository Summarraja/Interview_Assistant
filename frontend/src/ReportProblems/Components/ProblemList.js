import React from 'react';
import ProblemListItems from './ProblemListItems';

const ProblemList = props => {
 
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
