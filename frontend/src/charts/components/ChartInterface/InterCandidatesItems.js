import React, { useEffect, useState, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import '../../pages/Charts.css';
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../../shared/context/auth-context";
import { useCallback } from "react";

const useStyles = makeStyles((theme) => ({
  typoStyle: {
    fontFamily: "Calisto MT, Footlight MT Light"
  },
  Avatar: {
    display: "flex",
    alignItems: "center",
    marginRight: "0.5rem",
    border: '1px solid lightgray',
    width: 60,
    height: 60,
  }
}));


const InterCandidatesItems = (props) => {
  const classes = useStyles();
  const { isLoading, sendRequest } = useHttpClient();
  const [candidate, setcandidate] = useState();
  const auth = useContext(AuthContext);

  const fetchCandidResume =useCallback( async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_NODE_URL}/resumes/user/${props.id}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setcandidate(responseData.resume);
    } catch (err) {
      console.log(err);
    }
  },[auth.token, props.id,sendRequest]);
  useEffect(() => {
    fetchCandidResume();
  }, [fetchCandidResume])
  const getClass = () => {
    if (props.selectedCand && props.selectedCand === props.id)
      return "selected"
    return "contact-box"
  }
  return (
    <>
      <LoadingSpinner open={isLoading} />
      {candidate && (
        <div className={getClass()} onClick={() => props.setSelectedCand(props.id)}>
          <div className="avatar-component">
            <Avatar src={process.env.REACT_APP_BACKEND_ASSET_URL + candidate.image} className={classes.Avatar}>
            </Avatar>
          </div>
          <div className="right-section">
            <div className="contact-box-header">
              <Typography variant="h6" className="avatar-title">{candidate.fullname}
              </Typography>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default InterCandidatesItems;