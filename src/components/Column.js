import React from "react";
import Task from "./Task";
import {v4 as uuidv4} from 'uuid';
import {getList} from "../redux/createAction";
import {connect} from "react-redux";


function Column(props) {
    const {columnIndex} = props
    const totalLength = props.store[0].length + props.store[1].length + props.store[2].length + props.store[3].length
    const setCSSPriorityColor = () => {
        let titleClassName = 'font-weight-bold text-dark  text-secondary mb-2 ';
        switch (props.columnIndex) {
            case 0:
                titleClassName += 'bg-secondary'
                break
            case 1:
                titleClassName += 'bg-primary'
                break
            case 2:
                titleClassName += 'bg-warning'
                break
            case 3:
                titleClassName += 'bg-success'
                break
            default:
                break
        }
        return titleClassName
    }


    return (
        <>
            <h3 className="color-bold-black font-weight-bold"> {props.status}</h3>
            <p className={setCSSPriorityColor()}>({props.store[columnIndex].length} of {totalLength})</p>
            {props.store[columnIndex].map((element, index) =>
                (
                    <Task key={uuidv4()} element={element} index={index} columnIndex={columnIndex}/>
                )
            )}

        </>
    );
}

const mapStateToProps = (state) => ({
    store: state
});
const mapDispatchToProps = (dispatch) => ({
    getFullList: () => dispatch(getList()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Column);