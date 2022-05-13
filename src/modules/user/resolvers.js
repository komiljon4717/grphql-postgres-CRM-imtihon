import { UserInputError } from 'apollo-server-express'
import { NotFoundError } from '#helpers/errors'
import { jwt } from '#helpers/jwt'
import { USER_CONFIG } from '#config/index'
import model from './model.js'
import sha256 from 'sha256'

export default {
    Mutation: {

        updatePermissionStaff: async (_, args, { agent, token }) => {

            if (!(args.created == "false" || args.created == "true") &&
             !(args.updated == "false" || args.updated == "true") && 
             !(args.read == "false" || args.read == "true") &&
             !(args.deleted == "false" || args.deleted == "true")) {
                throw new Error("C.R.U.D values must be 'true' or 'false'")
            }

            const staff = jwt.verify(token)
            const permission = await model.getPermission(staff)

            if (!(permission?.created == "true")) {
                throw new Error("Not allowed!")
            }


            const res = await model.updatePermission(args)
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
                message: "The staff permission updated!",
                data: res,
                token: null
            }
        },


        register: async (_, args, { agent }) => {

            if (!args.staffName.trim() || !args.password.trim()) {
                throw new UserInputError("The username and password are required!")
            }
            args.password = sha256(args.password)

            if (!args.birthDate.trim()) {
                throw new UserInputError("The branchId and birth date are required!")
            }

            if (!(args.birthDate.trim().match(/^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/))) {
                throw new UserInputError("Invalit input! Birth date format yyyy-mm-dd")
            }

            if (!args.gender.trim()) {
                throw new UserInputError("The gender mast be 'M' or 'F'!")
            }

            const staff = await model.addUser(args)
            staff.staffId = staff.staff_id
            const res = await model.addPermission(staff)
            const auto = await model.addPermissionTransport(staff)
            const branch = await model.addPermissionBranch(staff)

            return {
                status: 200,
                message: "The staff created!",
                data: staff,
                token: jwt.sign({ staffId: staff.staff_id,  agent})
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
                token: jwt.sign({ staffId: staff.staff_id,  agent})
            }
        }
    },



    Query: {
        staffs: async (_, { pagination, search, sort }, { agent, token }) => {
            const sortKey = Object.keys(sort || {})[0]

            const staff = jwt.verify(token)
            const permission = await model.getPermission(staff)
            
            if (!(permission?.read == "true")) {
                return [await model.getStaff(staff)]
            }


            return await model.getStaffs({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        },

        staff: async (_, args, { token }) => {

            const staff = jwt.verify(token)
            const permission = await model.getPermission(staff)
            
            if (!(permission?.read == "true")) {
                throw new Error("Not allowed!")
            }

            return await model.getStaff(args)
        },

        allStaffPermission: async (_, args, { token}) => {
            const sortKey = Object.keys(sort || {})[0]

            const staff = jwt.verify(token)
            const permission = await model.getPermission(staff)
            
            if (!(permission?.read == "true")) {
                return [await model.getStaff(staff)]
            }


            return await model.getStaffPermission({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        }
        
    },

    Staff: {
        staffId: global => global.staff_id,
        staffName: global => global.staff_name,
        branch: global =>global.branch_name,
        birthDate: global => global.birth_date?.toISOString().slice(0,10),
        gender: global => global.staff_gender,
        time: global => global.staff_created_at?.toISOString()
    }
}