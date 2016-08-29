import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInterfaceType,
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Types from '../types'

export default new GraphQLInterfaceType({

  name: 'BotInterface',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  resolveType: ({ type }) => {
    switch(type) {
      case 'messenger':
        return Types.MessengerBot
      case 'telegram':
        return Types.TelegramBot
    }
  }

})
