import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const church = await prisma.church.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        images: true,
        User: true
      }
    })

    if (!church) {
      return NextResponse.json({ error: 'Church not found' }, { status: 404 })
    }

    return NextResponse.json(church)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch church' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const updateData: any = {
      address: body.address,
      latitude: body.latitude ? parseInt(body.latitude) : undefined,
      longitude: body.longitude ? parseInt(body.longitude) : undefined
    }

    // Handle image updates
    if (body.images) {
      // Delete existing images
      await prisma.churchImage.deleteMany({
        where: { churchId: parseInt(params.id) }
      })

      // Create new images
      updateData.images = {
        create: body.images.map((image: string) => ({ image }))
      }
    }

    const updatedChurch = await prisma.church.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        images: true
      }
    })

    return NextResponse.json(updatedChurch)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update church' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete images first
    await prisma.churchImage.deleteMany({
      where: { churchId: parseInt(params.id) }
    })

    // Then delete church
    await prisma.church.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Church deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete church' },
      { status: 500 }
    )
  }
}