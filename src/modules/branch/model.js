import query from './sql.js'
import db from '#pg'

async function getBranches({ page, limit, search, sortKey, sortValue }) {
    return await db(
        query.GET_BRANCHES,
        (page - 1) * limit,
        limit,
        search,
        sortKey,
        sortValue
    )
}

async function getBranch({ branchId }) {
    const [staff] = await db(query.GET_BRANCH, branchId)
    return staff
}





async function addBranch({ branchId, staffName, password, birthDate, gender }) {
    const [staff] = await db(query.ADD_USER, branchId, staffName, password, birthDate, gender)
    return staff
}

async function changeBranch({ staffName, password }) {
    const [user] = await db(query.FIND_STAFF, staffName, password)
    return user
}

async function deleteBranch({ userId }) {
    const [user] = await db(query.GET_PERMISSIONS, satffId)
    return user
}

export default {
    changeBranch,
    deleteBranch,
    getBranches,
    addBranch,
    getBranch
}