import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'

import Types from '../types'

import {
  r,
  run,
  Bot,
  Author,
} from '../../stores'


let Connection, ConnectionDefinitions


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'AuthorBots',
    nodeType  : Types.Bot
  })

  Connection = {
    ...ConnectionDefinitions,

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (author, args) => {
      return connectionFromArray([], args)
    }
  }
}


const ensureConnection = () => {
  if (Connection === null || Connection === undefined)
    defineConnection()

  return Connection
}


export default ensureConnection
