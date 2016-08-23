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
  SurveyQuestion,
  SurveyQuestionAnswer,
} from '../../../stores'


export const AddAnswer = mutationWithClientMutationId({

  name: 'AddAnswerToSurveyQuestion',

  inputFields: () => ({

    surveyID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    answerContent: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  outputFields: () => ({

    question: {
      type: new GraphQLNonNull(Types.SurveyQuestion)
    },

    newQuestionAnswerEdge: {
      type: new GraphQLNonNull(Connections.SurveyQuestionAnswers().edgeType),

      resolve: async ({ question, answer }) => {
        const offset = await run(
          SurveyQuestion.get(question.id)('answers')('id').offsetsOf(answer.id)
        ).then(cursor => cursor.next())

        return {
          node    : answer,
          cursor  : offsetToCursor(offset)
        }
      }
    }

  }),

  mutateAndGetPayload: async ({ surveyID, questionID, answerContent }) => {
    const question_id = fromGlobalId(questionID).id

    const answer_id = await run(
      SurveyQuestionAnswer.insert({
        content     : answerContent,
        created_at  : new Date
      })
    ).then(({ generated_keys }) => generated_keys[0])

    const answer = await SurveyQuestionAnswer.load(answer_id)

    await run(
      SurveyQuestion.get(question_id).update({
        answers: r.row('answers').default([]).append({ id: answer_id })
      })
    )

    SurveyQuestion.clear(question_id)

    const question = await SurveyQuestion.load(question_id)

    return {
      answer,
      question,
    }
  }

})


export const RemoveAnswer = mutationWithClientMutationId({

  name: 'RemoveAnswerFromSurveyQuestion',

  inputFields: () => ({

    surveyID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    answerID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  outputFields: () => ({

    question: {
      type: new GraphQLNonNull(Types.SurveyQuestion)
    },

    destroyedAnswerID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  }),

  mutateAndGetPayload: async ({ surveyID, questionID, answerID }) => {
    let question_id = fromGlobalId(questionID).id
    let answer_id = fromGlobalId(answerID).id


    await run(
      SurveyQuestion.get(question_id).update({
        answers     : r.row('answers').filter(answer => answer('id').ne(answer_id)),
        updated_at  : new Date
      })
    )

    SurveyQuestion.clear(question_id)

    const question = await SurveyQuestion.load(question_id)

    await run(
      SurveyQuestionAnswer.get(answer_id).delete()
    )

    SurveyQuestionAnswer.clear(answer_id)

    return {
      question,
      destroyedAnswerID : answerID
    }
  }

})


export const ReorderAnswers = mutationWithClientMutationId({

  name: 'ReorderSurveyQuestionAnswers',

  inputFields: () => ({

    surveyID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    questionID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    answersIDs: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
    }

  }),

  outputFields: {
    question: {
      type: new GraphQLNonNull(Types.SurveyQuestion)
    }
  },

  mutateAndGetPayload: async ({ surveyID, questionID, answersIDs }) => {
    const question_id = fromGlobalId(questionID).id
    const answers_ids = answersIDs.map(answerID => fromGlobalId(answerID).id)

    const order = r.expr(answers_ids)
    const orderFn = (record) => order.offsetsOf(record('id'))(0)

    await run(
      SurveyQuestion.get(question_id).update({
        answers     : r.row('answers').orderBy(orderFn),
        updated_at  : new Date
      })
    )

    SurveyQuestion.clear(question_id)

    const question = await SurveyQuestion.load(question_id)

    return {
      question
    }

  }

})
