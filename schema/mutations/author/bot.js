import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  offsetToCursor,
  mutationWithClientMutationId,
} from 'graphql-relay'

import Types from '../../types'

import { AuthorBots } from '../../connections'

import {
  r, run,
  Author
} from '../../../stores'


const nodeOffset = (author, bot) =>
  run(
    Author.get(author.id)('bots')('id').offsetsOf(bot.id)
  ).then(cursor => cursor.next())


export const Add = mutationWithClientMutationId({

  name: 'AddBotToAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    botName: {
      type: new GraphQLNonNull(GraphQLString)
    },

  }),

  outputFields: () => ({

    author: {
      type: new GraphQLNonNull(Types.Author)
    },

    newBotEdge: {
      type: new GraphQLNonNull(AuthorBots().edgeType),

      resolve: async ({ author, bot }) => ({
        node    : bot,
        cursor  : offsetToCursor(await nodeOffset(author, bot))
      })
    }

  }),

  mutateAndGetPayload: async ({ authorID, botName }) => {
    const author_id = fromGlobalId(authorID).id
    const bot_id = await run(r.uuid())

    const bot = {
      id    : bot_id,
      name  : botName
    }

    await run(
      Author.get(author_id).update({
        bots        : r.row('bots').default([]).append(bot),
        updated_at  : new Date
      })
    )

    Author.clear(author_id)

    const author = await Author.load(author_id)

    return {
      author,
      bot,
    }
  }

})


export const Update = mutationWithClientMutationId({

  name: 'UpdateAuthorBot',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    botID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    botName: {
      type: GraphQLString
    },

    messenger: {
      type: Types.BotAttributes.InputType,
    },

    telegram: {
      type: Types.BotAttributes.InputType,
    }

  }),

  outputFields: () => ({

    bot: {
      type: new GraphQLNonNull(Types.AuthorBot)
    }

  }),

  mutateAndGetPayload: async ({ authorID, botID, botName, messenger, telegram}) => {
    const author_id = fromGlobalId(authorID).id
    const bot_id = fromGlobalId(botID).id

    let attributes = {}

    const checkTokenFn = (type, token) => Author('bots').concatMap(r.row(type)('token')).contains(token)

    if (messenger) {
      if (messenger.token) {
        let exists = await run(checkTokenFn('messenger', messenger.token))
        if (exists) return new Error(`This token for messenger bot is taken.`)
      }
      attributes.messenger = messenger
    }

    if (telegram) {
      if (telegram.token) {
        let exists = await run(checkTokenFn('telegram', telegram.token))
        if (exists) return new Error(`This token for telegram bot is taken.`)
      }
      attributes.telegram = telegram
    }

    const updateBotFn = (bot) =>
      r.branch(
        bot('id').eq(bot_id),
        bot.merge(attributes),
        bot
      )

    await run(
      Author.get(author_id).update({
        bots        : r.row('bots').map(updateBotFn),
        updated_at  : new Date
      })
    )

    Author.clear(author_id)

    const bot = await run(
      Author.get(author_id)('bots').filter(r.row('id').eq(bot_id)).limit(1)
    ).then(cursor => cursor.next())

    return {
      bot
    }
  }

})


export const Remove = mutationWithClientMutationId({

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

    destroyedBotID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  mutateAndGetPayload: async ({ authorID, botID }) => {
    const author_id = fromGlobalId(authorID).id
    const bot_id = fromGlobalId(botID).id

    await run(
      Author.get(author_id).update({
        bots        : r.row('bots').filter(bot => bot('id').ne(bot_id)),
        updated_at  : new Date
      })
    )

    Author.clear(author_id)

    const author = await Author.load(author_id)

    return {
      author,
      destroyedBotID  : botID
    }
  }

})
