import nodemailer from "nodemailer"

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

const getTransporter = () => {
  if (transporter) return transporter
  const email = process.env.EMAIL
  const pass = process.env.PASS
  if (!email || !pass) {
    console.warn('Mailer not configured: EMAIL/PASS missing')
    return null
  }
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: email, pass },
  })
  return transporter
}

export const sendMail = async (to: string, subject: string, html: string) => {
  const t = getTransporter()
  if (!t) {
    console.warn('Skipping sendMail — transporter not configured')
    return
  }
  await t.sendMail({
    from: `"Snapcart" <${process.env.EMAIL}> `,
    to,
    subject,
    html,
  })
}