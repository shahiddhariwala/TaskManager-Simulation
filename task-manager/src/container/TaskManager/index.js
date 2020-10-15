import React, { useEffect, useRef, useState } from 'react';
import { Button, Grid } from "@material-ui/core";
import TaskBar from "../../components/TaskBar";
import Header from "../../components/Header";
import Styles from "./index.module.css";
import Snackbar from '@material-ui/core/Snackbar';
import _ from "lodash";

const TaskManager = () => {

    //Helper Variables
    const inputTaskRef = useRef();

    //State
    const [serverCount, setServerCount] = useState(1);
    const [toastData, setToastData] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        message: ""
    });

    const [numberofTaskInQueue, setNumberofTaskInQueue] = useState([]);
    const [activeQueue, setActiveQueue] = useState([]);


    //Schema
    const eachTask = {
        timeRemaining: 20,
        isServerAssigned: false,
    }

    //Lifecycle
    useEffect(() => {
        if (serverCount > activeQueue.length && numberofTaskInQueue.length > 0) {
            let tempActiveQueue = activeQueue;
            let tempTaskQueue = numberofTaskInQueue;
            let vacantServer = serverCount - activeQueue.length;
            while (vacantServer > 0) {
                tempTaskQueue.pop();
                let currentTask = _.cloneDeep(eachTask);
                currentTask.isServerAssigned = true;
                tempActiveQueue.push(currentTask);
                vacantServer--;
            }
            setActiveQueue(tempActiveQueue);
            setNumberofTaskInQueue(tempTaskQueue);
        }

    }, [activeQueue.length, serverCount, numberofTaskInQueue.length]);


    //Handlers
    const addServerHandler = () => {
        if (serverCount < 10) {
            setServerCount(serverCount => serverCount + 1);
        }
        else {
            openToastHandler("You can't add more than 10 servers!");
        }
    }

    const removeServerHandler = () => {
        if (serverCount > 1) {
            setServerCount(serverCount => serverCount - 1);
        }
        else {
            openToastHandler("Require 1 server to be running!");
        }

    }

    const AddTaskToQueueHandler = () => {
        const newTask = inputTaskRef.current.value;
        if (inputTaskRef.current.value < 1000) {
            let tempTask = _.cloneDeep(numberofTaskInQueue);
            for (let i = 0; i < newTask; i++) {
                tempTask.push({ ...eachTask });
            }
            inputTaskRef.current.value = 0;
            setNumberofTaskInQueue(tempTask);
        }
        else {
            let expectedTime = 20 * (newTask + numberofTaskInQueue.length);
            openToastHandler("You are adding tasks beyond capacity of system can handle! \n" + "Thats approx " + expectedTime + " seconds to complete")
        }

    }

    const removeTaskFromQueueHandler = (index) => {
        console.log(index);
        let tempTask = _.cloneDeep(numberofTaskInQueue);
        if (!tempTask[index].isServerAssigned) {
            tempTask.splice(index, 1);
            setNumberofTaskInQueue(tempTask);
        }

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
        let displayLimit = numberofTaskInQueue.length < 20 ? numberofTaskInQueue.length : 20;
        for (let x = 0; x < displayLimit; x++) {
            temp.push(
                <TaskBar value={20}
                    isAssigned={false}
                    taskIndex={x}
                    removeHandler={removeTaskFromQueueHandler}
                    key={"inactiveTask" + x} />
            )
        }

        if (numberofTaskInQueue.length > 20) {
            temp.push(<div>more....</div>)
        }
        return temp;
    }

    //Consoles
    console.log("Task Queue", numberofTaskInQueue);

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
                <div>Server Manager</div>
                <div className={Styles.serverManager}>
                    Number of Live Server: {serverCount}
                    <Button className={Styles.addServerButton} onClick={addServerHandler}>Add a Server</Button>
                    <Button className={Styles.removeServerButton} onClick={removeServerHandler}>Remove a Server</Button>
                </div>
            </Grid>
            <Grid item xs={12}>
                <div>Task Queue</div>
                <div className={Styles.serverManager}>
                    {/* Task Manager */}
                    Number of Task In Queue: {numberofTaskInQueue.length}
                    <input type="number" id="tasks" name="tasks" min="1" defaultValue="0" className={Styles.inputTaskRef} ref={inputTaskRef} />
                    <Button className={Styles.addServerButton} onClick={AddTaskToQueueHandler}>Add tasks</Button>

                    {/* Task Queue */}
                    {console.log("activeQueue", activeQueue)}
                    {activeQueue.length > 0 && activeQueue.map((eachTask, index) => {
                        return <TaskBar value={eachTask.timeRemaining}
                            isAssigned={eachTask.isServerAssigned}
                            taskIndex={index}
                            removeHandler={removeTaskFromQueueHandler}
                            key={"activeIndex" + Math.random()} />
                    })}
                    {/* Inactive Tasks */}
                    {getTaskInQueue()}
                </div>
            </Grid>
        </Grid>
    </>);
}

export default TaskManager;