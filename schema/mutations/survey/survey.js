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
import Connections from '../../connections'

import {
  r,
  run,
  Survey,
  SurveyQuestion,
  SurveyQuestionAnswer,
} from '../../../stores'


export const Create = mutationWithClientMutationId({

  name: 'CreateSurvey',

  inputFields: () => ({

    name: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  outputFields: () => ({

    root: {
      type: new GraphQLNonNull(Types.Root)
    },

    newSurveyEdge: {
      type: new GraphQLNonNull(Connections.Surveys().edgeType),
      resolve: async ({ survey }) => {

        let offset = await run(
          Survey.orderBy('name')('id').offsetsOf(survey.id)
        ).then(cursor => cursor.next())

        return {
          node    : survey,
          cursor  : offsetToCursor(offset)
        }

      }
    }

  }),

  mutateAndGetPayload: async ({ name }) => {

    const survey_id = await run(
      Survey.insert({
        name        : name,
        created_at  : new Date
      })
    ).then(({ generated_keys }) => generated_keys[0])

    const survey = await Survey.load(survey_id)

    return { root: {}, survey }
  }

})


export const Destroy = mutationWithClientMutationId({

  name: 'DestroySurvey',

  inputFields: () => ({

    surveyID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  outputFields: () => ({

    root: {
      type: new GraphQLNonNull(Types.Root)
    },

    destroyedSurveyID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  mutateAndGetPayload: async ({ surveyID }) => {
    const survey_id = fromGlobalId(surveyID).id

    const questions_ids = await run(
      Survey.get(survey_id)('questions')('id').default([])
    ).then(cursor => cursor.toArray())

    const answers_ids = await run(
      SurveyQuestion.getAll(...questions_ids).concatMap(question => question('answers')('id').default([]))
    ).then(cursor => cursor.toArray())

    await run(
      Survey.get(survey_id).delete()
    )

    await run(
      SurveyQuestion.getAll(...questions_ids).delete()
    )

    await run(
      SurveyQuestionAnswer.getAll(...answers_ids).delete()
    )

    Survey.clear(survey_id)
    SurveyQuestionAnswer.clearAll()
    SurveyQuestionAnswer.clearAll()

    return {
      root              : {},
      destroyedSurveyID : surveyID
    }
  },

})
