import {
  offsetToCursor,
  connectionArgs,
  connectionFromPromisedArray,
  connectionDefinitions,
} from 'graphql-relay'

import Types from '../types'

import {
  r,
  run,
  Scenario
} from '../../stores'


let Connection, ConnectionDefinitions


const Query = Scenario.orderBy('name')('id')


const nodeToEdge = async ({ scenario }) => {
  const offset = run(Query.offsetsOf(scenario.id)).then(cursor => cursor.next())

  return {
    node    : scenario,
    cursor  : offsetToCursor(await offset)
  }
}


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'Scenarios',
    nodeType  : Types.Scenario
  })

  Connection = {
    ...ConnectionDefinitions,

    nodeToEdge,

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (root, args) => {
      const ids       = run(Query).then(cursor => cursor.toArray())
      const scenarios = Scenario.loadMany(await ids)
      return connectionFromPromisedArray(scenarios, args)
    }
  }
}


const ensureConnection = () => {
  if (Connection === null || Connection === undefined)
    defineConnection()

  return Connection
}


export default ensureConnection
