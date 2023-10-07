import { readFileSync, existsSync } from "fs"
import { join } from 'path'
import { Client } from 'pg'
export const Queries = async function (client: Client) {
  let path = join(__dirname, './queries.sql')
  if (existsSync(path)) {
    const updateTriggerQuery = readFileSync(path, 'utf-8')
    await client.query(updateTriggerQuery)
  }
}