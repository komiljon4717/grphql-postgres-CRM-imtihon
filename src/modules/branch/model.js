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


async function addBranch({ branchName, address }) {
    const [branch] = await db(query.ADD_BRANCH, branchName, address)
    return branch
}


async function getPermissionBranch({ staffId }){
    const [ branch ] = await db(query.GET_PERMISSIONS_BRANCH, staffId)
    return branch
}






async function changeBranch({ branchId, branchName, address }) {
    const [branch] = await db(query.CHANGE_BRANCH, branchId, branchName, address)
    return branch
}

async function deleteBranch({ branchId }) {
    const [branch] = await db(query.DELETE_BRENCH, branchId)
    return branch
}

export default {
    getPermissionBranch,
    changeBranch,
    deleteBranch,
    getBranches,
    addBranch,
    getBranch
}