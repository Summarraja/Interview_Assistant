import React, { useEffect, useState, useContext} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Card, Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import UpdateProblem from './UpdateProblem';
import DeleteProblem from './DeleteProblem';


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
const ProblemListItems = (props) =>{
  const auth = useContext(AuthContext);
  const { isLoading, error, status, sendRequest, clearError } = useHttpClient();
    const classes = useStyles();
    const [loadedFaqs, setLoadedFaqs]= useState();
    const [open, setOpen] = useState(false);
  
    const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);

    const OpenDeleteDialogHandler = () => {
      setOpenDeleteDialog(true);
    };

    const handleOpenDialog = () => {
      setOpen(true);
    };
    const handleCloseDialog = () => {
      setOpen(false);
    };

    const getData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/problems'
        );
        props.setFaqs(responseData.problems);
      } catch (err) {
        console.log(err)
      }
    }


  


    useEffect(() => {
      const fetchFaq = async () => {
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
          setLoadedFaqs(responseData.problem);
        } catch (err) {}
      } ;
      fetchFaq()
    }, [open, loadedFaqs]);

return (

  <Card className={classes.card}>
  <Grid container >
    <Grid item sm={6} lg={11} style={{ flexGrow: 1 }}>
      <div className={classes.header}>
        
        <Typography variant="h5" align="justify" style={{fontFamily:"Times New Roman"}} color="primary">
        {props.title}
        </Typography>
        <Typography variant="h6">
        {props.description}
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
            className={classes.ViewButton}
            startIcon={<EditIcon style={{ marginLeft: 6 }} />}
            onClick={() => {
              handleOpenDialog();
          }}
          >
            Edit
          </Button>
          {open && (
                        <UpdateProblem
                            open={open}
                            handleCloseDialog={handleCloseDialog}
                            setOpen={setOpen}
                            loadedFaqs={loadedFaqs}
                            problemid={props.id}
                            getData={getData}
                        />
                    )}


          <Button
          variant="contained"
          color="primary"
          className={classes.ViewButton}
          startIcon={<DeleteIcon style={{ marginLeft: 6 }} />}
          onClick={() => {
            OpenDeleteDialogHandler();
          }}
          >
           Delete
          </Button>

          {OpenDeleteDialog && (
                        <DeleteProblem
                        OpenDeleteDialog={OpenDeleteDialog}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                            problemid={props.id}
                            getData={getData}
                        />
                    )}
</Card>



);
}

export default ProblemListItems;