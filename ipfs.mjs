import ipfsClient from 'ipfs-http-client'

const { IPFS_ADDR, IPFS_PORT } = process.env
const ipfs = ipfsClient({ host: IPFS_ADDR, port: IPFS_PORT, protocol: 'http' })

export default ipfs