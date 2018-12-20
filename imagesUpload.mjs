import multiparty from 'multiparty'
import ipfs from './ipfs'
import fs from 'fs'

export default function imagesUpload () {
  return (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        sendError(res, err)
        return
      }

      if (!files.imageFiles && !files.imageFiles.length && files.imageFiles.length === 0) { res.sendStatus(400) }

      try {
        const respFiles = await Promise.all(files.imageFiles.map(async file => {
          const { path } = file
					const data = fs.readFileSync(path)
          const result = await ipfs.add(data)
          return `https://gateway.ipfs.io/ipfs/${result[0].hash}/`
        }))
        res.send(respFiles)
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

