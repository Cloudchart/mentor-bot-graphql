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

import Keyboard from './keyboard'


export default new GraphQLObjectType({

  name: 'MessageAction',

  fields: () => ({

    id: globalIdField(),

    action: {
      type: new GraphQLNonNull(GraphQLString)
    },

    label: {
      type: GraphQLString
    },

    text: {
      type: new GraphQLNonNull(GraphQLString)
    },

    keyboard: Keyboard

  }),

  interfaces: [Interfaces.Node, Interfaces.Action],

})
