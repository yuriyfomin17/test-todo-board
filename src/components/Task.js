import React, {useEffect, useState} from 'react';
import {Draggable} from "react-beautiful-dnd";
import EditTaskForm from "./EditTaskForm";
import DeleteTask from "./DeleteTask";
import {v4 as uuidv4} from 'uuid';
import axios from "axios";
import {getList} from "../redux/createAction";
import {connect} from "react-redux";


function Task(props) {
    const {index} = props
    const {element} = props
    const {columnIndex} = props
    const {_id, name, description, priority, done, shrink} = element
    console.log(element)
    const [isEditTaskMode, setEditTaskMode] = useState(false);
    const [isDeleteTaskMode, setDeleteTaskMode] = useState(false);
    const [descriptionCopy, setDescriptionCopy] = useState(description)
    const setCSSPriorityColor = () => {
        let titleClassName = 'rounded-sm text-black font-weight-bold text-center m-0 p-1 ';
        switch (priority) {
            case 1:
                titleClassName += 'alert-danger'
                break
            case 2:
                titleClassName += 'alert-warning'
                break
            case 3:
                titleClassName += 'alert-success'
                break
            default:
                break
        }
        return titleClassName
    }
    const onEditTaskClick = () => {
        setEditTaskMode(true);
    }

    const onDeleteTaskClick = () => {
        setDeleteTaskMode(true);
    }

    const shortenText = () => {
        let column = columnIndex + 1
        axios({
            url: "http://localhost:5000/todo/update",
            method: 'PATCH',
            data: {
                id: _id,
                column: column,
                name: name,
                description: description,
                done: done,
                shrink: !shrink,
                priority: priority

            }
        })
            .then(res => {
                props.getFullList()
            })
            .catch(function (error) {
                console.log(error)
            })

    }

    useEffect(() => {
        if (!shrink) {
            setDescriptionCopy(description)
        } else {
            setDescriptionCopy(description.substring(0, description.length - Math.floor(0.7 * description.length)).trim() + "...")
        }


    }, [shrink, description]);

    return (
        <>
            <EditTaskForm isEditTaskMode={isEditTaskMode} setEditTaskMode={setEditTaskMode} element={element}
                          index={index} columnIndex={columnIndex} done={done} shrink={shrink}/>
            <DeleteTask isDeleteTaskMode={isDeleteTaskMode} setDeleteTaskMode={setDeleteTaskMode} element={element}
                        columnIndex={columnIndex}/>
            <Draggable key={uuidv4()} draggableId={_id} index={index}>
                {provided => {
                    return (
                        <div key={_id}
                             {...provided.draggableProps}
                             {...provided.dragHandleProps}
                             ref={provided.innerRef}
                             className="shadow rounded-sm task">
                            <div className={setCSSPriorityColor()}> {name}</div>
                            {done === false ? <div className="text-left p-2 font-weight-light">{descriptionCopy}</div> :
                                <div className="text-left p-2">
                                    <strike className=" font-weight-light ">{descriptionCopy}</strike>
                                </div>

                            }

                            <div className="text-secondary p-2 row">
                                <div className="col-7 text-left">Priority:{priority}</div>
                                <div className="col-5 text-right">
                                    {shrink ?
                                        <i className="fa fa-compress rounded-sm icon" onClick={shortenText}/>
                                        : <i className="fa fa-expand rounded-sm icon" onClick={shortenText}/>}
                                    <i className="fa fa-pencil rounded-sm icon" onClick={onEditTaskClick}/>
                                    <i className="fa fa-trash rounded-sm icon" onClick={onDeleteTaskClick}/>
                                </div>
                            </div>

                        </div>
                    )
                }
                }
            </Draggable>
        </>
    );
}

const mapStateToProps = (state) => ({
    store: state
});


const mapDispatchToProps = (dispatch) => ({
    getFullList: () => dispatch(getList()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Task);