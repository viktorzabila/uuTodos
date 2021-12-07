/* eslint-disable */
const itemCreateDtoInType = shape({
    listId: id().isRequired(),
    text: string(1,1000).isRequired(),
    highPriority: boolean()
})

const itemGetDtoInType = shape({
    id: id().isRequired()
})

const itemUpdateDtoInType = shape({
    id: id().isRequired(),
    listId: id(),
    text: string(1,1000),
    highPriority: boolean()
})