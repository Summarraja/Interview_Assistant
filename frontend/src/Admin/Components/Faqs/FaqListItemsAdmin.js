import React, { useEffect, useState, useContext} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Card, Grid } from '@material-ui/core';
import { TiEdit } from "react-icons/ti";
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateFaq from './UpdateFaq';
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import DeleteFaqs from './DeleteFaqs';
import { RiDeleteBin6Line } from "react-icons/ri";



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
const FaqListItemsAdmin = (props) =>{
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
          'http://localhost:5000/api/faqs/'
        );
        props.setFaqs(responseData.faqs);
      } catch (err) {
        console.log(err)
      }
    }


  


    useEffect(() => {
      const fetchFaq = async () => {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/faqs/${props.id}`,
            "GET",
            null,
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            }
          );
          setLoadedFaqs(responseData.faq);
        } catch (err) {}
      } ;
      fetchFaq()
    }, [open, loadedFaqs]);

return (

  <Card className={classes.card}>
  <Grid container >
    <Grid item sm={11} lg={11} style={{ flexGrow: 1 }}>
      <div className={classes.header}>
        <Typography variant="h5" align="justify">
        {props.question}
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
            startIcon={<TiEdit style={{ marginLeft: 6 }} />}
            onClick={() => {
              handleOpenDialog();
          }}
          >
            Edit
          </Button>
          {open && (
                        <UpdateFaq
                            open={open}
                            handleCloseDialog={handleCloseDialog}
                            setOpen={setOpen}
                            loadedFaqs={loadedFaqs}
                            faqid={props.id}
                            getData={getData}
                        />
                    )}


          <Button
          variant="contained"
          color="primary"
          className={classes.ViewButton}
          startIcon={<RiDeleteBin6Line style={{ marginLeft: 6 }} />}
          onClick={() => {
            OpenDeleteDialogHandler();
          }}
          >
           Delete
          </Button>

          {OpenDeleteDialog && (
                        <DeleteFaqs
                        OpenDeleteDialog={OpenDeleteDialog}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                            faqid={props.id}
                            getData={getData}
                        />
                    )}
</Card>



);
}

export default FaqListItemsAdmin;