import React from 'react';

import UserItem from './UserItem';

const UsersList = props => {
  return (

<>
      {props.items.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
          profession={user.profession}
          image={user.image}
          city={user.city}
          country={user.country}
          interviewCount={user.interviews}
          certificateCount={user.certificates}
        />
      ))}
      </>
  );

};

export default UsersList;