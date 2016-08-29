import {
  offsetToCursor,
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'

import Types from '../types'
import Interfaces from '../interfaces'

import {
  r,
  run,
  Bot,
  Author,
} from '../../stores'


let Connection, ConnectionDefinitions


const nodeToEdge = async({ author, bot }) => {
  const offset = await run(
    Author.get(author.id)('bots')('id').offsetsOf(bot.id)
  ).then(cursor => cursor.next())

  return {
    node    : bot,
    cursor  : offsetToCursor(offset)
  }
}


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'AuthorBots',
    nodeType  : Interfaces.Bot
  })

  Connection = {
    ...ConnectionDefinitions,

    type: ConnectionDefinitions.connectionType,

    nodeToEdge,

    args: {
      ...connectionArgs
    },

    resolve: async (author, args) => {
      const bots_ids = await run(
        Author.get(author.id)('bots')('id').default([])
      ).then(cursor => cursor.toArray())

      const bots = await Bot.loadMany(bots_ids)

      return connectionFromArray(bots, args)
    }
  }
}


const ensureConnection = () => {
  if (Connection === null || Connection === undefined)
    defineConnection()

  return Connection
}


export default ensureConnection
