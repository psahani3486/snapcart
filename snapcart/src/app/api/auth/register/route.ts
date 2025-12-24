import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
            await connectDb()
            const body = await req.json().catch(() => null)
            if (!body) {
                return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
            }

            const { name, email, password, role } = body as { name?: string; email?: string; password?: string; role?: string }

            if (!name || !email || !password) {
                return NextResponse.json({ message: "name, email and password are required" }, { status: 400 })
            }

            // validation rules: name alphabet + spaces, valid email, password alphanumeric and min length
            const nameRegex = /^[A-Za-z\s]+$/
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const passwordRegex = /^[A-Za-z0-9]+$/

            if (!nameRegex.test(name)) {
                return NextResponse.json({ message: "name must contain only letters and spaces" }, { status: 400 })
            }

            if (!emailRegex.test(email)) {
                return NextResponse.json({ message: "invalid email format" }, { status: 400 })
            }

            if (typeof password !== "string" || password.length < 6 || !passwordRegex.test(password)) {
                return NextResponse.json({ message: "password must be at least 6 characters and alphanumeric only" }, { status: 400 })
            }

            const existUser = await User.findOne({ email }).lean()
            if (existUser) {
                return NextResponse.json({ message: "email already exists" }, { status: 400 })
            }

            // allowed roles: user, deliveryBoy, admin; default to 'user' if invalid/missing
            const allowedRoles = ["user","deliveryBoy","admin"]
            const userRole = role && allowedRoles.includes(role) ? role : "user"

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({ name, email, password: hashedPassword, role: userRole })

            // remove password before returning
            const userObj = user.toObject ? user.toObject() : user
            delete userObj.password

            return NextResponse.json(userObj, { status: 200 })
        
    } catch (error) {
         console.error("Register error:", error)
         return NextResponse.json({ message: `register error` }, { status: 500 })
    }
}
// connect db
// name,email,password frontend
// email check
// password 6 character
//password hash
// user create
