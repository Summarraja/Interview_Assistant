import React from 'react';

import FaqListItemsAdmin from './FaqListItemsAdmin';

const FaqListAdmin = props => {
  {console.log("it is faqlist page")}
  return (

<>
      {props.items.map(faq => (
        <FaqListItemsAdmin

          key={faq._id}
          id={faq._id}
          question = {faq.question}
          answer = {faq.answer}   
          setFaqs ={props.setFaqs}    
        />
      ))}
      </>
  );

};
export default FaqListAdmin;
