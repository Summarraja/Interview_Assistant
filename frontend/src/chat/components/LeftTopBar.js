import React, { useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import './LeftTopBar.css';
import { AuthContext } from '../../shared/context/auth-context';
import { Link } from 'react-router-dom';

function LeftTopBar(props) {
  const auth = useContext(AuthContext);
  return (
    <>
      <Link style={{ textDecoration: 'none', color: '#000000' }} to={`/profile/${auth.userId}`}>

        <div className="avatar-component">

          <Avatar
            src={process.env.REACT_APP_BACKEND_ASSET_URL + auth.resume.image}
            style={{
              display: "flex",
              alignItems: "center",
              border: '1px solid lightgray',
              margin: "0.5rem",
              width: 50,
              height: 50,
            }}>

          </Avatar>
          <div style={{ margin: "10px" }}>
            <Typography variant="h6" >
              {props.name}
            </Typography>
          </div>


        </div>
      </Link>
      {/* <div style={{ float: "right" }}>
        <IconButton
        >
          <MoreVertIcon color="primary" />
        </IconButton>
      </div> */}
    </>
  );

}
export default LeftTopBar;