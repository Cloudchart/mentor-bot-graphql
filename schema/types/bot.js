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


export default new GraphQLObjectType({

  name: 'Bot',

  fields: () => ({

    id: globalIdField(),

    type: {
      type: new GraphQLNonNull(BotType)
    },

    token: {
      type: new GraphQLNonNull(GraphQLString)
    },

  })

})
