import query from './sql.js'
import db from '#pg'

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
    const [user] = await db(query.FIND_STAFF, staffName, password)
    return user
}

async function deleteUser({ userId }) {
    const [user] = await db(query.DELETE_USER, userId)
    return user
}

export default {
    deleteUser,
    findStaff,
    getStaffs,
    addUser,
    getStaff
}