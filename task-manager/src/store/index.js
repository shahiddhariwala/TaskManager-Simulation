
//Initial State
const initialState = {
    server: 1,
    taskQueue: [],
    activeTaskQueue: []
};

//Schema
const eachTask = {
    timeRemaining: 0,
    isServerAssigned: false,
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_SERVER":
            return {
                ...state,
                server: state.server + 1,
            };
        case "REMOVE_SERVER":
            return {
                ...state,
                server: state.server - 1,
            };
        case "ADD_TASK":
            let taskQueue = state.taskQueue;
            for (let x = 0; x < action.count; x++) {
                taskQueue.push({ ...eachTask })
            }
            return {
                ...state,
                taskQueue: [...taskQueue],
            };
        case "REMOVE_TASK":
            let removeInactiveQueue = state.taskQueue;
            removeInactiveQueue.splice(0, action.count > state.taskQueue.length ? state.taskQueue.length : action.count);
            console.log("I am here in remove unwanted task");
            return {
                ...state,
                taskQueue: [...removeInactiveQueue],
            };
        case "REMOVE_SINGLE_TASK":
            let removeSingleTaskInactiveQueue = state.taskQueue;
            if (removeSingleTaskInactiveQueue[action.index]) {
                removeSingleTaskInactiveQueue.splice(action.index, 1);
                return {
                    ...state,
                    taskQueue: [...removeSingleTaskInactiveQueue],
                };
            }
            return {
                ...state,
            };
        case "ADD_ACTIVETASK":
            let addQueue = state.activeTaskQueue;
            for (let x = 0; x < action.count; x++) {
                addQueue.push({ ...eachTask, isServerAssigned: true })
            }
            return {
                ...state,
                activeTaskQueue: [...addQueue],
            };
        case "REMOVE_ACTIVETASK":
            let removeQueue = state.activeTaskQueue;
            if (removeQueue[action.index]) {
                removeQueue.splice(action.index, 1);
                return {
                    ...state,
                    activeTaskQueue: [...removeQueue],
                };
            }
            return {
                ...state,
            };
        case "UPDATE_ACTIVETASK":
            let activeTaskUpdateQueue = state.activeTaskQueue;
            if (activeTaskUpdateQueue[action.index]) {
                activeTaskUpdateQueue[action.index].timeRemaining += 1;
                if (activeTaskUpdateQueue[action.index].timeRemaining >= 20) {
                    activeTaskUpdateQueue.splice(action.index, 1);
                    return {
                        ...state,
                        activeTaskQueue: [...activeTaskUpdateQueue],
                    };
                }
                return {
                    ...state,
                    activeTaskQueue: [...activeTaskUpdateQueue],
                };
            }
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default reducer;