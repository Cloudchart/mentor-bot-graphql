import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


import Interfaces from '../interfaces'


export default new GraphQLObjectType({

  name: 'Scenario',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

  }),

  interfaces: [Interfaces.Node],

})
