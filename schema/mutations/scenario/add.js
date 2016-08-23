import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalID,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  r,
  run,
  Author,
  Scenario,
} from '../../../stores'

import {
  Scenarios
} from '../../connections'

import Types from '../../types'


export const Add = mutationWithClientMutationId({

  name: 'AddScenarioToAuthor',

  inputFields: () => ({

    authorID: {
      type: new GraphQLNonNull(GraphQLID)
    },

    scenarioName: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  outputFields: () => ({

    author: {
      type: new GraphQLNonNull(Types.Author)
    },

    root: {
      type: new GraphQLNonNull(Types.Root)
    },

    newAuthorScenarioEdge: {
      type: new GraphQLNonNull(GraphQLString)
    },

    newScenarioEdge: {
      type: new GraphQLNonNull(Scenarios().edgeType),
      resolve: Scenarios().nodeToEdge
    },

  }),

  mutateAndGetPayload: async ({ authorID, scenarioName }) => {
    const author_id = fromGlobalID(authorID).id

    const scenario_id = await run(
      Scenario.insert({
        name        : scenarioName,
        created_at  : new Date,
        author      : { id: author_id }
      })
    ).then(({ generated_keys }) => generated_keys[0])

    const scenario = await Scenario.load(scenario_id)

    await run(
      Author.get(author_id).update({
        scenarios   : r.row('scenarios').default([]).append({ id: scenario_id }),
        updated_at  : new Date
      })
    )

    Author.clear(author_id)

    const author = await Author.load(author_id)

    return {
      root: {},
      author,
      scenario,
    }
  }

})
