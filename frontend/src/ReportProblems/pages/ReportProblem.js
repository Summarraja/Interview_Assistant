import React, { useState } from "react";
import Toolbar from '@material-ui/core/Toolbar';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, fade } from "@material-ui/core/styles";
import { Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateProblem from "../Components/CreateProblem";
import ProblemCollection from "../Components/ProblemCollection";



const useStyles = makeStyles((theme) => ({

    root: {
        paddingLeft: 120,
        [theme.breakpoints.down("xs")]: {
            paddingLeft: 0,
        },
    },

    button: {
        float: "right",
        marginBottom: 10,
      },

    paper: {
        //   backgroundColor: "#4E78A0",
        [theme.breakpoints.up("xs")]: {
            margin: theme.spacing(3, 7),
            //  padding: theme.spacing(3),
            width: "auto",
        },
        [theme.breakpoints.up("md")]: {
            margin: theme.spacing(3, 20),
            width: "auto",
        },
    },
    collapse: {
        width: "100%",
    },
}));

export default function ReportProblem() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
      setOpen(true);
    };
    const handleCloseDialog = () => {
      setOpen(false);
    };

    return (
        <>
            <Toolbar />
            <div className={classes.root}>
                <div style={{ marginBottom: "80px", marginRight: "150px" }}>
                    <Typography
                        variant="h4"
                        align="center"
                        style={{ margin: "20px", color: "#004777" }}
                    >
                        Reported Problems
                    </Typography>


                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleOpenDialog();
                        }}
                        className={classes.button}
                        startIcon={<AddIcon />}
                    >
                        Report Problem
            </Button>
            
            {open && (
                        <CreateProblem
                            open={open}
                            handleCloseDialog={handleCloseDialog}
                            setOpen={setOpen}
                        />
                    )}


                </div>
                <div>
                    <Paper elevation={10} className={classes.paper}>
                        <div className={classes.collapse}>
                          <ProblemCollection/>
                        </div>
                    </Paper>
                </div>
            </div>
        </>
    );

}