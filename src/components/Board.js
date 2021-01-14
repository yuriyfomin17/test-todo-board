import React, {useEffect} from 'react';
import {DragDropContext} from "react-beautiful-dnd";
import {Droppable} from "react-beautiful-dnd";
import {v4 as uuidv4} from 'uuid';
import Column from "./Column";
import {statuses} from "../utils/priority"
import {connect} from "react-redux";
import {getList} from "../redux/createAction";


function Board(props) {
    const {getFullList} = props
    const onDragEnd = (result) => {
        const {source, destination} = result;
        if (!destination) {
            return;
        }
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        if (destination.droppableId === source.droppableId) {
            console.log("Index to remove", source.index)
            console.log("Index to insert", destination.index)
            props.dragSameColumn(destination.droppableId, source.index, destination.index)

        } else {
            console.log("destination.droppableId", destination.droppableId)
            console.log("source.droppableId", source.droppableId)
            props.dragDiffColumn(source.droppableId, destination.droppableId, destination.index, source.index)

        }
    }
    const onDraggingOver = (isDraggingOver) => ({
        backgroundColor: isDraggingOver ? '#bee1ff' : '#fff'
    });
    useEffect(() => {
        getFullList()

    }, [getFullList]);


    return (
        <div className="board">
            <DragDropContext onDragEnd={onDragEnd}>
                {

                    statuses.map((status, index) =>
                        (
                            <Droppable key={uuidv4()} droppableId={String(index)}>
                                {(provided, snapshot) => {
                                    return (
                                        <div
                                            className="status-col"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={onDraggingOver(snapshot.isDraggingOver)}>
                                            <Column key={uuidv4()}
                                                    status={status}
                                                    columnIndex={index}

                                            />
                                            {provided.placeholder}
                                        </div>
                                    )
                                }
                                }
                            </Droppable>
                        )
                    )
                }
            </DragDropContext>
        </div>
    );
}

const mapStateToProps = (state) => ({
    store: state
});


const mapDispatchToProps = (dispatch) => ({
    getFullList: () => dispatch(getList()),
    dragSameColumn: (column, indexToRemove, indexToInsert) => dispatch({
        type: 'DRAG_END_SAME_COLUMN',
        payload: {column: column, indexToRemove: indexToRemove, indexToInsert: indexToInsert}
    }),
    dragDiffColumn: (sourceColumn, destColumn, destIndex, sourceIndex) => dispatch({
        type: 'DRAG_END_DIFFERENT_COLUMN',
        payload: {sourceColumn: sourceColumn, destColumn: destColumn, destIndex: destIndex, sourceIndex: sourceIndex}
    })

});
export default connect(mapStateToProps, mapDispatchToProps)(Board);
