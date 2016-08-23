import JSON from 'json5'

import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'


let KeyboardType = new GraphQLObjectType({

  name: 'ActionKeyboard',

  fields: () => ({

    inline: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },

    buttons: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString)))
    }

  })

})


export default {
  type: KeyboardType,
  resolve: ({ keyboard }) => {
    let result = null

    try {
      result = JSON.parse(keyboard)
    } catch(error) {}

    return result
  }
}
