import { UserInputError } from 'apollo-server-express'
import { NotFoundError } from '#helpers/errors'
import { jwt } from '#helpers/jwt'
import { USER_CONFIG } from '#config/index'
import model from './model.js'
import sha256 from 'sha256'

export default {
    Mutation: {

        register: async (_, args, { agent }) => {

            if (!args.staffName.trim() || !args.password.trim()) {
                throw new UserInputError("The username and password are required!")
            }
            args.password = sha256(args.password)

            if (!args.birthDate.trim()) {
                throw new UserInputError("The branchId and birth date are required!")
            }

            if (!(args.birthDate.trim().match(/^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/))) {
                throw new UserInputError("Birth date format yyyy-mm-dd")
            }

            if (!args.gender.trim()) {
                throw new UserInputError("The gender mast be 'M' or 'F'!")
            }

            const staff = await model.addUser(args)

            return {
                status: 200,
                message: "The staff created!",
                data: staff,
                token: jwt.sign({ userId: staff.staff_id,  agent})
            }
        },


        login: async (_, args, { agent }) => {
            if (!args.staffName.trim() || !args.password.trim()) {
                throw new UserInputError("The username and password are required!")
            }

            const staff = await model.findStaff(args)

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







        // changeUser: async (_, args) => {
        //     if (
        //         (args.username && !args.username.trim()) ||
        //         (args.contact && !args.contact.trim())
        //     ) {
        //         throw new UserInputError("The username or contact cannot be empty!")
        //     }

        //     const user = await model.changeUser(args)
            
        //     return {
        //         status: 200,
        //         message: "The user changed!",
        //         data: user
        //     }
        // },

        // deleteUser: async (_, args) => {
        //     const user = await model.deleteUser(args)

        //     if (!user) {
        //         throw new NotFoundError("The user not found!") 
        //     }
            
        //     return {
        //         status: 200,
        //         message: "The user deleted!",
        //         data: user
        //     }
        // },


    },

    Query: {
        staffs: async (_, { pagination, search, sort }, { agent, token }) => {
            const sortKey = Object.keys(sort || {})[0]


            return await model.getStaffs({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        },

        staff: async (_, args) => {
            return await model.getStaff(args)
        }
        
    },

    Staff: {
        staffId: global => global.staff_id,
        staffName: global => global.staff_name,
        branch: global =>global.branch_id,
        birthDate: global => global.birth_date?.toISOString().slice(0,10),
        gender: global => global.staff_gender,
        time: global => global.staff_created_at?.toISOString()
    }
}