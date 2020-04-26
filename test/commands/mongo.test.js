/* eslint-disable array-element-newline */
const {expect, test} = require('@oclif/test')

// const testConfig = {
//   awsProfile: process.env.AWS_PROFILE,
// }

describe('mongo', () => {
  test
  .stdout()
  .command([
    'mongo',
    '-u', process.env.MONGO_URI || 'mongodb://localhost:27018',
    '-b', 'test',
    '-c', 'todo',
    '-m', 'updateOne',
    '-q', '{"id": "123"}',
    '-d', '{"$set": {"id": "123", "title": "buy toothpaste"}}',
    '-o', '{"upsert": true}',
  ])
  .it('mongo upsert', ctx => {
    expect(ctx.stdout).to.contain('nModified')
  })

  test
  .stdout()
  .command([
    'mongo',
    '-u', process.env.MONGO_URI || 'mongodb://localhost:27018',
    '-b', 'test',
    '-c', 'todo',
    '-m', 'updateOne',
    '-q', '{"id": "123"}',
    '-d', '{"$set": "placeholder"}',
    '-i', '$set',
    '-f', './test/data/input.json',
    '-o', '{"upsert": true}',
  ])
  .it('mongo upsert from input file', ctx => {
    expect(ctx.stdout).to.contain('nModified')
  })

  test
  .stdout()
  .command([
    'mongo',
    '-u', process.env.MONGO_URI || 'mongodb://localhost:27018',
    '-b', process.env.MONGO_DB || 'test',
    '-c', process.env.MONGO_COLLECTION || 'todo',
    '-m', 'findOne',
    '-q', `{"id": "${process.env.RECORD_ID || '123'}"}`,
  ])
  .it('mongo read by id', ctx => {
    expect(ctx.stdout).to.contain('toothpaste')
  })

  test
  .stdout()
  .command([
    'mongo',
    // '-l', testConfig.awsProfile || 'your-aws-profile-name-here',
    '-r', 'us-west-2',
    '-s', 'test-mongo-local',
    '-b', 'test',
    '-c', 'todo',
    '-m', 'findOne',
    '-q', '{"id": "123"}',
  ])
  .it('mongo read by id from secret url', ctx => {
    expect(ctx.stdout).to.contain('toothpaste')
  })
})
