import query from './sql.js'
import db from '#pg'

async function getTransports({ page, limit, search, sortKey, sortValue }) {
    return await db(
        query.GET_TRANSPORTS,
        (page - 1) * limit,
        limit,
        search,
        sortKey,
        sortValue
    )
}

async function getTransport({ autoId }) {
    const [staff] = await db(query.GET_TRANSPORT, autoId)
    return staff
}


async function addtransport({ autoModel, autoBranch, autoColor, autoImg }) {
    const [branch] = await db(query.ADD_TRANSPORT, autoModel, autoBranch, autoColor, autoImg)
    return branch
}


async function getPermissionTransport({ staffId }){
    const [ branch ] = await db(query.GET_PERMISSIONS_TRANSPORT, staffId)
    return branch
}


async function updatePermissionTransport({ staffId, create, read, update, deleted }) {
    const [per] = await db(query.UPDATE_PERMISSIONS_TRANSPORT, staffId, create, read, update, deleted)
    return per
}





async function changeTransport({ autoId, autoModel, autoColor }) {
    const [transport] = await db(query.CHANGE_TRANSPORT, autoId, autoModel, autoColor)
    return transport
}

async function deleteTransport({ autoId }) {
    const [transport] = await db(query.DELETE_TRANSPORT, autoId)
    return transport
}



async function getPermission({ staffId }) {
    const [per] = await db(query.GET_PERMISSIONS, staffId)
    return per
}

async function getStaff({ staffId }) {
    const [staff] = await db(query.GET_STAFF, staffId)
    return staff
}





export default {
    updatePermissionTransport,
    getPermissionTransport,
    getPermission,
    changeTransport,
    deleteTransport,
    getTransports,
    addtransport,
    getTransport,
    getStaff
}