const {Command, flags} = require('@oclif/command')
const {setupDataStore, shutdownDataStore} = require('../db/mongo')
const AWS = require('aws-sdk')

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

    const credentials = new AWS.SharedIniFileCredentials({profile: flags.awsProfile})
    const secrets = flags.awsRegion && new AWS.SecretsManager({region: flags.awsRegion, credentials})
    const client = await setupDataStore({url: flags.url, secretUrl: flags.awsSecretUrl}, {secrets})

    const collection = client.db(flags.db).collection(flags.collection)
    const parsed = methodArgs[flags.method].reduce(parseReducer(flags), {})
    const mArgs = methodArgs[flags.method].map(a => parsed[a])
    // this.log(`db.${flags.collection}.${flags.method}( ${JSON.stringify(mArgs)} ) on [${flags.url || flags.awsSecretUrl}/${flags.db}/${flags.collection}],`)
    const result = await collection[flags.method](...mArgs)
    this.log(JSON.stringify(result))
    shutdownDataStore()
  }
}

MongoCommand.description = `Interact with MongoDb
Specify reads, writes, aggregations, with AWS integration to support secret connection strings
----------------

EXAMPLE - upsert

cli-db mongo \\
 -u 'mongodb://localhost:27018' \\
 -b 'test' \\
 -c 'todo' \\
 -m 'updateOne' \\
 -q '{"id": "123"}' \\
 -d '{"$set": {"id": "123", "title": "buy toothpaste"}}' \\
 -o '{"upsert": true}'

----------------

EXAMPLE - read from secret connection

cli-db mongo \\
 -l 'your-aws-profile-name-here' \\
 -s 'test-mongo-local' \\
 -r 'us-west-2' \\
 -b 'test' \\
 -c 'todo' \\
 -m 'findOne' \\
 -q '{"id": "123"}'
`

MongoCommand.flags = {
  help: flags.help({char: 'h'}),

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

  awsProfile: flags.string({
    char: 'l',
    description: 'aws profile containing secrets',
    env: 'AWS_PROFILE',
    required: false,
    dependsOn: ['awsSecretUrl'],
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

  awsRegion: flags.string({
    char: 'r',
    description: 'aws region containing secrets',
    env: 'AWS_SECRET_MONGO_CONNECTION_URL',
    required: false,
    dependsOn: ['awsSecretUrl'],
    exclusive: ['url'],
  }),

  awsSecretUrl: flags.string({
    char: 's',
    description: 'aws secret containing mongo connection string',
    env: 'AWS_SECRET_MONGO_CONNECTION_URL',
    required: false,
    dependsOn: ['awsRegion'],
    exclusive: ['url'],
  }),

  url: flags.string({
    char: 'u',
    description: 'mongo connection string (URL)',
    env: 'MONGO_CONNECTION_URL',
    required: false,
    exclusive: ['aws-secret-url'],
  }),
}

module.exports = MongoCommand
