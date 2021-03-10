import React from 'react';

import FaqListItems from './FaqListItems';

const FaqList = props => {
  return (

<>
      {props.items.map(faq => (
        <FaqListItems
          key={faq._id}
          id={faq._id}
          question = {faq.question}
          answer = {faq.answer}
        
        />
      ))}
      </>
  );

};

export default FaqList;