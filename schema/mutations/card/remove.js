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
  Card,
  Course
} from '../../../stores'


export default mutationWithClientMutationId({

  name: 'RemoveCardFromCourse',

  inputFields: () => ({

    courseID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    cardID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  outputFields: () => ({

    course: {
      type: new GraphQLNonNull(Types.Course)
    },

    removedCardID: {
      type: new GraphQLNonNull(GraphQLID),
    }

  }),

  mutateAndGetPayload: async ({ courseID, cardID }) => {
    const course_id = fromGlobalId(courseID).id
    const card_id = fromGlobalId(cardID).id

    await run(
      Course.get(course_id).update({
        cards: r.row('cards').filter(card => card('id').ne(card_id))
      })
    )

    await run(
      Card.get(card_id).delete()
    )

    Course.clear(course_id)
    Card.clear(card_id)

    const course = await Course.load(course_id)

    return {
      course,
      removedCardID: cardID,
    }

  }

})
