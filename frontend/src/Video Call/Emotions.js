import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        height: 15
    },
}));
const Emotions = (props) => {
    const [buffer, setBuffer] = useState([10,10,10,10,10,10,10]);

    const classes = useStyles();

    useEffect(() => {
        const getBuffer=()=>{
            return Math.random() * 20;
        }
        setBuffer([getBuffer(),getBuffer(),getBuffer(),getBuffer(),getBuffer(),getBuffer(),getBuffer()]);

    }, [props.progress]);

    return (

        <>
            <div >
                Angry <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={props.progress[0]} valueBuffer={buffer[0]} />
            </div >
            <div >
                Disgusted <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={props.progress[1]} valueBuffer={buffer[1]} />
            </div >
            <div >
                Fearful <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={props.progress[2]} valueBuffer={buffer[2]} />
            </div >
            <div >
                Happy <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={props.progress[3]} valueBuffer={buffer[3]} />
            </div >
            <div >
                Neutral <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={props.progress[4]} valueBuffer={buffer[4]} />
            </div >
            <div >
                Sad <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={props.progress[5]} valueBuffer={buffer[5]} />
            </div >
            <div >
                Surprised <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={props.progress[6]} valueBuffer={buffer[6]} />
            </div >

        </>

    );
};

export default Emotions;