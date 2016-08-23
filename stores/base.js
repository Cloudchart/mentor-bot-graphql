import {
  r, run
} from './db'

import DataLoader from 'dataloader'

export default function Base({ modelName, tableName }) {
  let Model = r.table(tableName)

  const loader = new DataLoader((ids) => {
    const order = r.expr(ids)

    return run(
      Model.getAll(...ids).orderBy(record => order.offsetsOf(record('id'))(0))
    )
      .then(cursor => cursor.toArray())
      .then(records => records.map(record => {
        record.__type = modelName
        return record
      }))
  })

  Model.modelName = modelName

  Model.load      = (id)  => loader.load(id)
  Model.loadMany  = (ids) => loader.loadMany(ids)
  Model.clear     = (id)  => loader.clear(id)
  Model.clearAll  = ()    => loader.clearAll()

  return Model
}
