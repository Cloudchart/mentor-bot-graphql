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

  name: 'CourseChooserAction',

  fields: () => ({

    id: globalIdField(),

    action: {
      type: new GraphQLNonNull(GraphQLString)
    },

    label: {
      type: GraphQLString
    },

  }),

  interfaces: [Interfaces.Node, Interfaces.Action],

})
