import React, { useEffect, useState, useContext} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Card, Grid } from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';
import { AuthContext } from '../../../../shared/context/auth-context';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import RespondProblemAdmin from './RespondProblemAdmin';


const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    display: "flex",
    marginTop: "15px",
    padding: "10px 17px",
  },

  ViewButton: {
    height: "35px",
    marginTop: "12px ",
    marginRight: "10px",
    [theme.breakpoints.up("sm")]: {
      float: "right",
    },
    [theme.breakpoints.down("sm")]: {
      float:"center"
    },
  },

  header: {
    flexGrow: 1,
  },
    
      accor: {
        padding: "20px 40px",
      },
      heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: theme.typography.fontWeightBold,
        color: "#004777",
      },

    }));
const ProblemListItemsAdmin = (props) =>{
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
    const classes = useStyles();
    const [loadedproblems, setLoadedproblems]= useState();
    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
      setOpen(true);
    };
    const handleCloseDialog = () => {
      setOpen(false);
    };

    const getData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/problems/unanswer'
        );
        props.setproblems(responseData.unanswerdproblems);
      } catch (err) {
        console.log(err)
      }
    }


    useEffect(() => {
      const fetchProblem = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/problems/${props.id}`,
            "GET",
            null,
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          setLoadedproblems(responseData.problem);
        } catch (err) {}
      } ;
      fetchProblem()
    }, [open, loadedproblems]);

return (

  <Card className={classes.card}>
  <Grid container >
    <Grid item sm={6} lg={11} style={{ flexGrow: 1 }}>
      <div className={classes.header}>
        
        <Typography variant="h5" align="justify" style={{fontFamily:"Times New Roman"}} color="primary">
        Title: {props.title}
        </Typography>
        <Typography variant="h6">
        Description: {props.description}
        </Typography>
        <Typography variant="subtitle1" style={{ color: "grey" }}>
       {props.answer}
        </Typography>
      </div>
    </Grid>
</Grid>

<Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.ViewButton}
            startIcon={<ReplyIcon style={{ marginLeft: 6 }} />}
            onClick={() => {
              handleOpenDialog();
          }}
          >
           Reply
          </Button>
          {open && (
                        <RespondProblemAdmin
                            open={open}
                            handleCloseDialog={handleCloseDialog}
                            setOpen={setOpen}
                            loadedproblems={loadedproblems}
                            problemid={props.id}
                            getData={getData}
                        />
                    )}

</Card>



);
}

export default ProblemListItemsAdmin;