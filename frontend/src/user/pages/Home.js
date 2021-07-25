import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import SearchCandidates from "../../Interviews/components/SearchCandidates";
import { Card, Toolbar, Typography } from "@material-ui/core";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import UserSearchedResumes from "../components/UserSearchedResumes";
import homeimage from "../../shared/components/UIElements/Images/homeimage.jpg";

const useStyles = makeStyles((theme) => ({
  bgCard: {
    marginTop: "50px",
    width: "60%",
    zIndex: 9999999,
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
    padding: 10,
    zIndex: 999999
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
  content: {
    width: "100%",
    height: "100%",
    textAlign: "center",
  },
  preview: {
    alignContent: "center",
    height: "90vh",
    zIndex: -1,
  },

  hero: {
    height: "91vh",
    marginTop: 0,
    backgroundImage: `linear-gradient(
        to bottom,
        rgba(0, 27.8, 46.7, 0.5),
        rgba(78, 120, 160, 0.5)
      ), url(${homeimage})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    minHeight: "100%",
    position: "relative"
  },
}));

export default function Home(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading,  sendRequest } = useHttpClient();

  const [searchItem, setSearchItem] = useState("");
  const [resume, setResume] = useState([]);
  const [closeIcon, setCloseIcon] = useState(false);

  useEffect(() => {
    setResume("");
    setCloseIcon(false);
  }, [searchItem]);



  const getSearchItem = () => {
    setCloseIcon(!closeIcon);
    const fetchSearchedResumes = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_NODE_URL}/resumes/resume/${searchItem}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setResume(responseData.resumes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSearchedResumes();
  };

  return (
    <>
      <Toolbar />
      <div className={classes.hero}>
        <Container>
          <div >
            <div className={classes.bgCard}>
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
                  {resume.length === 0 ? (
                    <Typography variant="h6">
                      {isLoading ? "Searching User..." : "No user found"}
                    </Typography>
                  ) : (
                    resume.map((resume) => (
                      <UserSearchedResumes
                        key={resume._id}
                        id={resume._id}
                        name={resume.firstname + " " + resume.lastname}
                        userId={resume.user.id}
                        image={resume.image}
                      />
                    ))
                  )}
                </Card>
              )}
            </div>
            <br />
          </div>

          <div style={{
            position: 'absolute',
            color: 'white',
            marginRight: "70px",
            bottom: 45,

          }} >
            <Typography variant="h5" align="center" style={{ fontSize: "2rem" }}>
              "Interview Assistant is a web-based chat application which is supposed to aid the process
              of interviewing utilizing voice and video analyses to give feedback to the interviewer
              regarding the emotions of an interviewee"
                            </Typography></div>

          <CssBaseline />
        </Container>

      </div>
    </>
  );
}