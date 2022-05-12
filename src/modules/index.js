import { makeExecutableSchema } from '@graphql-tools/schema'

import TypesModule from './types/index.js'
import UserModule from './user/index.js'
import BranchModule from './branch/index.js'

export default makeExecutableSchema({
    typeDefs: [
        TypesModule.typeDefs,
        UserModule.typeDefs,
        BranchModule.typeDefs,
    ],
    resolvers: [
        TypesModule.resolvers,
        UserModule.resolvers,
        BranchModule.resolvers,
    ]
})