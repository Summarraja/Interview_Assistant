import React from 'react';

import FaqListItems from './FaqListItems';

const FaqList = props => {
  return (

<>
{console.log(props.items.Question)}
      {props.items.map(faq => (
        <FaqListItems
          key={faq.id}
          id={faq.id}
          question = {faq.Question}
          answer = {faq.Answer}
        
        />
      ))}
      </>
  );

};

export default FaqList;