/* eslint-disable array-element-newline */
const {expect, test} = require('@oclif/test')

const testConfig = {
  awsProfile: process.env.AWS_PROFILE,
}

describe('mongo', () => {
  test
  .stdout()
  .command([
    'mongo',
    '-u', 'mongodb://localhost:27018',
    '-b', 'test',
    '-c', 'todo',
    '-m', 'updateOne',
    '-f', '{"id": "123"}',
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
    '-u', 'mongodb://localhost:27018',
    '-b', 'test',
    '-c', 'todo',
    '-m', 'findOne',
    '-f', '{"id": "123"}',
  ])
  .it('mongo read by id', ctx => {
    expect(ctx.stdout).to.contain('toothpaste')
  })

  test
  .stdout()
  .command([
    'mongo',
    '-l', testConfig.awsProfile || 'your-aws-profile-name-here',
    '-s', 'test-mongo-local',
    '-r', 'us-west-2',
    '-b', 'test',
    '-c', 'todo',
    '-m', 'findOne',
    '-f', '{"id": "123"}',
  ])
  .it('mongo read by id from secret url', ctx => {
    expect(ctx.stdout).to.contain('toothpaste')
  })
})
