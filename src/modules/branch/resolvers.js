import { UserInputError } from 'apollo-server-express'
import { NotFoundError } from '#helpers/errors'
import { jwt } from '#helpers/jwt'
import { USER_CONFIG } from '#config/index'
import model from './model.js'

export default {
    Mutation: {


        addBranch: async (_, args, { agent }) => {
            if (!args.staffName.trim() || !args.password.trim()) {
                throw new UserInputError("The username and password are required!")
            }

            const staff = await model.addBranch(args)
            console.log(staff);

            if (!staff) {
                return {
                    status: 400,
                    message: "The staff not exist!",
                    data: null,
                    token: null
                }
            }

            return {
                status: 200,
                message: "The staff Succsesfully logged in!",
                data: staff,
                token: jwt.sign({ userId: staff.staff_id,  agent})
            }
        },



        changeBranch: async (_, args) => {
            if (
                (args.username && !args.username.trim()) ||
                (args.contact && !args.contact.trim())
            ) {
                throw new UserInputError("The username or contact cannot be empty!")
            }

            const user = await model.changeUser(args)
            
            return {
                status: 200,
                message: "The user changed!",
                data: user
            }
        },

        deleteBranch: async (_, args) => {
            const user = await model.deleteUser(args)

            if (!user) {
                throw new NotFoundError("The user not found!") 
            }
            
            return {
                status: 200,
                message: "The user deleted!",
                data: user
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