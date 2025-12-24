import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req:NextRequest) {
    const sig=req.headers.get("stripe-signature")
    const rawBody=await req.text()
    let event;
    try {
             const stripeSecret = process.env.STRIPE_SECRET_KEY
             if (!stripeSecret) {
                 console.error('Stripe secret not configured')
                 return NextResponse.json({ message: 'Stripe secret not configured' }, { status: 500 })
             }
             const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })
                 const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
                 if (!webhookSecret) {
                    console.error('Stripe webhook secret not configured')
                    return NextResponse.json({ message: 'Stripe webhook secret not configured' }, { status: 500 })
                 }
                 event = stripe.webhooks.constructEvent(
                     rawBody, sig!, webhookSecret
                 )
    } catch (error) {
        console.error("signature verification failed",error)
    }

    if(event?.type==="checkout.session.completed"){
        const session=event.data.object
        await connectDb()
        await Order.findByIdAndUpdate(session?.metadata?.orderId,{
            isPaid:true
        })
    }

    return NextResponse.json({recieved:true},{status:200})

}