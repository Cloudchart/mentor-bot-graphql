import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'

import {
  r,
  run,
  Bot,
  Author
} from '../../../stores'

import facebook from '../../../facebook'


export default mutationWithClientMutationId({

  name: 'RemoveBotFromAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    botID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  outputFields: () => ({

    author: {
      type: new GraphQLNonNull(Types.Author)
    },

    deletedBotID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  mutateAndGetPayload: async ({ authorID, botID }, { author }) => {
    const author_id = fromGlobalId(authorID).id
    const bot_id = fromGlobalId(botID).id

    // Check authorization
    if (!author || author.id !== author_id)
      return new Error(JSON.stringify({ status: 403, message: 'Not authorized' }))

    // Check if bot belongs to author
    const belongs_to_author = await run(
      Author.get(author_id)('bots')('id').contains(bot_id)
    )
    if (!belongs_to_author)
      return new Error(JSON.stringify({ status: 403, message: 'Not authorized' }))

    // Load bot record
    const bot = await Bot.load(bot_id).catch(error => null)

    // Check bot existence
    if (!bot)
      return new Error(JSON.stringify({ status: 404, message: 'Not found' }))

    if (bot.type === 'messenger')
      // Unsibscribe app from page
      // Possible errors are not important
      await facebook.unsubscribeFromPage(bot.access_token).catch(error => null)

    // Remove bot database record
    await run(Bot.get(bot_id).delete())

    // Clear dataloader cache for deleted record
    Bot.clear(bot_id)

    // Remove bot reference from author
    await run(
      Author.get(author_id).update({
        bots        : r.row('bots').filter(bot => bot('id').ne(bot_id)),
        updated_at  : new Date
      })
    )

    // Clear dataloader cache for updated record
    Author.clear(author_id)

    // Reload updated record from database
    author = await Author.load(author_id)

    return {
      author,
      deletedBotID: botID
    }
  }

})
