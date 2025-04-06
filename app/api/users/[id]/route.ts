import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        church: true,
        position: true,
        children: true,
        eudcationalAttainment: true,
        cases: true,
        subject: true
      }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        ...body,
        birthday: body.birthday ? new Date(body.birthday) : undefined,
        children: body.children ? {
          deleteMany: {},
          createMany: { data: body.children }
        } : undefined,
        eudcationalAttainment: body.eudcationalAttainment ? {
          deleteMany: {},
          createMany: { data: body.eudcationalAttainment }
        } : undefined,
        cases: body.cases ? {
          deleteMany: {},
          createMany: { data: body.cases }
        } : undefined,
        subject: body.subject ? {
          deleteMany: {},
          createMany: { data: body.subject }
        } : undefined
      },
      include: {
        children: true,
        eudcationalAttainment: true,
        cases: true,
        subject: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(params.id) }
    })
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}