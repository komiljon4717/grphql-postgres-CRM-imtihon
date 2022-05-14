import { UserInputError } from 'apollo-server-express'
import { NotFoundError } from '#helpers/errors'
import { jwt } from '#helpers/jwt'
import { BRANCH_CONFIG } from '#config/index'
import model from './model.js'

export default {
    Mutation: {


        addBranch: async (_, args, { token }) => {
            if (!args.branchName.trim() || !args.address.trim()) {
                throw new UserInputError("The username and password are required!")
            }

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!(permission?.created == "true")) {
                throw new Error("Not allowed!")
            }

            const branch = await model.addBranch(args)

            return {
                status: 200,
                message: "The branch added!",
                data: branch,
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
            
            if (!(permission?.update == "true")) {
                throw new Error("Not allowed!")
            }

            const branch = await model.changeBranch(args)

            if (!branch) {
                throw new Error("Branch not found!")
            }
            
            return {
                status: 200,
                message: "The branch changed!",
                data: branch
            }
        },

        deleteBranch: async (_, args, { token }) => {

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!(permission?.delete == "true")) {
                throw new Error("Not allowed!")
            }


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

        updatePermissionBranch: async (_, args, { token }) => {

           if (args.create?.trim() && !(args.create == "false" || args.create == "true")) {
                throw new Error("Create values must be 'true' or 'false'")
           }


           if (args.update?.trim() && !(args.update == "false" || args.update == "true")) {
                throw new Error("Update values must be 'true' or 'false'")
            }

            if (args.read?.trim() && !(args.read == "false" || args.read == "true")) {
                throw new Error("Read values must be 'true' or 'false'")
            }

            if (args.deleted?.trim() && !(args.deleted == "false" || args.deleted == "true")) {
                throw new Error("Deleted values must be 'true' or 'false'")
            }

            const staff = jwt.verify(token)
            const permission = await model.getPermission(staff)

            if (!(permission?.created == "true")) {
                throw new Error("Not allowed!")
            }

            const res = await model.updatePermissionBranch(args)

            if (!res) {
                return {
                    status: 400,
                    message: "The staff not found!",
                    data: null,
                }
            }

            return {
                status: 200,
                message: "The branch permission updated!",
                data: null,
            }
        }
    },

    Query: {
        branches: async (_, { pagination, search, sort }, { token }) => {
            const sortKey = Object.keys(sort || {})[0]

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!(permission?.read == "true")) {
                throw new Error("Not allowed!")
            }


            return await model.getBranches({
                page: pagination?.page || BRANCH_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || BRANCH_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        },

        branch: async (_, args, { token }) => {

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!(permission?.read == "true")) {
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