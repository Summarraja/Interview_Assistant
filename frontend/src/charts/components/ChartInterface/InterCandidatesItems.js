import React from "react";
import Typography from "@material-ui/core/Typography";
import '../../pages/Charts.css';
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
    typoStyle :{
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
const InterCandidatesItems = (props) =>{
    const classes = useStyles();
    const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

   const getClass = () => {
    if (props.selectedCand && props.selectedCand == props.id)
      return "selected"
    return "contact-box"
  }
  return (
    <>
     <LoadingSpinner open={isLoading} />
     <React.Fragment >
      <div className={getClass()} onClick={() => props.setSelectedCand(props.id)}>
        <div className="avatar-component">
          <Avatar src={'http://localhost:5000/'+ props.image} className={classes.Avatar}>
          </Avatar>
        </div>
        <div className="right-section">
          <div className="contact-box-header">
            <Typography variant="h6" className="avatar-title">{props.name}
            </Typography>
          </div>
        </div>
      </div>
    </React.Fragment>
  </>
  )
}

export default InterCandidatesItems;