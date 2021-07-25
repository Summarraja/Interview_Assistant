import React, { useState, useContext } from "react";
import InterviewItems from "./InterviewItems";
import Container from "@material-ui/core/Container";

import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import bgInterview5 from "../../shared/components/UIElements/Images/bgInterview5.jpg";
import Typography from "@material-ui/core/Typography";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import MyInterviewCandidate from "./MyInterviewCandidate";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import Card from "@material-ui/core/Card";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

const useStyles = makeStyles((theme) => ({
  hero: {
    width: "100%",
    height: 400,
    marginTop: 0,
    backgroundImage: `linear-gradient(
        to bottom,
        rgba(0, 27.8, 46.7, 0.7),
        rgba(78, 120, 160, 0.7)
      ), url(${bgInterview5})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      height: 300,
      fontSize: "3em",
    },
  },
  paper: {
    margin: "30px auto",
    padding: "20px 50px",
  },
  TabStyle: {
    paddingTop: "13px",
    fontSize: "1.4rem",
  },
  noRequests: {
    width: "100%",
    padding: "10px 17px",
    color: "#004777",
  },
root:{
  padding: "6px"
}
}));

const InterviewList = (props) => {
  const classes = useStyles();

  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const CurrentDate = new Date(date);

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  if (props.uid === auth.userId && auth.setting.role === "Candidate") {

    const getCandidateRequestsData = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/users/${auth.userId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        props.setUserSentRequests(responseData.sentRequests);
        props.setUserReceivedRequests(responseData.receivedRequests);
        props.setUserAddedInterviews(responseData.addedInterviews);
      } catch (err) {
        console.log(err);
      }
    };

    
    return (
      <TabContext value={value}>
        <AppBar position="static">
          <TabList onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Sent Requests" value="1" />
            <Tab label="Received Requests" value="2" />
            <Tab label="My Interviews" value="3" />
          </TabList>
        </AppBar>
        <TabPanel value = "1" className={classes.root}>
        {props.userSentRequests.length === 0 ?  
          ( <Card className={classes.noRequests}>
            <Typography variant="h5" align="center">
              "No requests are found"{" "}
            </Typography>{" "}
          </Card> ) : 
         ( props.userSentRequests.map((sentReq) => (
            <MyInterviewCandidate
              getCandidateRequestsData = {getCandidateRequestsData}
              key={sentReq.id}
              InterID={sentReq.id}
              InterTitle = {sentReq.title}
              InterDate = {sentReq.date}
              tabValue= {value}
              userSentRequests = {props.userSentRequests}
              InterStatus={
                sentReq.isCancelled
                  ? "CANCELLED"
                  : new Date(sentReq.date) > CurrentDate
                  ? "PENDING"
                  : "TAKEN"
              }
              hasAccess={props.hasAccess}
            />
          )))}
        </TabPanel>
        <TabPanel value = "2" className={classes.root}>
        {props.userReceivedRequests.length === 0 ?  
          ( <Card className={classes.noRequests}>
            <Typography variant="h5" align="center">
              "No requests are found"{" "}
            </Typography>{" "}
          </Card> ) : 
          (props.userReceivedRequests.map((receiveReq) => (
            <MyInterviewCandidate
            getCandidateRequestsData = {getCandidateRequestsData}
              key={receiveReq.id}
              InterID={receiveReq.id}
              InterTitle = {receiveReq.title}
              InterDate = {receiveReq.date}
              hasAccess={props.hasAccess}
              userReceivedRequests = {props.userReceivedRequests}
              InterStatus={
                "TAKEN"
                // receiveReq.isCancelled
                //   ? "CANCELLED"
                //   : new Date(receiveReq.date) > CurrentDate
                //   ? "PENDING"
                //   : "TAKEN"
              }
              tabValue= {value}
            />
          )))}
        </TabPanel>
        <TabPanel value = "3" className={classes.root}>
        {props.userAddedInterviews.length === 0 ?  
          ( <Card className={classes.noRequests}>
            <Typography variant="h5" align="center">
              "No interviews Pending"{" "}
            </Typography>{" "}
          </Card> ) : 
         ( props.userAddedInterviews.map((addedInter) => (
            <MyInterviewCandidate
            getCandidateRequestsData = {getCandidateRequestsData}
              key={addedInter.id}
              InterID={addedInter.id}
              InterTitle = {addedInter.title}
              InterDate = {addedInter.date}
              userAddedInterviews = {props.userAddedInterviews}
              InterStatus={
                addedInter.isCancelled
                  ? "CANCELLED"
                  : new Date(addedInter.date) > CurrentDate
                  ? "PENDING"
                  : "TAKEN"
              }
              tabValue= {value}
              hasAccess={props.hasAccess}
            />
          )))}
        </TabPanel>
      </TabContext>
    );
  }

  if (props.items.length === 0) {
    return (
      <Container maxWidth="md" component="main">
        <Paper elevation={5} className={classes.paper}>
          <Typography variant="h4" color="primary" align="center">
           {auth.setting.role === "Candidate" ? "No interview has been created by this User": "No Interviews found. Maybe create one?" } 
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <TabContext value={value}>
      <AppBar position="static">
   
        <Tab
          label="Created Interviews"
          value="1"
          className={classes.TabStyle}
          selected={true}
          disableRipple={false}
        />
       
      </AppBar>
      {props.items.map((interview) => (
        <InterviewItems
          key={interview.id}
          id={interview.id}
          title={interview.title}
          description={interview.description}
          date={interview.date}
          isCancelled={interview.isCancelled}
          field={interview.field}
          candidates={interview.candidates}
          sendRequests={interview.sendRequests}
          receiveRequests={interview.receiveRequests}
          status={
            interview.isCancelled
              ? "CANCELLED"
              : new Date(interview.date) > CurrentDate
              ? "PENDING"
              : "TAKEN"
          }
          creatorId={interview.creator}
          role={props.role}
          hasAccess={props.hasAccess}
          setInterviews = {props.setInterviews}
          // receivedRequests = {props.receivedRequests}
          //   users = {loadedCandidates.map(candidate => candidate.resume)}
          //    onDelete = {props.onDeleteInterview}
        />
      ))}

    
    </TabContext>
  );
};

export default InterviewList;
