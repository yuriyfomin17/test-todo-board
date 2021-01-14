import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {priorities} from "../utils/priority";
import {doneStatus} from "../utils/priority";
import axios from 'axios';
import {connect} from "react-redux";
import {getList} from "../redux/createAction";

function EditTaskForm(props) {
    const {isEditTaskMode, setEditTaskMode, element, index, columnIndex, shrink} = props;
    const {_id, name, description, priority} = element;
    const [taskTitle, setTaskTitle] = useState(name);
    const [taskDescription, setTaskDescription] = useState(description);
    const [taskPriority, setTaskPriority] = useState(priority);
    const [taskDoneStatus, setDoneStatus] = useState(doneStatus[1]);
    const onTitleChange = (e) => {
        setTaskTitle(e.target.value);
    }

    const onDescriptionChange = (e) => {
        setTaskDescription(e.target.value);
    }

    const onPriorityChange = (e) => {
        setTaskPriority(e.target.value);
    }
    const onStatusChange = (e) => {
        setDoneStatus(e.target.value);
    }


    const isSaveDisabled = taskTitle.trim() === '' || taskDescription.trim() === '';

    const onHide = () => {
        setTaskTitle(name);
        setTaskDescription(description);
        setTaskPriority(priority);
        setEditTaskMode(false);
    }
    const onSave = () => {
        let column = columnIndex + 1
        axios({
            url: "https://kanban-board-server-dnd.herokuapp.com/todo/update",
            method: 'PATCH',
            data: {
                id: _id,
                index: index,
                column: column,
                name: taskTitle,
                description: taskDescription,
                done: taskDoneStatus==='Done',
                shrink: shrink,
                priority: taskPriority

            }
        })
            .then(res => {
                props.getFullList()
            })
            .catch(function (error) {
                console.log(error)
            })
        setTaskTitle(taskTitle);
        setTaskDescription(taskDescription);
        setTaskPriority(taskPriority);
        setDoneStatus(taskDoneStatus)
        setEditTaskMode(false);

    }
    return (
        <Modal show={isEditTaskMode} onHide={onHide} centered>
            <div className="p-3">
                <h4>Edit Task</h4>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input className="form-control" id="title" value={taskTitle} onChange={onTitleChange}
                           placeholder="Enter Task Title..."/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control min-h-100" id="description" defaultValue={taskDescription}
                              onChange={onDescriptionChange} placeholder="Enter Task Description..."/>
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select id="priority" className="form-control" value={taskPriority} onChange={onPriorityChange}>
                        {
                            priorities.map((priority) => {
                                return <option key={priority} value={priority}>{priority}</option>;
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Status</label>
                    <select id="priority" className="form-control" value={taskDoneStatus} onChange={onStatusChange}>
                        {
                            doneStatus.map((done) => {
                                return <option key={done} value={done}>{done}</option>;
                            })
                        }
                    </select>
                </div>
                <button onClick={onHide} className="btn btn-secondary float-right ml-2">Cancel</button>
                <button onClick={onSave} className="btn btn-primary float-right" disabled={isSaveDisabled}>Save
                </button>
            </div>
        </Modal>


    );
}

const mapStateToProps = (state) => ({
    store: state
});
const mapDispatchToProps = (dispatch) => ({
    getFullList: () => dispatch(getList())

});
export default connect(mapStateToProps, mapDispatchToProps)(EditTaskForm);