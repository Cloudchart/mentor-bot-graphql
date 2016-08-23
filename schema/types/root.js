import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'


import {
  Authors,
  Surveys,
  Scenarios
} from '../connections'


export default new GraphQLObjectType({

  name: 'Root',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: () => 'Mentor Root'
    },

    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => 'Mentor Root'
    },

    authors: Authors(),

    surveys: Surveys(),

    scenarios: Scenarios(),

  })

})
