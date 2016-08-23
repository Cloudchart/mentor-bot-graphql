import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Connections from '../connections'
import Interfaces from '../interfaces'


export default new GraphQLObjectType({

  name: 'Course',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    author: {
      type: GraphQLString
    },

    cards: Connections.CourseCards(),

  }),

  interfaces: [Interfaces.Node]

})
