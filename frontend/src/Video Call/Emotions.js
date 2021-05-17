import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        height: 15
    },
    emotions: {
        maxWidth: '15rem',
        maxHeight: '15rem',
        height: '15rem',
        width: '10rem',
        position: 'absolute',
        bottom: '50%',
        right: 30,
        zIndex: 3,
        color: 'white',
    },
}));
const Emotions = () => {
    const [progress, setProgress] = useState(0);
    const [buffer, setBuffer] = useState(10);

    const classes = useStyles();

    useEffect(() => {
        const timer = setInterval(() => {
            if (progress > 100) {
                setProgress(0);
                setBuffer(10);
            } else {
                const emotion = Math.random() * 100;
                const diff2 = Math.random() * 10;
                setBuffer(emotion +diff2);

                setProgress(emotion);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (

        <div className={classes.emotions}>
            <div >
                Happy <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={progress}  valueBuffer={buffer} />
            </div >
            <div >
                Sad <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={progress}  valueBuffer={buffer} />
            </div >
            <div >
                Neutral <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={progress} valueBuffer={buffer} />
            </div >
            <div >
                Disgust <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={progress}  valueBuffer={buffer} />
            </div >
            <div >
                Surprise <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={progress} valueBuffer={buffer} />
            </div >
            <div >
                Fear <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={progress} valueBuffer={buffer} />
            </div >
            <div >
                Angry <LinearProgress classes={{ root: classes.root, }} variant="buffer" value={progress} valueBuffer={buffer} />
            </div >
        </div>

    );
};

export default Emotions;