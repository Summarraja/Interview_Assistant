import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./Charts.css";
import { Toolbar, Typography } from "@material-ui/core";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import TakenInterviewsList from "../components/ChartInterface/TakenInterviewsList";
import InterCandidatesList from "../components/ChartInterface/InterCandidatesList";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    paddingLeft: 60,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
  },

  aside: {
    background: "#fff",
    [theme.breakpoints.up("xs")]: {
      width: "40%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "40%",
    },
    [theme.breakpoints.up("md")]: {
      width: "35%",
    },
  },

  mainChat: {
    background: "#d3d3d3",
    display: "flex",
    flexDirection: "column",
    backgroundSize: "contain",
    [theme.breakpoints.up("xs")]: {
      width: "60%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "60%",
    },
    [theme.breakpoints.up("md")]: {
      width: "75%",
    },
  },
  Headers: {
    backgroundColor: "#4E78A0",
    color: "#fff",
  },
  LeftTypoDiv: {
    fontSize: "1.4rem",
    marginLeft: "30%",
    [theme.breakpoints.down("md")]: {
      margin: "0% 30%",
    },
    [theme.breakpoints.down("xs")]: {
      margin: "0% 20%",
    },
  },
  chartTypoDiv: {
    color: "#004777",
    margin: "0% 38%",
  },
}));

const Charts = () => {
  const classes = useStyles();
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState();
  const [selectedCand, setSelectedCand] = useState();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const CurrentDate = new Date(date);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/interviews/user/" + auth.userId,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setInterviews(responseData.interviews);
        console.log(responseData.interviews);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  let takenInterviews = [];

  interviews &&
    interviews.map(
      (inter) =>
        new Date(inter.date) < CurrentDate &&
        !inter.isCancelled &&
        takenInterviews.push(inter)
    );

  return (
    <div className={classes.root}>
      <LoadingSpinner open={isLoading} />
      <Toolbar />
      <div className="Chartapp">
        <div className="LeftBigDiv" className={classes.aside}>
          <div className="LeftSmallDiv">
            <header className={classes.Headers}>
              <Typography
                align="center"
                variant="h5"
                className={classes.LeftTypoDiv}
              >
                Select Interviews
              </Typography>
            </header>
            <div>
              {!isLoading && (
                <TakenInterviewsList
                  items={takenInterviews}
                  selectedInterview={selectedInterview}
                  setSelectedInterview={setSelectedInterview}
                  setCandidates={setCandidates}
                />
              )}
            </div>
          </div>
          <div className="LeftSmallDiv">
            <header className={classes.Headers}>
              <Typography
                align="center"
                variant="h5"
                className={classes.LeftTypoDiv}
              >
                Select Candidates
              </Typography>
            </header>
            <div>
              {!isLoading && candidates && (
                <InterCandidatesList
                  items={candidates}
                  selectedCand={selectedCand}
                  setSelectedCand={setSelectedCand}
                />
              )}
            </div>
          </div>
        </div>
        <div className={classes.mainChat}>
          <header>
            <Typography
              variant="h4"
              className={classes.chartTypoDiv}
              align="center"
            >
              Emotions Statistics
            </Typography>
          </header>
        </div>
      </div>
    </div>
  );
};

export default Charts;
