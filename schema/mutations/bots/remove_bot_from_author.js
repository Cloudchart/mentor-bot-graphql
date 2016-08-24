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

    removedBotID: {
      type: new GraphQLNonNull(GraphQLID),
    }

  }),

  mutateAndGetPayload: async ({ authorID, botID }) => {
    const author_id = fromGlobalId(authorID).id
    const bot_id = fromGlobalId(botID).id

    await run(
      Author.get(author_id).update({
        bots: r.row('bots').filter(bot => bot('id').ne(bot_id))
      })
    )

    await run(
      Bot.get(bot_id).delete()
    )

    Author.clear(author_id)
    Bot.clear(bot_id)

    const author = await Author.load(author_id)

    return {
      author,
      removedBotID: botID,
    }

  }

})
