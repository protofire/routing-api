import * as path from 'path'
import bunyan from 'bunyan'

export function getDevErrorStreams(): bunyan.Stream[] {
  if (process.env.NODE_ENV === 'production') return []
  const logPath = process.env.DEV_ERRORS_LOG || path.resolve(process.cwd(), 'dev-errors.log')
  return [{ level: 'error', path: logPath }]
}
