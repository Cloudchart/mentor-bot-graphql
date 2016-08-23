import {
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'

import Interfaces from '../interfaces'

import {
  r,
  run,
  Scenario,
  Action,
} from '../../stores'


let Connection, ConnectionDefinitions


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'ScenarioActions',
    nodeType  : Interfaces.Action,

    connectionFields: () => ({

      count: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: ({ scenario }) =>
          run(Scenario.get(scenario.id)('actions').count())
      }

    })
  })

  Connection = {
    ...ConnectionDefinitions,

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (scenario, args) => {
      const ids = await run(
        Scenario.get(scenario.id)('actions')('id').default([])
      ).then(cursor => cursor.toArray())

      const actions = await Action.loadMany(ids)

      return {
        ...connectionFromArray(actions, args),
        scenario
      }
    }
  }
}


const ensureConnection = () => {
  if (Connection === null || Connection === undefined)
    defineConnection()

  return Connection
}


export default ensureConnection
