import React, { useState, useContext, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ListAltIcon from "@material-ui/icons/ListAlt";
import UpdateInterview from "../components/UpdateInterview";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  GridStyle: {
    margin: " 0px 45px 0px 23px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  InterviewFields: {
    marginTop: 7,
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submit: {
    float: "right",
  },
}));

const ViewInterview = (props) => {
  const auth = useContext(AuthContext);
  const { interId } = useParams();
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
  const [loadedInterview, setLoadedInterview] = useState();
  const [loadedField, setLoadedField] = useState();
  const [disableField, setDisableField] = useState(true);

  const EnableFieldsHandler = () => {
    setDisableField(false);
  };

  // Request to get sepcific Interview Details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/interviews/${interId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedInterview(responseData.interview);
      } catch (err) {}
    };
    if (!loadedInterview) fetchInterview();
  }, [loadedInterview]);

  // Request to get field title of fetched Interview

  useEffect(() => {
    const fetchField = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/fields/${loadedInterview.field}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedField(responseData.field);
      } catch (err) {}
    };
    if (!loadedField) fetchField();
  }, [loadedField, loadedInterview]);

  const paperStyle = {
    width: "100%",
    padding: 20,
    margin: "80px auto",
  };
  const avatarStyle = {
    backgroundColor: "primary",
  };
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={10} style={paperStyle}>
        <Typography align="center" variant="h4">
          Interview Details
        </Typography>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ListAltIcon style={avatarStyle} />
          </Avatar>
        </div>

        {!isLoading && loadedInterview && loadedField ? (
          <UpdateInterview
            interId={interId}
            disableField={disableField}
            loadedInterview={loadedInterview}
            loadedField={loadedField}
          />
        ) : (
          <LoadingSpinner open={isLoading} />
        )}

        {disableField && (
          <Button
            onClick={EnableFieldsHandler}
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Edit Details
          </Button>
        )}
        <Box mt={4}></Box>
      </Paper>
    </Container>
  );
};

export default ViewInterview;
