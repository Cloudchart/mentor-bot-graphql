import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


export default new GraphQLObjectType({

  name: 'SurveyQuestionAnswer',

  fields: () => ({
    id: globalIdField(),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }),

})
