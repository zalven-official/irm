import { prisma } from "@/lib/prisma"
import argon2 from "argon2"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      email,
      password,
    } = body

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }
    const hashedPassword = await argon2.hash(password)
    const user = await prisma.user.create({
      data: {
        firstname: firstName,
        lastname: lastName,
        email,
        password: hashedPassword,
        role: "admin",
        birthday: new Date(),
      }
    })

    return NextResponse.json(
      { message: "Admin account created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("[ADMIN_CREATE_ERROR]", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
