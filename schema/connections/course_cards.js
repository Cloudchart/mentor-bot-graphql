import {
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'

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
  Card,
  Course,
} from '../../stores'


let Connection, ConnectionDefinitions


const Query = ({ id }) => Course.get(id)('cards')


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'CourseCards',
    nodeType  : Types.Card,

    connectionFields: () => ({

      count: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: ({ course }) => run(Course.get(course.id)('cards').default([]).count())
      }

    })
  })

  Connection = {
    ...ConnectionDefinitions,

    nodeToEdge: async ({ course, card }) => {
      const offset = await run(Query(course)('id').offsetsOf(card.id)).then(cursor => cursor.next()).catch(console.error)

      return {
        node    : card,
        cursor  : offsetToCursor(offset)
      }
    },

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (course, args) => {
      const ids   = run(Query(course)('id').default([])).then(cursor => cursor.toArray())
      const cards = await Card.loadMany(await ids)

      return {
        ...connectionFromArray(cards, args),
        course
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
