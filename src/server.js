import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import http from 'http'
import path from 'path'
import '#config/index'
import { graphqlUploadExpress } from 'graphql-upload'

import schema from './modules/index.js'
import context from './context.js'

!async function () {
    const app = express()
    app.use(graphqlUploadExpress())
    app.use(express.static(path.join(process.cwd(), 'uploads')))
    const httpServer = http.createServer(app)
    const server = new ApolloServer({
        schema,
        context,
        csrfPrevention: false,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground()
        ],
    })

    await server.start()
    server.applyMiddleware({ app })
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve))
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}()