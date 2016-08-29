import express from 'express'
import cors from 'cors'
import graphqlHTTP from 'express-graphql'
import MentorSchema from './schema'
import facebook from './facebook'

import {
  r,
  run,
  Author
} from './stores'


const app = express()

app.set('port', process.env.PORT || 3000)
app.set('path-prefix', process.env.PATH_PREFIX || '/graphql')


const findOrCreateAuthor = async ({ id, ...attributes }) => {
  let author = await Author.load(id).catch(error => null)

  if (author === null) {
    await run(Author.insert({ id, ...attributes }))
    author = await Author.load(id)
  }

  return author
}

const ensureAuthor = async (headers) => {
  const user_id = headers['user-id']
  const access_token = headers['access-token']
  if (user_id && access_token) {
    let profile = await facebook.profile(user_id, access_token).catch(console.error)
    console.log(profile)
    if (profile && profile.id === user_id)
      return findOrCreateAuthor(profile)
    else
      return null
  } else {
    return null
  }
}


app.use(app.get('path-prefix'), cors(), graphqlHTTP(async req => {

  console.log(req.headers)

  return {
    schema    : MentorSchema,
    graphiql  : true,
    context   : {
      author  : await ensureAuthor(req.headers)
    }
  }

}))



app.listen(app.get('port'), () => {
  console.log('GraphQL server started on port', app.get('port'))
})
