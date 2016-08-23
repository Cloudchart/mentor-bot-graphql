import {
  GraphQLID,
  GraphQLString,
  GraphQLList,
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
  SurveyQuestion
} from '../../../stores'


export const AddQuestion = mutationWithClientMutationId({

  name: 'AddQuestionToSurvey',

  inputFields: () => ({

    surveyID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    questionContent: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  outputFields: () => ({

    survey: {
      type: new GraphQLNonNull(Types.Survey)
    },

    newQuestionEdge: {
      type: new GraphQLNonNull(Connections.SurveyQuestions().edgeType),
      resolve: async ({ survey, question }) => {

        const offset = run(
          Survey.get(survey.id)('questions')('id').offsetsOf(question.id)
        ).then(cursor => cursor.next())

        return {
          node:   survey,
          cursor: offsetToCursor(await offset)
        }
      }
    }

  }),

  mutateAndGetPayload: async ({ surveyID, questionContent }) => {
    let survey_id = fromGlobalId(surveyID).id

    const question_id = await run(
      SurveyQuestion.insert({
        content     : questionContent,
        created_at  : new Date
      })
    ).then(({ generated_keys }) => generated_keys[0])

    await run(
      Survey.get(survey_id).update({
        questions: r.row('questions').default([]).append({ id: question_id })
      })
    )

    Survey.clear(survey_id)

    const survey = await Survey.load(survey_id)
    const question = await SurveyQuestion.load(question_id)

    return {
      survey,
      question
    }
  }

})


export const RemoveQuestion = mutationWithClientMutationId({

  name: 'RemoveQuestionFromSurvey',

  inputFields: () => ({

    surveyID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  outputFields: {

    survey: {
      type: new GraphQLNonNull(Types.Survey)
    },

    destroyedQuestionID: {
      type: new GraphQLNonNull(GraphQLID),
    }
  },

  mutateAndGetPayload: async ({ surveyID, questionID }) => {
    const survey_id = fromGlobalId(surveyID).id
    const question_id = fromGlobalId(questionID).id

    await run(
      Survey.get(survey_id).update({
        questions: r.row('questions').filter(question => question('id').ne(question_id))
      })
    )

    Survey.clear(survey_id)

    await run(
      SurveyQuestion.get(question_id).delete()
    )

    SurveyQuestion.clear(question_id)

    const survey = await Survey.load(survey_id)

    return {
      survey,
      destroyedQuestionID: questionID,
    }
  }

})


export const ReorderQuestions = mutationWithClientMutationId({

  name: 'ReorderSurveyQuestions',

  inputFields: () => ({

    surveyID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    questionsIDs: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
    }

  }),

  outputFields: () => ({

    survey: {
      type: new GraphQLNonNull(Types.Survey)
    }

  }),

  mutateAndGetPayload: async ({ surveyID, questionsIDs }) => {
    const survey_id = fromGlobalId(surveyID).id
    const questions_ids = questionsIDs.map(questionID => fromGlobalId(questionID).id)

    const order = r.expr(questions_ids)
    const orderFn = (record) => order.offsetsOf(record('id'))(0)

    await run(
      Survey.get(survey_id).update({
        questions: r.row('questions').orderBy(orderFn)
      })
    )

    Survey.clear(survey_id)

    const survey = await Survey.load(survey_id)

    return {
      survey
    }
  }

})
