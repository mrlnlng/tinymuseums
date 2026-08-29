import { appendFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { BRAND } from './brand.ts'
import { env } from './env.ts'

/**
 * Outbound email.
 *
 * Console or file locally, SES later. Following an artist is the only reason
 * this exists, and it is the one thing that brings an organic visitor back —
 * so it is a real interface rather than a console.log at the call site.
 */

export interface Message {
  to: string
  subject: string
  body: string
}

export interface Mailer {
  send(message: Message): Promise<void>
}

class ConsoleMailer implements Mailer {
  async send(message: Message): Promise<void> {
    console.log(
      `\n--- mail ---\nto:      ${message.to}\nsubject: ${message.subject}\n\n${message.body}\n------------\n`,
    )
  }
}

class FileMailer implements Mailer {
  private path = resolve('./.data/mail/outbox.log')

  async send(message: Message): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true })
    await appendFile(
      this.path,
      `${new Date().toISOString()}\nto: ${message.to}\nsubject: ${message.subject}\n\n${message.body}\n\n---\n\n`,
    )
  }
}

let mailer: Mailer | null = null

export function getMailer(): Mailer {
  if (!mailer) mailer = env.mailTransport === 'file' ? new FileMailer() : new ConsoleMailer()
  return mailer
}

export function followConfirmation(artistName: string, confirmToken: string): Omit<Message, 'to'> {
  const url = `${env.publicBaseUrl}/follow/confirm?token=${confirmToken}`
  return {
    subject: `Confirm you want to hear from ${artistName}`,
    body: [
      `You asked to be told when ${artistName} hangs new work in ${BRAND}.`,
      '',
      `Confirm here: ${url}`,
      '',
      'If this was not you, ignore this and nothing happens.',
    ].join('\n'),
  }
}

export function newWorkNotice(
  artistName: string,
  slug: string,
  unsubscribeToken: string,
): Omit<Message, 'to'> {
  return {
    subject: `${artistName} has hung new work`,
    body: [
      `${artistName} has put something new on the wall.`,
      '',
      `Go and look: ${env.publicBaseUrl}/a/${slug}`,
      '',
      `Stop these emails: ${env.publicBaseUrl}/follow/unsubscribe?token=${unsubscribeToken}`,
    ].join('\n'),
  }
}

export function inquiryNotice(
  pieceTitle: string,
  fromEmail: string,
  body: string,
): Omit<Message, 'to'> {
  return {
    subject: `Someone asked about "${pieceTitle}"`,
    body: [
      `A visitor asked about "${pieceTitle}".`,
      '',
      `From: ${fromEmail}`,
      '',
      body,
      '',
      `Reply to them directly — ${BRAND} is not involved in the sale.`,
    ].join('\n'),
  }
}
