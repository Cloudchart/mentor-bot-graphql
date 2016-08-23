import {
  GraphQLSchema
} from 'graphql'

import Types from './types'
import Queries from './queries'
import Mutations from './mutations'


export default new GraphQLSchema({
  name      : 'Mentor',

  types     : [
    Types.MessageAction,
    Types.InputAction,
    Types.CourseChooserAction,
    Types.CardListAction,
  ],

  query     : Queries,
  mutation  : Mutations,
})
