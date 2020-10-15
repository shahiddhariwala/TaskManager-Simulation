import React, { useEffect, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import Styles from "./index.module.css";


const TaskBar = (props) => {
    //Varibles and Functions
    const removeHandler = props.removeHandler;
    const updateRemainingTime = props.updateRemainingTime;
    //State
    const [progressBarValue, setProgressBarValue] = useState(props.value);
    const [isAssigned, setIsAssigned] = useState(props.isAssigned);


    //Lifecycle
    useEffect(()=>
    {
        setProgressBarValue(progressBarValue=> props.value);
    },[props.value]);
    
    useEffect(() => {
        if (progressBarValue < 20 && isAssigned === true) {
            setTimeout(() => updateRemainingTime(props.taskIndex), 1000);
        }
    }, [isAssigned, progressBarValue]);

    useEffect(() => {
        if (isAssigned === true && progressBarValue === 20) {
            removeHandler(props.taskIndex);
        }
    }, [progressBarValue]);


    console.log(props.taskIndex, "====>", props);
    return (
        <Box display="flex" alignItems="center" className={Styles.outerContainer}>
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate"
                    value={Math.round(progressBarValue / 20 * 100)}
                    className={Styles.progressBar} color="primary" />
            </Box>
            <Box minWidth={35}>
                {isAssigned ? <Typography variant="body2" color="textSecondary">{`${Math.round(
                    progressBarValue,
                )}`} Second</Typography> : <Typography variant="body2" color="textSecondary">waiting...</Typography>}
            </Box>
            <Box minWidth={35}>
                {isAssigned ? null :
                    <DeleteForeverOutlinedIcon className={Styles.deleteBin} onClick={() => props.removeHandler(props.taskIndex)} />}
            </Box>
        </Box>
    );
}

export default TaskBar;