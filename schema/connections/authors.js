import {
  connectionArgs,
  connectionFromPromisedArray,
  connectionDefinitions,
} from 'graphql-relay'

import Types from '../types'

import {
  r,
  run,
  Author
} from '../../stores'


let Connection, ConnectionDefinitions


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'Authors',
    nodeType  : Types.Author
  })

  Connection = {
    ...ConnectionDefinitions,

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (root, args) => {
      const ids = await run(
        Author.orderBy('name')('id')
      ).then(cursor => cursor.toArray())

      const authors = Author.loadMany(ids)

      return connectionFromPromisedArray(authors, args)
    }
  }
}


const ensureConnection = () => {
  if (Connection === null || Connection === undefined)
    defineConnection()

  return Connection
}


export default ensureConnection
