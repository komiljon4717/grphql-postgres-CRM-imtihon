import { UserInputError } from 'apollo-server-express'
import { TRANSPORT_CONFIG } from '#config/index'
import { NotFoundError } from '#helpers/errors'
import { GraphQLUpload } from 'graphql-upload'
import { finished } from 'stream/promises'
import { jwt } from '#helpers/jwt'
import model from './model.js'
import path from 'path'
import fs from 'fs'


export default {

    Upload: GraphQLUpload,
    Mutation: {


        addTransport: async (_, args, { token }) => {
            const {autoImg} = await args
            const { filename, mimetype, createReadStream} = await autoImg

            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mimetype)) {
                throw new Error("Invalid mimetype")
            }

            const stream = createReadStream()
            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', filename))
            stream.pipe(out)
            await finished(out)
            
            if (!args.autoModel.trim() || !args.autoBranch.trim() || !args.autoColor.trim()) {
                throw new UserInputError("The username and password are required!")
            }

            const staff = jwt.verify(token)
            const permission = await model.getPermissionTransport(staff)
            
            if (!(permission?.created == "true")) {
                throw new Error("Not allowed!")
            }

            // const branch = await model.addBranch(args)


            return {
                status: 200,
                message: "The branch added!",
                data: null,
                token: null
            }
        },



        changeTransport: async (_, args, { token }) => {
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
            
            return {
                status: 200,
                message: "The branch changed!",
                data: branch
            }
        },

        deleteTransport: async (_, args, { token }) => {
            const branch = await model.deleteBranch(args)

            const staff = jwt.verify(token)
            const permission = await model.getPermissionBranch(staff)
            
            if (!(permission?.delete == "true")) {
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

        updatePermissionTransport: async (_, args, { token }) => {

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

            const res = await model.updatePermissionTransport(args)

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
        transports: async (_, { pagination, search, sort }, { token }) => {
            const sortKey = Object.keys(sort || {})[0]

            const staff = jwt.verify(token)
            const permission = await model.getPermissionTransport(staff)
            
            if (!(permission?.read == "true")) {
                throw new Error("Not allowed!")
            }


            return await model.getTransports({
                page: pagination?.page || TRANSPORT_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || TRANSPORT_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        },

        transport: async (_, args, { token }) => {

            const staff = jwt.verify(token)
            const permission = await model.getPermissionTransport(staff)

            if (!(permission?.read == "true")) {
                throw new Error("Not allowed!")
            }
            return await model.getTransport(args)
        }
        
    },

    Transport: {
        autoId: global => global.auto_id,
        autoModel: global => global.auto_model,
        autoBranch: global => global.auto_branch,
        autoColor: global => global.auto_color,
        autoImg: global => global.auto_img,
        time: global => global.auto_created_at?.toISOString().slice(0, 19)
    }
}