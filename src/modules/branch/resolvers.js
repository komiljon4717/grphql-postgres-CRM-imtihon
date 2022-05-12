import { UserInputError } from 'apollo-server-express'
import { NotFoundError } from '#helpers/errors'
import { jwt } from '#helpers/jwt'
import { USER_CONFIG } from '#config/index'
import model from './model.js'

export default {
    Mutation: {


        addBranch: async (_, args, { agent }) => {
            if (!args.branchName.trim() || !args.address.trim()) {
                throw new UserInputError("The username and password are required!")
            }

            const branch = await model.addBranch(args)


            return {
                status: 200,
                message: "The branch added!",
                data: branch,
                token: null
            }
        },



        changeBranch: async (_, args) => {
            if (
                (args.branchName && !args.branchName.trim()) ||
                (args.address && !args.address.trim())
            ) {
                throw new UserInputError("The username or contact cannot be empty!")
            }

            const branch = await model.changeBranch(args)
            
            return {
                status: 200,
                message: "The branch changed!",
                data: branch
            }
        },

        deleteBranch: async (_, args) => {
            const branch = await model.deleteBranch(args)

            if (!branch) {
                throw new NotFoundError("The branch not found!") 
            }
            
            return {
                status: 200,
                message: "The branch deleted!",
                data: branch
            }
        },


    },

    Query: {
        branches: async (_, { pagination, search, sort }, { agent, token }) => {
            const sortKey = Object.keys(sort || {})[0]


            return await model.getBranches({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        },

        branch: async (_, args) => {
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