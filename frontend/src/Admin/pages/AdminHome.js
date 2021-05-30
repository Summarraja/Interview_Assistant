import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Card, Toolbar, Typography } from "@material-ui/core";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import SearchedResumes from "../Components/SearchedResumes";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SearchCandidates from "../../Interviews/components/SearchCandidates";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 210
  },
  bgCard: {
    marginTop: "50px",
    width: "60%",
    alignItems: "center",
    marginLeft: "20%",
    [theme.breakpoints.down("xs")]: {
      width: "80%",
      marginLeft: "10%",
    },
  },
  
  searchBar: {
    width: "100%",
  },
  searchedItems: {
    backgroundColor: "white",
    padding: 10

  },
  list: {
    padding: 0,
  },
  responsive: {
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
  },
  listItem: {
    padding: "4px 8px",
  },
}));

export default function AdminHome(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();

  const [searchItem, setSearchItem] = useState("");
  const [resume, setResume] = useState([]);
  const [closeIcon, setCloseIcon] = useState(false);

  useEffect(() => {
    setResume("");
    setCloseIcon(false);
  }, [searchItem]);

  const handleCloseDialog = () => {
    props.setOpen(false);
    setSearchItem("");
    setCloseIcon(false);
  };

  const getSearchItem = () => {
    setCloseIcon(!closeIcon);
    const fetchSearchedResumes = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/resumes/admin/${searchItem}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData.resumes)
        setResume(responseData.resumes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSearchedResumes();
  };

  return (

    <Container>
      <Toolbar />
      <div className={classes.root}>
      <LoadingSpinner open={isLoading} />
      <Card className={classes.bgCard}>
        <SearchCandidates
          className={classes.searchBar}
          setSearchItem={setSearchItem}
          searchItem={searchItem}
          getSearchItem={getSearchItem}
          closeIcon={closeIcon}   
          setCloseIcon={setCloseIcon}
        />
        {closeIcon && (
            <Card className={classes.searchedItems}>
            { resume.length === 0  ? 
             <Typography variant="h6">{isLoading ? "Searching User..." : "No user found"}</Typography> 
            :
            resume.map((resume) => (
              <SearchedResumes
                key={resume._id}
                id={resume._id}
                name={resume.firstname + " " + resume.lastname}
                userId={resume.user.id}
                file = {resume.image}
              />
            ))}
          </Card>
        ) }
      
      </Card>
      </div>

      <CssBaseline />
    </Container>
  );
}
