import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./Charts.css";
import { Toolbar, Typography, Card } from "@material-ui/core";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import TakenInterviewsList from "../components/ChartInterface/TakenInterviewsList";
import InterCandidatesList from "../components/ChartInterface/InterCandidatesList";
import Polar from '../components/Polar';
import HorizontalBar from '../components/HorizontalBar';
import MultiAxisLine from '../components/MultiAxisLine';
import LineChart from '../components/LineChart';
import { AiFillPropertySafety } from "react-icons/ai";

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
      width: "32%",
    },
  },
  noData:{
    padding: 10
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
      width: "68%",
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
  const [stats, setStats] = useState([]);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const CurrentDate = new Date(date);



  useEffect(() => {
    if (!selectedCand || !selectedInterview)
      return
    const getStats = async () => {
      try {

        const responseData = await sendRequest(
          `http://localhost:5000/api/emotionStats/${selectedInterview.id}/${selectedCand}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setStats(responseData.stats)
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [selectedCand]);
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
         
            <header className={classes.Headers}>
              <Typography
                align="center"
                variant="h5"
                className={classes.LeftTypoDiv}
              >
                Select Interviews
              </Typography>
            </header>
            <div className="LeftSmallDiv">
            <div>
              {interviews && (
                <TakenInterviewsList
                  items={takenInterviews}
                  selectedInterview={selectedInterview}
                  setSelectedInterview={setSelectedInterview}
                  setCandidates={setCandidates}
                  candidates={candidates}
                  setSelectedCand={setSelectedCand}
                />
              )}
            </div>
          </div>
         
            <header className={classes.Headers}>
              <Typography
                align="center"
                variant="h5"
                className={classes.LeftTypoDiv}
              >
                Select Candidate
              </Typography>
            </header>
            <div className="LeftSmallDiv">
            <div>
              {interviews && candidates && (
                <InterCandidatesList
                  items={candidates}
                  selectedCand={selectedCand}
                  setSelectedCand={setSelectedCand}
                  selectedInterview={selectedInterview}
                  setSelectedInterview={setSelectedInterview}
                />
              )}
            </div>
          </div>
        </div>
        <div className={classes.mainChat} >
          <header>
            <Typography
              variant="h4"
              className={classes.chartTypoDiv}
              align="center"
            >
              Emotions Statistics
            </Typography>
          </header>
          {selectedCand && (
            <div className="charts">
              {(stats.length == 0) && (
                <Card className={classes.noData}>
                  <Typography variant="h5" align="center">No Data Found</Typography></Card>
              )}
              {(stats.length > 0) && (
                <>
                  <MultiAxisLine data={stats} />
                  <LineChart data={stats}/>
                  <HorizontalBar data={stats} />
                  <Polar data={stats} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
