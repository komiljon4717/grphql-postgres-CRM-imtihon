import { UserInputError } from 'apollo-server-express'
import { NotFoundError } from '#helpers/errors'
import { jwt } from '#helpers/jwt'
import { USER_CONFIG } from '#config/index'
import model from './model.js'

export default {
    Mutation: {


        addBranch: async (_, args, { token }) => {
            if (!args.branchName.trim() || !args.address.trim()) {
                throw new UserInputError("The username and password are required!")
            }

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!permission?.created) {
                throw new Error("Not allowed!")
            }

            const branch = await model.addBranch(args)


            return {
                status: 200,
                message: "The branch added!",
                data: branch,
                token: null
            }
        },



        changeBranch: async (_, args, { token }) => {
            if (
                (args.branchName && !args.branchName.trim()) ||
                (args.address && !args.address.trim())
            ) {
                throw new UserInputError("The branch name or address cannot be empty!")
            }

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!permission?.update) {
                throw new Error("Not allowed!")
            }


            const branch = await model.changeBranch(args)
            
            return {
                status: 200,
                message: "The branch changed!",
                data: branch
            }
        },

        deleteBranch: async (_, args, { token }) => {
            const branch = await model.deleteBranch(args)

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!permission?.delete) {
                throw new Error("Not allowed!")
            }


            if (!branch) {
                throw new NotFoundError("The branch not found!") 
            }

            
            
            return {
                status: 200,
                message: "The branch deleted!",
                data: branch
            }
        },

        updatePermissionBranch: async (_, args, { token }) => {
            const staff = jwt.verify(token)
            const permission = await model.getPermission(staff)
            if (!permission?.created) {
                throw new Error("Not allowed!")
            }


            const res = await model.updatePermissionBranch(args)

            if (!res) {
                return {
                    status: 400,
                    message: "The staff not found!",
                    data: null,
                    token: null
                }
            }

            return {
                status: 200,
                message: "The branch permission updated!",
                data: res,
                token: null
            }
        }
    },

    Query: {
        branches: async (_, { pagination, search, sort }, { token }) => {
            const sortKey = Object.keys(sort || {})[0]

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!permission?.read) {
                throw new Error("Not allowed!")
            }


            return await model.getBranches({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        },

        branch: async (_, args, { token }) => {

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!permission?.read) {
                throw new Error("Not allowed!")
            }




            return await model.getBranch(args)
        }
        
    },

    Branch: {
        branchId: global => global.branch_id,
        branchName: global => global.branch_name,
        branchAddress: global =>global.branch_address,
        time: global => global.branch_created_at?.toISOString().slice(0, 19)
    }
}