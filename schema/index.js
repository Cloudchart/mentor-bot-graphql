import {
  GraphQLSchema
} from 'graphql'

import Types from './types'
import Queries from './queries'
import Mutations from './mutations'


export default new GraphQLSchema({
  name      : 'Mentor',

  types     : [
    Types.MessengerBot,
  ],

  query     : Queries,
  mutation  : Mutations,
})
