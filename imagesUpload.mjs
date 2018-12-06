import multiparty from 'multiparty'
import ipfs from './ipfs'

export default function imagesUpload () {
  return (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
      if (err) {
        sendError(res, err)
        return
      }

      if (!files.imageFiles && files.imageFiles.length === 0) { res.sendStatus(400) }

      try {
        const respFiles = files.imageFiles.map(async file => {
					const { path } = file
					const data = fs.readFileSync(path)
					// const result = await ipfs.add(data)
					console.info('done', result)
					res.send(respFiles)
        })
      } catch (err) {
        sendError(res, err)
      }
    })
  }
}

function sendError (res, error) {
  const err = new Error(error)
  console.error(err)
  res.sendStatus(400)
}

