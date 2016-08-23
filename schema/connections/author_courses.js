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
  Author,
  Course,
} from '../../stores'


let Connection, ConnectionDefinitions


const Query = ({ id }) => Author.get(id)('courses')


const defineConnection = () => {
  ConnectionDefinitions = connectionDefinitions({
    name      : 'AuthorCourses',
    nodeType  : Types.Course
  })

  Connection = {
    ...ConnectionDefinitions,

    nodeToEdge: async ({ author, course }) => {
      const offset = await run(Query(author)('id').offsetsOf(course.id)).then(cursor => cursor.next())

      return {
        node    : course,
        cursor  : offsetToCursor(offset)
      }
    },

    type: ConnectionDefinitions.connectionType,

    args: {
      ...connectionArgs
    },

    resolve: async (author, args) => {
      const ids     = run(Query(author)('id').default([])).then(cursor => cursor.toArray())
      const courses = Course.loadMany(await ids)

      return connectionFromPromisedArray(courses, args)
    }
  }
}


const ensureConnection = () => {
  if (Connection === null || Connection === undefined)
    defineConnection()

  return Connection
}


export default ensureConnection
