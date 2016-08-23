import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Interfaces from '../../interfaces'

import Branch from './branch'

export default new GraphQLObjectType({

  name: 'InputAction',

  fields: () => ({

    id: globalIdField(),

    action: {
      type: new GraphQLNonNull(GraphQLString)
    },

    label: {
      type: GraphQLString
    },

    branch: Branch

  }),

  interfaces: [Interfaces.Node, Interfaces.Action],

})
