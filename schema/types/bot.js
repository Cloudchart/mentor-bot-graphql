import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


const BotType = new GraphQLEnumType({
  name: 'BotType',
  values: {
    MESSENGER : { value : 'messenger' },
    TELEGRAM  : { value : 'telegram' }
  }
})


const Bot = new GraphQLObjectType({

  name: 'Bot',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    type: {
      type: new GraphQLNonNull(BotType)
    },

    token: {
      type: new GraphQLNonNull(GraphQLString)
    },

  })

})


Bot.Type = BotType

export default Bot
