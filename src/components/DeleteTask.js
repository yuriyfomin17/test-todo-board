import React from 'react';
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import {getList} from "../redux/createAction";
import {connect} from "react-redux";


function DeleteTask(props) {
    const {isDeleteTaskMode, setDeleteTaskMode, element, columnIndex} = props
    const {name, _id} = element

    const onHide = () => {
        setDeleteTaskMode(false);
    }
    const deleteItem = () => {
        console.log(_id)
        let column = columnIndex + 1
        axios({
            url: "https://kanban-board-server-dnd.herokuapp.com/todo/delete",
            method: 'DELETE',
            data: {
                column: column,
                id: _id
            }

        })
            .then(res => {
                props.getFullList()
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    return (
        <Modal show={isDeleteTaskMode} onHide={onHide} centered>
            <div className="p-3">
                <h4>Delete Task</h4>
                <p>Are you sure you want to delete this task: '{name}'?</p>
                <button onClick={onHide} className="btn btn-secondary float-right ml-2">Cancel</button>
                <button onClick={deleteItem} className="btn btn-primary float-right">Delete</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(DeleteTask);