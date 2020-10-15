import React, { useEffect, useRef, useState } from 'react';
import { Button, Grid } from "@material-ui/core";
import TaskBar from "../../components/TaskBar";
import Header from "../../components/Header";
import Styles from "./index.module.css";
import Snackbar from '@material-ui/core/Snackbar';
import _ from "lodash";
import { connect } from "react-redux";

const TaskManager = (props) => {

    //Helper Variables
    const inputTaskRef = useRef();

    //State
    const [toastData, setToastData] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        message: ""
    });

    //Schema
    const eachTask = {
        timeRemaining: 0,
        isServerAssigned: false,
    }

    // Lifecycle
    useEffect(() => {
        if (props.serverCount > props.activeQueue.length && props.inactiveQueue.length > 0) {
            let vacantServer = props.serverCount - props.activeQueue.length;
            props.addActiveTask(vacantServer);
            props.removeInactiveTask(vacantServer);
        }

    }, [props.activeQueue.length, props.serverCount, props.inactiveQueue.length]);


    //Handlers
    const addServerHandler = () => {
        if (props.serverCount < 10) {
            props.addServer();
        }
        else {
            openToastHandler("You can't add more than 10 servers!");
        }
    }

    const removeServerHandler = () => {
        if (props.serverCount > 1) {
            props.removeServer();
        }
        else {
            openToastHandler("Require at least 1 server to be running!");
        }

    }

    const AddTaskToQueueHandler = () => {
        const newTask = inputTaskRef.current.value;
        if (inputTaskRef.current.value < 1000) {
            props.addNewTask(newTask);
            inputTaskRef.current.value = 0;
        }
        else {
            let expectedTime = 20 * (newTask + props.inactiveQueue.length);
            openToastHandler("You are adding tasks beyond capacity of system can handle! \n" + "Thats approx " + expectedTime + " seconds to complete")
        }

    }

    const updateRemainingTime = (index) => {
        if (props.activeQueue[index] && props.activeQueue[index].isServerAssigned) {
            props.updateActiveTask(index);
        }
    }

    const removeTaskFromQueueHandler = (index) => {
        props.removeActiveTask(index);

    }

    const removeSingleTaskFromQueueHandler = (index) => {
        props.removeInactiveSingleTask(index);

    }
    const openToastHandler = (message) => {
        let tempToastData = { ...toastData };
        tempToastData.open = true;
        tempToastData.message = message;
        setToastData(tempToastData);
    }

    const closeToastHandler = () => {
        let tempToastData = { ...toastData };
        tempToastData.open = false;
        tempToastData.message = "";
        setToastData(tempToastData);
    }

    //View Handler
    const getTaskInQueue = () => {
        let temp = [];
        let displayLimit = props.inactiveQueue.length < 20 ? props.inactiveQueue.length : 20;
        for (let x = 0; x < displayLimit; x++) {
            temp.push(
                <TaskBar value={20}
                    isAssigned={false}
                    taskIndex={x}
                    removeHandler={removeSingleTaskFromQueueHandler}
                    key={"inactiveTask" + x} />
            )
        }

        if (props.inactiveQueue.length > 20) {
            temp.push(<div>more....</div>)
        }
        return temp;
    }

    //Consoles
    console.log("Task Queue", props.inactiveQueue);

    return (<>

        {/* Toast */}
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={toastData.open}
            onClose={closeToastHandler}
            message={toastData.message}
            key={"topright"}
            autoHideDuration={5000}
        />
        <Grid container>
            <Grid item xs={12} style={{ margin: "8px 0px" }}>
                <Header />
            </Grid>
            <Grid item xs={12}>
                {/* Server Manager */}
                <div><span className={Styles.subheading}>Server Controller</span></div>
                <div className={Styles.serverManager}>
                    Number of Live Server: <span className={Styles.taskQueueInfo}>  {props.serverCount} </span>
                    <Button className={Styles.addServerButton} onClick={addServerHandler}>Add a Server</Button>
                    <Button className={Styles.removeServerButton} onClick={removeServerHandler}>Remove a Server</Button>
                </div>
            </Grid>
            <Grid item xs={12}>
                <div><span className={Styles.subheading}>Task Controller</span></div>
                <div className={Styles.serverManager}>
                    {/* Task Manager */}
                    Active Task Queue:  <span className={Styles.taskQueueInfo}> {props.activeQueue.length} </span>
                    Waiting Task Queue: <span className={Styles.taskQueueInfo}> {props.inactiveQueue.length} </span>
                    <input type="number" id="tasks" name="tasks" min="1" defaultValue="0" className={Styles.inputTaskRef} ref={inputTaskRef} />
                    <Button className={Styles.addServerButton} onClick={AddTaskToQueueHandler}>Add tasks</Button>

                    {/* Task Queue */}
                    {console.log("activeQueue", props.activeQueue)}
                    {props.activeQueue.length > 0 && props.activeQueue.map((eachTask, index) => {
                        return <TaskBar value={eachTask.timeRemaining}
                            isAssigned={eachTask.isServerAssigned}
                            taskIndex={index}
                            removeHandler={removeTaskFromQueueHandler}
                            updateRemainingTime={updateRemainingTime}
                            key={"activeIndex" + Math.random()}
                        />
                    })}
                    {/* Inactive Tasks */}
                    {getTaskInQueue()}
                </div>
            </Grid>
        </Grid>
    </>);
}

const mapStateToProps = (state) => {
    return {
        activeQueue: state.activeTaskQueue,
        inactiveQueue: state.taskQueue,
        serverCount: state.server,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addServer: () => dispatch({ type: "ADD_SERVER" }),
        removeServer: () => dispatch({ type: "REMOVE_SERVER" }),
        addNewTask: (count) => dispatch({ type: "ADD_TASK", count: count }),
        removeInactiveTask: (count) => dispatch({ type: "REMOVE_TASK", count: count }),
        removeInactiveSingleTask: (index) => dispatch({ type: "REMOVE_SINGLE_TASK", index: index }),
        updateActiveTask: (index) => dispatch({ type: "UPDATE_ACTIVETASK", index: index }),
        addActiveTask: (count) => dispatch({ type: "ADD_ACTIVETASK", count: count }),
        removeActiveTask: (index) => dispatch({ type: "REMOVE_ACTIVETASK", index: index }),


    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskManager);