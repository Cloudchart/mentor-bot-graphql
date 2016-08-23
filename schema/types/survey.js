import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


import Interfaces from '../interfaces'

import {
  SurveyQuestions
} from '../connections'



export default new GraphQLObjectType({

  name: 'Survey',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    questions: SurveyQuestions()

  }),

  interfaces: [Interfaces.Node]

})
