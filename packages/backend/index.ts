import { Server } from './src/Server'

const server = new Server({
    ws: true,
})

server.start()
