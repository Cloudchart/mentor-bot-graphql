import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'
import Connections from '../../connections'

import {
  r,
  run,
  Bot,
  Author,
} from '../../../stores'


export default mutationWithClientMutationId({

  name: 'AddBotToAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    botName: {
      type: new GraphQLNonNull(GraphQLString),
    },

    botType: {
      type: new GraphQLNonNull(Types.Bot.Type)
    },

    botToken: {
      type: new GraphQLNonNull(GraphQLString)
    },

  }),

  outputFields: () => ({

    author: {
      type: new GraphQLNonNull(Types.Author)
    },

    newBotEdge: {
      type: new GraphQLNonNull(Connections.AuthorBots().edgeType),
      resolve: Connections.AuthorBots().nodeToEdge
    }

  }),

  mutateAndGetPayload: async ({ authorID, botName, botType, botToken }) => {
    const author_id = fromGlobalId(authorID).id

    const bot_id = await run(
      Bot.insert({
        name  : botName,
        type  : botType,
        token : botToken,
      })
    ).then(({ generated_keys }) => generated_keys[0])

    await run(
      Author.get(author_id).update({
        bots: r.row('bots').default([]).append({ id: bot_id })
      })
    )

    Author.clear(author_id)

    const author = await Author.load(author_id)
    const bot = await Bot.load(bot_id)

    return {
      author,
      bot,
    }
  }

})
