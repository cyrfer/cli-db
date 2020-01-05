const {Command, flags} = require('@oclif/command')
const Ffmpeg = require('fluent-ffmpeg')

const runProbe = async ({args}) => {
  return new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(args.INPUT_FILE, (err, metadata) => {
      if (err) {
        return reject(err)
      }
      resolve(metadata)
    })
  })
}

class FfprobeCommand extends Command {
  async run() {
    const {args} = this.parse(FfprobeCommand)
    // this.log(`args: ${JSON.stringify(args)}`)
    const metadata = await runProbe({args})
    this.log(JSON.stringify(metadata))
  }
}

FfprobeCommand.description = `Media utils - ffprobe
Perform content tasks

Requires the 'ffmpeg' package for your OS:
- mac: brew install ffmpeg
- debian/ubuntu: apt install ffmpeg
`

FfprobeCommand.flags = {
  help: flags.help({char: 'h'}),
}

FfprobeCommand.args = [
  {
    name: 'INPUT_FILE',
    required: true,
    description: 'local path or URL to a file',
  },
]

FfprobeCommand.examples = [
  `
AFILE=s3://YOUR-BUCKET/YOUR-FILE.mp4
SECONDS=60
cli-db ffprobe $(aws s3 presign $AFILE --expires-in $SECONDS --profile YOUR-AWS-PROFILE) | jq '.'
`,
]

module.exports = FfprobeCommand
