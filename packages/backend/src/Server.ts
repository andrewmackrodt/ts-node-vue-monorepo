import { CorsOptions } from 'cors'
import { Server as HttpServer, createServer } from 'http'

import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import morgan from 'morgan'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session')

export interface ServerOptions {
    compression?: boolean
    cookieSessionKey?: null | string | string[]
    cors?: boolean | CorsOptions
    hostname?: string
    port?: number
    staticPath?: string
    staticProxy?: string
    timeout?: number
    trustProxy?: boolean
}

export class Server {
    public static readonly DEFAULT_PORT: number = 5000

    private readonly options: Required<ServerOptions>
    private readonly app: express.Application
    private readonly httpServer: HttpServer

    public constructor(options?: ServerOptions) {
        this.options = {
            compression: true,
            cookieSessionKey: null,
            cors: true,
            hostname: '0.0.0.0',
            port: 0,
            staticPath: 'public',
            staticProxy: 'http://127.0.0.1:8080',
            timeout: 120000,
            trustProxy: true,
            ...options,
        }

        this.app = this.createApp()
        this.httpServer = this.createHttpServer()
    }

    public start(): void {
        this.httpServer.listen(this.getPort(), this.options.hostname, () => {
            console.log('Running server on port %s', this.getPort())
        })
    }

    protected getPort(): number {
        if (this.options.port !== 0) {
            return this.options.port
        }

        if ( ! process.env.PORT || process.env.PORT === '0' || process.env.PORT.length === 0) {
            return Server.DEFAULT_PORT
        }

        const parsed = Number.parseInt(process.env.PORT)

        if (Number.isNaN(parsed)) {
            throw new Error('process.env.PORT must be a number')
        }

        return parsed
    }

    protected createApp(): express.Express {
        const app = express()

        app.disable('x-powered-by')

        if (this.options.trustProxy) {
            app.set('trust proxy', true)
        }

        app.use(bodyParser.json())

        if (this.options.compression) {
            app.use(compression())
        }

        if (this.options.cookieSessionKey) {
            let keys = this.options.cookieSessionKey

            if (typeof keys === 'string') {
                keys = [keys]
            }

            app.use(cookieSession({ keys }))
        }

        if (this.options.cors) {
            if (typeof this.options.cors === 'object') {
                app.use(cors(this.options.cors))
            } else {
                app.use(cors())
            }
        }

        app.use(morgan('combined'))

        if (fs.existsSync(`${this.options.staticPath}/index.html`)) {
            app.use(express.static(this.options.staticPath))

            const index = fs.realpathSync(`${this.options.staticPath}/index.html`)

            app.use('*', (req, res, next) => {
                res.sendFile(index)
            })
        } else {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const createProxyMiddleware = require('http-proxy-middleware').createProxyMiddleware

            app.use('*', createProxyMiddleware({
                target: this.options.staticProxy,
                changeOrigin: true,
                ws: false,
            }))
        }

        return app
    }

    protected createHttpServer(): HttpServer {
        const server = createServer(this.app)
        server.setTimeout(this.options.timeout)

        return server
    }
}
