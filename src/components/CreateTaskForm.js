import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {priorities} from "../utils/priority";
import {statuses} from "../utils/priority";
import {connect} from "react-redux";
import axios from 'axios';
import {getList} from "../redux/createAction";


function CreateTaskForm(props) {
    const {isCreateTaskMode, setCreateTaskMode} = props;
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState(priorities[0]);
    const [columnStatus, setColumnStatus] = useState(statuses[0]);
    const onCancel = () => {
        setTaskTitle('');
        setTaskDescription('');
        setCreateTaskMode(false);

    }

    const addNewTask = async () => {
        await axios({
            url: 'http://localhost:5000/todo/create',
            method: 'POST',
            data: {
                column:(statuses.indexOf(columnStatus)+1),
                name: taskTitle,
                description: taskDescription,
                priority: taskPriority,
                shrink: false,
                done: false
            },
        })
            .then(res => {
                props.getFullList()
            })
            .catch(error => {
                console.log(error)
            })
        setTaskTitle('');
        setTaskDescription('');
        setCreateTaskMode(false);
    }
    return (
        <Modal show={isCreateTaskMode} onHide={onCancel} centered>
            <div className="p-3">
                <h4>Create Task</h4>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input className="form-control" id="title" value={taskTitle}
                           placeholder="Enter Task Title..." onChange={(e) => setTaskTitle(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control min-h-100" id="description" defaultValue={taskDescription}
                              placeholder="Enter Task Description..."
                              onChange={(e) => setTaskDescription(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select id="priority" className="form-control" defaultValue={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value)}
                    >
                        {
                            priorities.map((priority) => {
                                return <option key={priority} value={priority}>{priority}</option>;
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Status</label>
                    <select id="priority" className="form-control" defaultValue={columnStatus}
                            onChange={(e) => setColumnStatus(e.target.value)}>
                        {
                            statuses.map((status) => {
                                return <option key={status} value={status}>{status}</option>;
                            })
                        }
                    </select>
                </div>
                <button className="btn btn-secondary float-right ml-2" onClick={onCancel}>Cancel
                </button>
                <button className="btn btn-primary float-right" onClick={addNewTask}>Save</button>
            </div>
        </Modal>
    );
}

const mapStateToProps = (state) => ({
    store: state
});
const mapDispatchToProps = (dispatch) => ({
    getFullList: () => dispatch(getList()),

});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskForm);
