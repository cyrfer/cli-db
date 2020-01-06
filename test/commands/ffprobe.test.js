const {expect, test} = require('@oclif/test')

describe('ffprobe', () => {
  test
  .stdout()
  .command(['ffprobe', 'test/data/media/sample.mp4'])
  .it('ffprobe sample', ctx => {
    expect(ctx.stdout).to.contain('streams')
  })
})
