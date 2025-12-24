import { auth } from '@/auth'
import connectDb from '@/lib/db'
import Order from '@/models/order.model'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDb()
    const session = await auth()
    const deliveryBoyId = session?.user?.id
    if (!deliveryBoyId) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
    }

    // compute last 7 days range
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - 6) // 6 days before today -> 7 days total

    // fetch delivered orders for this delivery boy in the last 7 days
    const orders = await Order.find({
      assignedDeliveryBoy: deliveryBoyId,
      deliveryOtpVerification: true,
      deliveredAt: { $gte: start }
    }).lean()

    // map days
    const days: { name: string; earnings: number; deliveries: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const name = d.toLocaleDateString(undefined, { weekday: 'short' })
      days.push({ name, earnings: 0, deliveries: 0 })
    }

    // aggregate orders into days (use fixed earning per delivery - 40)
    for (const o of orders) {
      if (!o.deliveredAt) continue
      const delivered = new Date(o.deliveredAt)
      // compute index: 0..6 where 6 is today
      const diff = Math.floor((new Date().setHours(0,0,0,0) - new Date(delivered).setHours(0,0,0,0)) / (1000*60*60*24))
      // diff is today - delivered (in days) but negative if delivered in future; compute idx
      const daysAgo = Math.floor((new Date().setHours(0,0,0,0) - new Date(delivered).setHours(0,0,0,0)) / (1000*60*60*24))
      const idx = 6 - daysAgo
      if (idx >= 0 && idx < 7) {
        days[idx].deliveries += 1
        days[idx].earnings += 40
      }
    }

    return NextResponse.json(days, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: `earnings error ${error}` }, { status: 500 })
  }
}
