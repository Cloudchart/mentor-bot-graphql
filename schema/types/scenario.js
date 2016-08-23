import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField
} from 'graphql-relay'


import {
  r,
  run,
  Author,
  Scenario,
} from '../../stores'


import Types from './'
import Interfaces from '../interfaces'

import {
  ScenarioActions
} from '../connections'


export default new GraphQLObjectType({

  name: 'Scenario',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    author: {
      type: Types.Author,
      resolve: async (scenario) => {
        const author_id = await run(Scenario.get(scenario.id)('author')('id').default(null))

        return author_id
          ? Author.load(author_id)
          : null
      }
    },

    actions: ScenarioActions(),

  }),

  interfaces: [Interfaces.Node],

})
