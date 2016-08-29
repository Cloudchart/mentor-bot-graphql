import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Interfaces from '../interfaces'

import {
  AuthorBots,
  AuthorCourses,
  AuthorScenarios,
} from '../connections'


export default new GraphQLObjectType({

  name: 'Author',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    bots: AuthorBots(),

    courses: AuthorCourses(),

    scenarios: AuthorScenarios(),

  }),

  interfaces: [Interfaces.Node]

})
