import React from "react";
import Toolbar from '@material-ui/core/Toolbar';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles} from "@material-ui/core/styles";
import ProblemCollectionAdmin from "../Components/ProblemCollectionAdmin";


const useStyles = makeStyles((theme) => ({

    root: {
        paddingLeft: 250,
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

export default function ReportProblemAdmin() {
    const classes = useStyles();

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

                </div>
                <div>
                    <Paper elevation={10} className={classes.paper}>
                        <div className={classes.collapse}>
                          <ProblemCollectionAdmin/>
                        </div>
                    </Paper>
                </div>
            </div>
        </>
    );

}