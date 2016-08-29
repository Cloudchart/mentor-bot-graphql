import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import Types from '../../types'
import Connections from '../../connections'

import telegram from '../../../telegram'

import {
  r,
  run,
  Bot,
  Author
} from '../../../stores'


export default mutationWithClientMutationId({

  name: 'AddTelegramBotToAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    botToken: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  outputFields: {

    author: {
      type: new GraphQLNonNull(Types.Author)
    },

    newBotEdge: {
      type: new GraphQLNonNull(Connections.AuthorBots().edgeType),
      resolve: Connections.AuthorBots().nodeToEdge
    }

  },

  mutateAndGetPayload: async ({ authorID, botToken }, { author }) => {
    const author_id = fromGlobalId(authorID).id

    // if (author.id !== author_id)
    //   return new Error('Not authorized.')

    // Fetch bot information
    let { id, first_name } = await telegram.getMe(botToken).catch(error => { throw error })

    // Set bot webhook
    // await telegram.setWebhooks(botToken, process.env.TELEGRAM_WEBHOOK_URL)

    // Create new bot
    const bot_id = await run(
      Bot.insert({
        bot_id      : id,
        name        : first_name,
        created_at  : new Date,
        updated_at  : new Date,
      })
    )

    // Add bot to author
    await run (
      Author.get(author_id).update({
        bots        : r.row('bots').default([]).append({ id: bot_id }),
        updated_at  : new Date
      })
    )


    Author.clear(author_id)

    author = await Author.load(author_id)
    const bot = await Bot.load(bot_id)

    return {
      author,
      bot,
    }
  }

})
