/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import moment from 'moment'
import winston, { Logger as LoggerWinton } from 'winston'
import { Time } from '../constant/time'
import { dateFormat } from './format'

export class Logger {
  private readonly createFile: LoggerWinton
  private subMethod = ''

  constructor (
    method: string,
    trackId: string = ''
  ) {
    this.createFile = winston.createLogger({
      format: winston.format.printf((info: winston.Logform.TransformableInfo) => {
        const level = info.level.toUpperCase()
        const logTime = moment().format('dddd, MMMM D YYYY, h:mm:ss a')
        const message = info.message
        const methods = this.subMethod ? `${method} -> ${this.subMethod}` : `${method}`
        const lineLog = `${logTime} | ${level} | ${trackId} | ${methods} | ${message}`
        return lineLog
      }),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.combine(
            winston.format.colorize({
              all: true
            })
          ))
        }),
        new winston.transports.File({
          filename: `./logs/${dateFormat(Time.YEAR)}-${dateFormat(Time.MONTH)}-${dateFormat(Time.DAY)}/tracking.log`
        })
      ]
    })
  }

  debug (message: string, payload?: any): void {
    this.createFile.log('debug', this.transformMsg(message, payload))
  }

  info (message: string, payload: any = null): void {
    this.createFile.log('info', this.transformMsg(message, payload))
  }

  error (message: any): void {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.createFile.log('error', `\n === STACK === \n ${message.stack} \n  === NAME === \n ${message.name} \n === MESSAGE === \n ${message.message}`)
  }

  addSubMethod (subMethod: string): void {
    this.subMethod = subMethod
  }

  cleanSubMethod (): void {
    this.subMethod = ''
  }

  private transformMsg (message: string, payload?: any): string {
    let msg = message
    if (payload) {
      msg += ` ${JSON.stringify(payload, null, 4)}`
    }

    return msg
  }
}
