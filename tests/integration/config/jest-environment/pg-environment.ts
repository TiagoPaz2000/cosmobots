import NodeEnvironment from 'jest-environment-node'
const { resolve } = require("path")
const { Client } = require("pg")

require("dotenv").config({
  path: resolve(".env.test"),
})

class CustomEnvironment extends NodeEnvironment {
  public dbUser: string | undefined
  public dbHost: string | undefined
  public dbName: string | undefined
  public dbPassword: string | undefined
  public dbPort: string | undefined
  constructor(config: any, context: any) {
    super(config, context)
    this.dbUser = process.env.DB_USER
    this.dbHost = process.env.DB_HOST
    this.dbName = process.env.DB_NAME
    this.dbPassword = process.env.DB_PASSWORD
    this.dbPort = process.env.DB_PORT
  }

  async setup() {
    await super.setup();
    process.env.DB_USER = this.dbUser
    process.env.DB_HOST = this.dbHost
    process.env.DB_NAME = this.dbName
    process.env.DB_PASSWORD = this.dbPassword
    process.env.DB_PORT = this.dbPort

    this.global.process.env.DB_USER = this.dbUser
    this.global.process.env.DB_HOST = this.dbHost
    this.global.process.env.DB_NAME = this.dbName
    this.global.process.env.DB_PASSWORD = this.dbPassword
    this.global.process.env.DB_PORT = this.dbPort
  }

  async teardown() {    
    const client = new Client({
      user: this.dbUser,
      host: this.dbHost,
      database: this.dbName,
      password: this.dbPassword,
      port: Number(this.dbPort),
    })

    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.dbName}" CASCADE`)
    await client.end()
  }
}

module.exports = CustomEnvironment