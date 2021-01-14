import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import { urgentStatuses} from "../utils/priority";
import {doneStatus} from "../utils/priority";
import axios from 'axios';
import {connect} from "react-redux";
import {getList} from "../redux/createAction";

function EditTaskForm(props) {
    const {isEditTaskMode, setEditTaskMode, element, index, columnIndex, shrink} = props;
    const {_id, name, description, urgent} = element;
    const [taskTitle, setTaskTitle] = useState(name);
    const [taskDescription, setTaskDescription] = useState(description);
    const [taskDoneStatus, setDoneStatus] = useState(doneStatus[1]);
    const [urgentStatus, setUrgentStatus] = useState(urgent);

    const onTitleChange = (e) => {
        setTaskTitle(e.target.value);
    }

    const onDescriptionChange = (e) => {
        setTaskDescription(e.target.value);
    }

    const onUrgentChange = (e) => {
        setUrgentStatus(e.target.value);

    }
    const onStatusChange = (e) => {
        setDoneStatus(e.target.value);
    }


    const isSaveDisabled = taskTitle.trim() === '' || taskDescription.trim() === '';

    const onHide = () => {
        setTaskTitle(name);
        setTaskDescription(description);
        setEditTaskMode(false);
    }
    const onSave = () => {
        let column = columnIndex + 1
        axios({
            url: "https://test-server-yuriy.herokuapp.com/todo/update",
            method: 'PATCH',
            data: {
                id: _id,
                index: index,
                column: column,
                name: taskTitle,
                description: taskDescription,
                urgent:urgentStatus,
                done: taskDoneStatus==='Done',
                shrink: shrink,

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
                    <label htmlFor="urgent">Urgent</label>
                    <select id="urgent" className="form-control" value={urgentStatus} onChange={onUrgentChange}>
                        {
                            urgentStatuses.map((urgStat) => {
                                return <option key={urgStat} value={urgStat}>{urgStat}</option>;
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