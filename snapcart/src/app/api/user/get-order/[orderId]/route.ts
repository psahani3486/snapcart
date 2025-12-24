import connectDb from "@/lib/db"
import Order from "@/models/order.model"
import DeliveryAssignment from "@/models/deliveryAssignment.model"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDb()
        const { orderId } = await params
        console.log(orderId)
        const order=await Order.findById(orderId).populate("assignedDeliveryBoy")
        if(!order){
            return NextResponse.json(
                { message: "order not found" },
               { status: 404 }
            )
        }
        // also fetch assignment details if present
        let assignment = null
        if (order.assignment) {
            assignment = await DeliveryAssignment.findById(order.assignment).populate('assignedTo')
        }

        return NextResponse.json(
                { order, assignment },
               {status:200}
            )
    } catch (error) {
        return NextResponse.json(
                {message:`get order by id error ${error}`},
               {status:500}
            )
    }
}