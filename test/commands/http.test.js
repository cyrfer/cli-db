/* eslint-disable array-element-newline */
const {expect, test} = require('@oclif/test')
const fs = require('fs')

// mockapi.io configured at:
// https://www.mockapi.io/projects/5e35fb4af7e55d0014ad4fb5
const url = process.env.TEST_REST_URL


describe('http', () => {
  test
  .stdout()
  .command([
    'http',
    process.env.TEST_GRAPHQL_URL,
    '-X', 'POST',
    '-H', 'Content-Type: applicaton/json',
    '--aws-access-key-id', process.env.AWS_ACCESS_KEY_ID,
    '--aws-secret-access-key', process.env.AWS_SECRET_ACCESS_KEY,
    '--aws-service', 'appsync',
    '--aws-region', 'us-west-2',
    '-d', JSON.stringify({
      // required
      query: fs.readFileSync(process.env.TEST_GRAPHQL_QUERY).toString(),
      // optional
      variables: process.env.TEST_GRAPHQL_VARIABLES && fs.readFileSync(process.env.TEST_GRAPHQL_VARIABLES).toString(),
    }),
  ])
  .it('should sign with aws creds', ctx => {
    const parsed = JSON.parse(ctx.stdout)
    expect(parsed.data).to.be.a('object')
  })

  test
  .stdout()
  .command([
    'http',
    url + '/posts',
    '-X', 'post',
    '-d', JSON.stringify({
      title: 'from test title',
      content: 'from test content',
    }),
  ])
  .it('should post', ctx => {
    const parsed = JSON.parse(ctx.stdout)
    expect(parsed.id).to.be.a('string')
  })

  test
  .stdout()
  .command([
    'http',
    url + '/posts',
    '-X', 'get',
  ])
  .it('should get', ctx => {
    const parsed = JSON.parse(ctx.stdout)
    expect(ctx.stdout).to.be.true(Array.isArray(parsed))
  })

})
