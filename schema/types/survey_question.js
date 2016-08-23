import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'

import Connections from '../connections'


export default new GraphQLObjectType({

  name: 'SurveyQuestion',

  fields: () => ({
    id: globalIdField(),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    answers: Connections.SurveyQuestionAnswers()
  }),

})
