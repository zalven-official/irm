// app/api/users/admin/[id]/route.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import argon2d from 'argon2'

// UPDATE admin
export async function PUT(request: Request, { params }: { params: { id: string } }) {


  try {
    const body = await request.json()

    if (body.password && body.password !== body.confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 })
    }

    const updateData: any = {
      email: body.email,
      firstname: body.firstname,
      lastname: body.lastname,
      middlename: body.middlename
    }

    if (body.password) {
      updateData.password = await argon2d.hash(body.password)
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: parseInt(params.id), role: 'admin' },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        middlename: true,
        createdAt: true
      }
    })

    return NextResponse.json(updatedAdmin)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating admin', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE admin
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(params.id), role: 'admin' }
    })

    return NextResponse.json({ message: 'Admin deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting admin', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}