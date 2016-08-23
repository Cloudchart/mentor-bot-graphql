import JSON from 'json5'

import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'


let BranchType = new GraphQLObjectType({

  name: 'Branch',

  fields: () => ({

    key: {
      type: new GraphQLNonNull(GraphQLString)
    },

    value: {
      type: new GraphQLNonNull(GraphQLString)
    }

  })

})


export default {
  type: new GraphQLList(BranchType),

  resolve: ({ branch }) => {
    let data = JSON.parse(branch)
    return Object.keys(data).map((key) => ({ key, value: data[key] }))
  }
}
