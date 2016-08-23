import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Interfaces from '../../interfaces'


export default new GraphQLObjectType({

  name: 'CardListAction',

  fields: () => ({

    id: globalIdField(),

    action: {
      type: new GraphQLNonNull(GraphQLString)
    },

    label: {
      type: GraphQLString
    },

    tags: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString))
    }

  }),

  interfaces: [Interfaces.Node, Interfaces.Action],

})
