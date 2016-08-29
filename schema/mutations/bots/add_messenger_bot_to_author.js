import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import facebook from '../../../facebook'

import {
  r,
  run,
  Bot,
  Author,
} from '../../../stores'

import Types from '../../types'
import Connections from '../../connections'


const isUnique = (author_id, page_id) => {
  const ids = Author.get(author_id)('bots')('id').default([])
  return run(Bot.filter(bot => ids.contains(bot('id'))).filter({ page_id }).count().eq(0))
}


export default mutationWithClientMutationId({

  name: 'AddMessengerBotToAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    pageID: {
      type: new GraphQLNonNull(GraphQLString)
    },

    pageName: {
      type: new GraphQLNonNull(GraphQLString)
    },

    pageAccessToken: {
      type: new GraphQLNonNull(GraphQLString)
    }

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

  mutateAndGetPayload: async ({ authorID, pageID, pageName, pageAccessToken }, { author }) => {
    const author_id = fromGlobalId(authorID).id

    // Check authorization
    if (!author || author.id !== author_id)
      return new Error(JSON.stringify({ status: 403, message: 'Not authorized' }))

    // Check if bot is unique
    const is_unique = await run(
      Bot.filter({ page_id: pageID, type: 'messenger' }).count().eq(0)
    )
    if (!is_unique)
      return new Error(JSON.stringify({ status: 409, message: 'Conflict' }))

    // Exchange short term access token for long term one
    const access_token = await facebook.exchangeAccessToken(pageAccessToken).catch(error => null)
    if (!access_token)
      return new Error(JSON.stringify({ statis: 500, message: 'Server error' }))

    // Subscribe to page
    const subscriptionSuccess = await facebook.subscribeToPage(access_token).catch(error => null)
    if (!subscriptionSuccess)
      return new Error(JSON.stringify({ statis: 500, message: 'Server error' }))

    // Create bot
    let bot_id = await run(
      Bot.insert({
        type          : 'messenger',
        name          : pageName,
        page_id       : pageID,
        access_token  : access_token,
        created_at    : new Date,
        updated_at    : new Date,
      })
    ).then(({ generated_keys }) => generated_keys[0])

    // Load newly created bot
    const bot = await Bot.load(bot_id)

    // Append new bot to authors' bot list
    await run(
      Author.get(author_id).update({
        bots        : r.row('bots').default([]).append({ id: bot.id }),
        updated_at  : new Date
      })
    )

    // Clear dataloader cache for author
    Author.clear(author_id)

    // Refresh dataloader cache with updated author
    author = await Author.load(author_id)

    return {
      author,
      bot,
    }
  }

})
