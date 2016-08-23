import {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInterfaceType,
} from 'graphql'

import Types from '../types'

export default new GraphQLInterfaceType({

  name: 'Action',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    label: {
      type: GraphQLString
    },

    action: {
      type: new GraphQLNonNull(GraphQLString)
    },

  }),

  resolveType: ({ action }) => {
    switch(action) {
      case 'message':
        return Types.MessageAction
      case 'input':
        return Types.InputAction
      case 'coursechooser':
        return Types.CourseChooserAction
      case 'cardlist':
        return Types.CardListAction
    }
  }

})
