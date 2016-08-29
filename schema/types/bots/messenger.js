import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Interfaces from '../../interfaces'


export default new GraphQLObjectType({

  name: 'MessengerBot',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    pageID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ page_id }) => page_id
    }

  }),

  interfaces: [Interfaces.Bot]

})
