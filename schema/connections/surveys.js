import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'


import { r, run, Survey } from '../../stores'
import Types from '../types'


let SurveysConnection, SurveysConnectionDefinitions

const ActiveSurveysQuery = Survey.orderBy('name')


const defineSurveysConnection = () => {
  SurveysConnectionDefinitions = connectionDefinitions({
    name      : 'Surveys',
    nodeType  : Types.Survey
  })

  SurveysConnection = {
    ...SurveysConnectionDefinitions,

    type: SurveysConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (root, args) => {
      let ids = await run(ActiveSurveysQuery('id'))
      let surveys = await Survey.loadMany(ids)
      return connectionFromArray(surveys, args)
    }
  }
}


const createSurveysConnection = () => {
  if (SurveysConnection === null || SurveysConnection === undefined)
    defineSurveysConnection()

  return SurveysConnection
}


export default createSurveysConnection
