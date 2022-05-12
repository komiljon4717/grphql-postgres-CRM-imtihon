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

async function getBranch({ staffId }) {
    const [staff] = await db(query.GET_STAFF, staffId)
    return staff
}





// async function addUser({ branchId, staffName, password, birthDate, gender }) {
//     const [staff] = await db(query.ADD_USER, branchId, staffName, password, birthDate, gender)
//     return staff
// }

// async function findStaff({ staffName, password }) {
//     const [user] = await db(query.FIND_STAFF, staffName, password)
//     return user
// }

// async function getPermission({ userId }) {
//     const [user] = await db(query.GET_PERMISSIONS, satffId)
//     return user
// }

export default {
    // getPermission,
    // findStaff,
    getBranches,
    // addUser,
    getBranch
}