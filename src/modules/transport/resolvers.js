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

            const staff = jwt.verify(token)
            const chackStaff = await model.getStaff(staff)
            
            if (!(staff.staffId == 1)) {
                if (!(chackStaff.branch_id == args.autoBranch)) {
                    throw new Error("You are not allowed in this branch!")
                }
            }
            
            const permission = await model.getPermissionTransport(staff)
            
            if (!(permission?.created == "true")) {
                throw new Error("Not allowed!")
            }

            if (!args.autoModel.trim() || !args.autoBranch.trim() || !args.autoColor.trim()) {
                throw new UserInputError("The username and password are required!")
            }
            

            const {autoImg} = await args
            const { filename, mimetype, createReadStream} = await autoImg

            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(mimetype)) {
                throw new Error("Invalid mimetype")
            }

            args.autoImg = Date.now() + filename.replace(/\s/g, "")
            const stream = createReadStream()
            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', args.autoImg))
            stream.pipe(out)
            await finished(out)
            


            const transport = await model.addtransport(args)

            return {
                status: 200,
                message: "The transport added!",
                data: transport,
                token: null
            }
        },

        
        

        changeTransport: async (_, args, { token }) => {

            if (
                (args.autoModel && !args.autoModel.trim()) ||
                (args.autoColor && !args.autoColor.trim())
            ) {
                throw new UserInputError("The autoModel or autoBranch or autoColor cannot be empty!")
            }

            const staff = jwt.verify(token)
            const permission = await model.getPermissionTransport(staff)
            
            if (!(permission?.update == "true")) {
                throw new Error("Not allowed!")
            }


            const transport = await model.changeTransport(args)

            if (!transport) {
                throw new Error("The transport not found!")
            }
            
            return {
                status: 200,
                message: "The transport changed!",
                data: transport
            }
        },

        deleteTransport: async (_, args, { token }) => {

            const staff = jwt.verify(token)
            const permission = await model.getPermissionTransport(staff)
            
            
            if (!(permission?.delete == "true")) {
                throw new Error("Not allowed!")
            }

            const transport = await model.deleteTransport(args)
            console.log(args);

            if (!transport) {
                throw new NotFoundError("The transport not found!") 
            }
            
            return {
                status: 200,
                message: "The transport deleted!",
                data: transport
            }
        },

        updatePermissionTransport: async (_, args, { token }) => {

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
                message: "The transport permission updated!",
                data: null,
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