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


async function addBranch({ branchName, address }) {
    const [branch] = await db(query.ADD_BRANCH, branchName, address)
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





async function changeBranch({ branchId, branchName, address }) {
    const [branch] = await db(query.CHANGE_BRANCH, branchId, branchName, address)
    return branch
}

async function deleteBranch({ branchId }) {
    const [branch] = await db(query.DELETE_BRENCH, branchId)
    return branch
}



async function getPermission({ staffId }) {
    const [per] = await db(query.GET_PERMISSIONS, staffId)
    return per
}

export default {
    updatePermissionTransport,
    getPermissionTransport,
    getPermission,
    changeBranch,
    deleteBranch,
    getTransports,
    addBranch,
    getTransport
}