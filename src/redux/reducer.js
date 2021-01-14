import axios from "axios";


const initialState = {
    0: [],
    1: [],
    2: [],
    3: [],

};
const sameColumn = (id, columnNumber, destinationIndex) => {
    axios({
        url: "http://localhost:5000/order/sameColumn",
        method: 'PATCH',
        data: {
            id: id,
            column: columnNumber,
            destination: destinationIndex

        },
    })
        .catch(function (error) {
            console.log(error)
        })

}
const differentColumn = (id, destinationIndex, columnDestination, columnSource) => {
    axios({
        url: "http://localhost:5000/order/differentColumn",
        method: 'PATCH',
        data: {
            id: id,
            destination: destinationIndex,
            columnDestination: columnDestination,
            columnSource: columnSource
        },
    })
        .catch(function (error) {
            console.log(error)
        })

}
const todo = (state = initialState, action) => {
    switch (action.type) {
        case 'DRAG_END_SAME_COLUMN':
            console.log("Index to remove", action.payload.indexToRemove)
            console.log("Index to insert", action.payload.indexToInsert)
            const [removed] = state[action.payload.column].splice(action.payload.indexToRemove, 1)
            state[action.payload.column].splice(action.payload.indexToInsert, 0, removed)
            let columnNumber = Number(action.payload.column) + 1



            // deleteItem(removed.id, columnNumber).then(r => console.log('Success'))
            // insertItem(removed, columnNumber, action.payload.indexToInsert).then(r => console.log('Success'))
            sameColumn(removed._id, columnNumber, action.payload.indexToInsert)

            return {
                ...state,
                0: [...state["0"]],
                1: [...state["1"]],
                2: [...state["2"]],
                3: [...state["3"]],
            }
        case 'DRAG_END_DIFFERENT_COLUMN':

            const [removedSource] = state[action.payload.sourceColumn].splice(action.payload.sourceIndex, 1)
            state[action.payload.destColumn].splice(action.payload.destIndex, 0, removedSource)
            console.log("removedSource", removedSource)


            differentColumn(removedSource._id, action.payload.destIndex, Number(action.payload.destColumn) + 1, Number(action.payload.sourceColumn) + 1)
            return {
                ...state,
                0: [...state["0"]],
                1: [...state["1"]],
                2: [...state["2"]],
                3: [...state["3"]],
            }
        case 'GET_LIST_FROM_SERVER':
            let tasks = action.payload[0]
            let order = action.payload[1]
            console.log("ORDER", order)
            for (let column = 0; column < 4; ++column) {
                let currColumn = order[column].order
                let currResult = []
                currColumn.map(function (element) {
                    let currElem = tasks.find(el => el._id === element._id)
                    currResult.push(currElem)
                    return null
                })
                state[column] = currResult

            }
            console.log("STATE", state)
            return {
                ...state,
                0: [...state["0"]],
                1: [...state["1"]],
                2: [...state["2"]],
                3: [...state["3"]],
            }


        default:
            return state


    }

}

export default todo