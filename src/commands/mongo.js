const {Command, flags} = require('@oclif/command')
const {setupDataStore, shutdownDataStore} = require('../db/mongo')

const parseReducer = ctx => (accum, flag) => {
  if (!ctx[flag]) {
    return accum
  }

  return {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...accum,
    [flag]: JSON.parse(ctx[flag]),
  }
}

const methodArgs = {
  updateOne: ['filter', 'data', 'options'],
  findOne: ['filter', 'projection'],
}

class MongoCommand extends Command {
  async run() {
    const {flags} = this.parse(MongoCommand)

    const client = await setupDataStore({url: flags.url, secretUrl: flags.awsSecretUrl})

    const collection = client.db(flags.db).collection(flags.collection)
    const parsed = methodArgs[flags.method].reduce(parseReducer(flags), {})
    const mArgs = methodArgs[flags.method].map(a => parsed[a])
    // this.log(`db.${flags.collection}.${flags.method}( ${JSON.stringify(mArgs)} ) on [${flags.url || flags.awsSecretUrl}/${flags.db}/${flags.collection}],`)
    const result = await collection[flags.method](...mArgs)
    this.log(JSON.stringify(result))
    shutdownDataStore()
  }
}

MongoCommand.description = `Describe the command here
...
Extra documentation goes here
`

MongoCommand.flags = {
  help: flags.help({char: 'h'}),

  awsSecretUrl: flags.string({
    char: 'a',
    description: 'aws secret containing mongo connection string',
    env: 'AWS_SECRET_MONGO_CONNECTION_URL',
    exclusive: ['url'],
  }),

  db: flags.string({
    char: 'b',
    description: 'the mongo database name',
    required: true,
    env: 'MONGO_DB',
  }),

  collection: flags.string({
    char: 'c',
    description: 'the mongo collection name',
    required: true,
    env: 'MONGO_COLLECTION',
  }),

  data: flags.string({
    char: 'd',
    description: 'the data for the query',
    required: false,
  }),

  filter: flags.string({
    char: 'f',
    description: 'the json filter string',
    required: true,
  }),

  // flag with no value (-f, --force)
  stdin: flags.boolean({
    char: 'i',
  }),

  method: flags.string({
    char: 'm',
    description: 'the mongo method',
    required: true,
  }),

  options: flags.string({
    char: 'o',
    description: 'the json operations string',
    required: false,
    default: '{}',
  }),

  projection: flags.string({
    char: 'p',
    description: 'the json projection string',
    required: false,
    default: '{}',
  }),

  url: flags.string({
    char: 'u',
    description: 'mongo connection string (URL)',
    env: 'MONGO_CONNECTION_URL',
    required: true,
    exclusive: ['aws-secret-url'],
  }),
}

module.exports = MongoCommand
