import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'
import Connections from '../../connections'

import {
  r,
  run,
  Author,
  Scenario,
} from '../../../stores'


export default mutationWithClientMutationId({

  name: 'AddScenarioToAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    scenarioName: {
      type: new GraphQLNonNull(GraphQLString),
    },

  }),

  outputFields: () => ({

    author: {
      type: new GraphQLNonNull(Types.Author)
    },

    newScenarioEdge: {
      type: new GraphQLNonNull(Connections.AuthorScenarios().edgeType),
      resolve: Connections.AuthorScenarios().nodeToEdge
    }

  }),

  mutateAndGetPayload: async ({ authorID, scenarioName }) => {
    const author_id = fromGlobalId(authorID).id

    const scenario_id = await run(
      Scenario.insert({
        name        : scenarioName,
        created_at  : new Date,
        updated_at  : new Date
      })
    ).then(({ generated_keys }) => generated_keys[0])

    await run(
      Author.get(author_id).update({
        scenarios: r.row('scenarios').default([]).append({ id: scenario_id })
      })
    )

    Author.clear(author_id)

    const author = await Author.load(author_id)
    const scenario = await Scenario.load(scenario_id)

    return {
      author,
      scenario,
    }
  }

})
