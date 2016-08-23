import {
  GraphQLID,
  GraphQLString,
  GraphQLList,
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
  Card,
  Course
} from '../../../stores'


export default mutationWithClientMutationId({

  name: 'AddCardToCourse',

  inputFields: () => ({

    courseID: {
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

    course: {
      type: new GraphQLNonNull(Types.Course)
    },

    newCardEdge: {
      type: new GraphQLNonNull(Connections.CourseCards().edgeType),
      resolve: Connections.CourseCards().nodeToEdge
    }

  }),

  mutateAndGetPayload: async ({ courseID, cardContent, cardButtons }) => {
    const course_id = fromGlobalId(courseID).id

    const card_id = await run(
      Card.insert({
        content: cardContent,
        buttons: cardButtons.filter(button => button.trim().length > 0),
      })
    ).then(({ generated_keys }) => generated_keys[0])

    await run(
      Course.get(course_id).update({
        cards: r.row('cards').default([]).append({ id: card_id })
      })
    )

    Course.clear(course_id)

    const course = await Course.load(course_id)
    const card = await Card.load(card_id)

    return {
      course,
      card
    }
  }

})
