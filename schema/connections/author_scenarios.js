import {
  offsetToCursor,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'

import Types from '../types'

import {
  r,
  run,
  Author,
  Scenario,
} from '../../stores'


let Connection, ConnectionDefinitions


const Query = (author) => Author.get(author.id)('scenarios')
const IDQuery = (author) => Query(author)('id').default([])
const OffsetsQuery = (author, scenario) => IDQuery(author).offsetsOf(scenario.id)


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'AuthorScenarios',
    nodeType  : Types.Scenario
  })

  Connection = {
    ...ConnectionDefinitions,

    nodeToEdge: async ({ author, scenario }) => {
      const offset = await run(OffsetsQuery(author, scenario)).then(cursor => cursor.next())

      return {
        node    : scenario,
        cursor  : offsetToCursor(offset)
      }
    },

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (author, args) => {
      const ids = run(IDQuery(author)).then(cursor => cursor.toArray())
      const scenarios = await Scenario.loadMany(await ids)

      return {
        ...connectionFromArray(scenarios, args),
        author
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
