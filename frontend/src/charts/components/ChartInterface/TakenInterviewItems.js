import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import "../../pages/Charts.css";
import { makeStyles } from "@material-ui/core/styles";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  typoStyle: {
    fontFamily: "Calisto MT, Footlight MT Light",
  },
}));
const TakenInterviewItems = (props) => {
  const classes = useStyles();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [interCandidates, setinterCandidates] = useState([]);


  useEffect(() => {
    if (props.selectedInterview && props.selectedInterview.id == props.id) {
      setinterCandidates([]);

      props.selectedInterview.candidates.map((cand) =>
        setinterCandidates((oldArray) => [...oldArray, cand])
      );
    }

    props.setCandidates(interCandidates);
  }, [props.selectedInterview, interCandidates.length]);

  const getClass = () => {
    if (props.selectedInterview && props.selectedInterview == props.interview)
      return "selected";
    return "contact-box";
  };
  return (
    <>
      <LoadingSpinner open={isLoading} />
      <div
        className={getClass()}
        onClick={() => props.setSelectedInterview(props.interview)}
      >
        <div className="right-section">
          <div className="contact-box-header">
            <Typography variant="h6" className={classes.typoStyle}>
              {props.title}
            </Typography>
          </div>
          <div className="last-msg">
            <Typography
              className="text"
              variant="body2"
              className={classes.typoStyle}
            >
              {props.date}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default TakenInterviewItems;
