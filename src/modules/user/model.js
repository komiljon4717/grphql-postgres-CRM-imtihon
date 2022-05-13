import query from './sql.js'
import db from '#pg'
import sha256 from 'sha256'

async function getStaffs({ page, limit, search, sortKey, sortValue }) {
    return await db(
        query.GET_STAFFS,
        (page - 1) * limit,
        limit,
        search,
        sortKey,
        sortValue
    )
}

async function getStaff({ staffId }) {
    const [staff] = await db(query.GET_STAFF, staffId)
    return staff
}

async function addUser({ branchId, staffName, password, birthDate, gender }) {
    const [staff] = await db(query.ADD_STAFF, branchId, staffName, password, birthDate, gender)
    return staff
}

async function findStaff({ staffName, password }) {
    const [user] = await db(query.FIND_STAFF, staffName, sha256(password))
    return user
}


async function getPermission({ staffId }) {
    const [per] = await db(query.GET_PERMISSIONS, staffId)
    return per
}

async function updatePermission({ staffId, create="", read="", update="", deleted="" }) {
    const [per] = await db(query.UPDATE_PERMISSIONS, staffId, create, read, update, deleted)
    return per
}



async function addPermission({ staffId, create="false", read="false", update="false", deleted="false" }) {
    const [per] = await db(query.ADD_PERMISSIONS, staffId, create, read, update, deleted)
    return per
}


async function addPermissionTransport({ staffId, create="false", read="false", update="false", deleted="false" }) {
    const [per] = await db(query.ADD_PERMISSIONS_TRANSPORT, staffId, create, read, update, deleted)
    return per
}


async function addPermissionBranch({ staffId, create="false", read="false", update="false", deleted="false" }) {
    const [per] = await db(query.ADD_PERMISSIONS_BRANCH, staffId, create, read, update, deleted)
    return per
}



export default {
    addPermissionTransport,
    addPermissionBranch,
    updatePermission,
    addPermission,
    getPermission,
    findStaff,
    getStaffs,
    addUser,
    getStaff
}