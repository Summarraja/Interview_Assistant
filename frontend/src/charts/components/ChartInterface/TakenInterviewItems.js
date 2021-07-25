import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import "../../pages/Charts.css";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

const useStyles = makeStyles(() => ({
  typoStyle: {
    fontFamily: "Calisto MT, Footlight MT Light",
  },
}));
const TakenInterviewItems = (props) => {
  const classes = useStyles();
  const { isLoading} = useHttpClient();

  useEffect(() => {
    if (props.selectedInterview)
      props.setCandidates(props.selectedInterview.candidates);
  }, [props.selectedInterview,props]);

  const getClass = () => {
    if (props.selectedInterview && props.selectedInterview === props.interview)
      return "selected";
    return "contact-box";
  };
  return (
    <>
      <LoadingSpinner open={isLoading} />
      <div
        className={getClass()}

        onClick={() => {
          props.setSelectedInterview(props.interview)
          props.setSelectedCand(null)
        }}
      >
        <div className="right-section">
          <div className="contact-box-header">
            <Typography variant="h6" className={classes.typoStyle}>
              {props.interview.title}
            </Typography>
          </div>
          <div className="last-msg">
            <Typography
              // className="text"
              variant="body2"
              className={classes.typoStyle}
            >
              {props.interview.date}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default TakenInterviewItems;
