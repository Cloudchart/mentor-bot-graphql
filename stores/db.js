import r from 'rethinkdb'

const connection = r.connect({
  host      : 'localhost',
  post      : '28015',
  db        : process.env.RETHINKDB_DATABASE,
  user      : 'admin',
  password  : ''
})

const run = async (query) => query.run(await connection)

export {
  r, run
}
