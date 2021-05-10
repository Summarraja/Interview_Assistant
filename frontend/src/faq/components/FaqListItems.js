import React, {useState} from 'react';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({

    
      accor: {
        padding: "20px 40px",
      },
      heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: theme.typography.fontWeightBold,
        color: "#004777",
      },

    }));
const FaqListItems = (props) =>{
    const classes = useStyles();
return (

    <Accordion className={classes.accor} >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading} align = "justify">
       {props.question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>   
        <Typography  align = "justify">
       {props.answer}
          
        </Typography>
      </AccordionDetails>
    </Accordion>


);
}

export default FaqListItems;