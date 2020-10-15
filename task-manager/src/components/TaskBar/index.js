import React, { useEffect, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import Styles from "./index.module.css";
import { connect } from "react-redux";

const TaskBar = (props) => {
    //Varibles and Functions
    const removeHandler = props.removeHandler;

    //Lifecycle
    useEffect(() => {
        if (props.timeRemaining < 20 && props.isAssignedRed === true) {
            setTimeout(() => props.updateRemainingTime(props.taskIndex), 1000);
        }
    }, [props.isAssignedRed, props.timeRemaining]);

    useEffect(() => {
        if (props.isAssignedRed === true && props.timeRemaining >= 20) {
            removeHandler(props.taskIndex);
        }
    }, [props.timeRemaining]);

    console.log(props.taskIndex, "===Props==>", props);

    return (
        <Box display="flex" alignItems="center" className={Styles.outerContainer}>
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate"
                    value={Math.round(props.timeRemaining / 20 * 100)}
                    className={Styles.progressBar} color="primary" />
            </Box>
            <Box minWidth={35}>
                {props.isAssignedRed ? <Typography variant="body2" color="textSecondary">{`${Math.round(
                    20-props.timeRemaining
                )}`} Second</Typography> : <Typography variant="body2" color="textSecondary">waiting...</Typography>}
            </Box>
            <Box minWidth={35}>
                {props.isAssignedRed ? null :
                    <DeleteForeverOutlinedIcon className={Styles.deleteBin} onClick={() => props.removeHandler(props.taskIndex)} />}
            </Box>
        </Box>
    );
}


const mapStateToProps = (state, ownProps) => {
    return {
        activeTask: state.activeTaskQueue,
        timeRemaining: ownProps.isAssigned ? state.activeTaskQueue[ownProps.taskIndex].timeRemaining : 0,
        isAssignedRed: ownProps.isAssigned ? state.activeTaskQueue[ownProps.taskIndex].isServerAssigned : false,
    };
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         updateRemianingTime: (index) => dispatch({ type: "UPDATE_ACTIVETASK", index: index }),
//     };
// };

export default connect(mapStateToProps)(TaskBar);