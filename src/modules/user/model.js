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
    const [staff] = await db(query.ADD_USER, branchId, staffName, password, birthDate, gender)
    return staff
}

async function findStaff({ staffName, password }) {
    const [user] = await db(query.FIND_STAFF, staffName, sha256(password))
    return user
}

async function getPermission({ userId }) {
    const [user] = await db(query.GET_PERMISSIONS, satffId)
    return user
}

export default {
    getPermission,
    findStaff,
    getStaffs,
    addUser,
    getStaff
}