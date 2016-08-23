import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'


import {
  r,
  run,
  SurveyQuestion,
  SurveyQuestionAnswer,
} from '../../stores'

import Types from '../types'


let Connection, ConnectionDefinitions


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'SurveyQuestionAnswers',
    nodeType  : Types.SurveyQuestionAnswer
  })

  Connection = {
    ...ConnectionDefinitions,

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (question, args) => {
      const ids = await run(
        SurveyQuestion.get(question.id)('answers')('id').default([])
      ).then(cursor => cursor.toArray())

      const answers = await SurveyQuestionAnswer.loadMany(ids)

      return connectionFromArray(answers, args)
    }
  }
}


const createConnection = () => {
  if (Connection === null || Connection === undefined)
    defineConnection()

  return Connection
}


export default createConnection
