import React, {useState} from 'react';
import Board from "./Board"
import CreateTaskForm from "./CreateTaskForm";


function App() {
    const [isCreateTaskMode, setCreateTaskMode] = useState(false);

    const onClickCreateTask = () => {
        setCreateTaskMode(true);
    };

    return (
        <div className="text-center mt-5">
            <CreateTaskForm isCreateTaskMode={isCreateTaskMode} setCreateTaskMode={setCreateTaskMode}/>
            <Board/>
            <button className="btn btn-light m-3" onClick={onClickCreateTask}>Create Task</button>
        </div>
    );
}

export default App;
