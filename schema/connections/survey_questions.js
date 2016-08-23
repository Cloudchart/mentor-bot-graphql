import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'

import Types from '../types'

import {
  r,
  run,
  Survey,
  SurveyQuestion
} from '../../stores'


let Connection, ConnectionDefinitions


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'SurveyQuestions',
    nodeType  : Types.SurveyQuestion
  })

  Connection = {
    ...ConnectionDefinitions,

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (survey, args) => {
      const ids = await run(
        Survey.get(survey.id)('questions')('id').default([])
      ).then(cursor => cursor.toArray())

      const questions = await SurveyQuestion.loadMany(ids)

      return connectionFromArray(questions, args)
    }
  }
}


const ensureConnection = () => {
  if (Connection === null || Connection === undefined)
    defineConnection()

  return Connection
}


export default ensureConnection
