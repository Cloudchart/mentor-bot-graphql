import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay'

import Models, { r, run } from '../stores'

import Types from './types'

const { nodeInterface, nodeField } = nodeDefinitions(

  (globalID) => {
    let { type, id } = fromGlobalId(globalID)
    if (Models.hasOwnProperty(type))
      return Models[type].load(id)
    return new Error(`Node interface error: Unknown type "${type}".`)
  },

  (record) => {
    if (Types.hasOwnProperty(record.__type))
      return Types[record.__type]
    return new Error(`Node field error: Unknown type "${record.__type}".`)
  }

)

export {
  nodeField,
  nodeInterface,
}
