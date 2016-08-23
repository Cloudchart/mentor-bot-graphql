import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Types from '.'


export default new GraphQLObjectType({

  name: 'AuthorBot',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    messenger: {
      type: Types.BotAttributes.OutputType
    },

    telegram: {
      type: Types.BotAttributes.OutputType
    }

  })

})
