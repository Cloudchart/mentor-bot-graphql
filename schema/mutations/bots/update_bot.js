import {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import Types from '../../types'

import {
  r,
  run,
  Bot,
} from '../../../stores'


export default mutationWithClientMutationId({

  name: 'UpdateBot',

  inputFields: () => ({

    botID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    botName: {
      type: new GraphQLNonNull(GraphQLString),
    },

    botToken: {
      type: new GraphQLNonNull(GraphQLString)
    },

  }),

  outputFields: () => ({

    bot: {
      type: new GraphQLNonNull(Types.Bot)
    }

  }),

  mutateAndGetPayload: async({ botID, botName, botToken }) => {
    const bot_id = fromGlobalId(botID).id

    await run(
      Bot.get(bot_id).update({
        name  : botName,
        token : botToken,
      })
    )

    Bot.clear(bot_id)

    const bot = await Bot.load(bot_id)

    return {
      bot
    }
  }

})
