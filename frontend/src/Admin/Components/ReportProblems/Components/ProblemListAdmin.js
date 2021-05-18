import React from 'react';
import ProblemListItemsAdmin from './ProblemListItemsAdmin';

const ProblemListAdmin = props => {
 
  return (

<>
      {props.items.map(problem => (
        <ProblemListItemsAdmin
          key={problem._id}
          id={problem._id}
          title = {problem.title}
          answer = {problem.answer}   
          description = {problem.description} 
          setproblems ={props.setproblems}    
        />
      ))}
      </>
  );

};
export default ProblemListAdmin;
