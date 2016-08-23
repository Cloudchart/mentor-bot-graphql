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
  Card,
} from '../../../stores'


export default mutationWithClientMutationId({

  name: 'UpdateCard',

  inputFields: () => ({

    cardID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    cardContent: {
      type: new GraphQLNonNull(GraphQLString)
    },

    cardButtons: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    }

  }),

  outputFields: () => ({

    card: {
      type: new GraphQLNonNull(Types.Card)
    }

  }),

  mutateAndGetPayload: async({ cardID, cardContent, cardButtons }) => {
    const card_id = fromGlobalId(cardID).id

    await run(
      Card.get(card_id).update({
        content : cardContent,
        buttons : cardButtons.filter(button => button.trim().length > 0)
      })
    )

    Card.clear(card_id)

    const card = await Card.load(card_id)

    return {
      card
    }
  }

})
