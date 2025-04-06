// app/api/churches/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
// GET single church by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const church = await prisma.church.findUnique({
      where: { id: parseInt(params.id) },
      include: { images: true }
    })

    if (!church) {
      return NextResponse.json({ message: 'Church not found' }, { status: 404 })
    }

    return NextResponse.json(church)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching church', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PUT update church and its images
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { images, ...churchData } = body

    const updatedChurch = await prisma.$transaction([
      prisma.church.update({
        where: { id: parseInt(params.id) },
        data: churchData
      }),
      prisma.churchImage.deleteMany({
        where: { churchId: parseInt(params.id) }
      }),
      prisma.churchImage.createMany({
        data: (images || []).map((image: any) => ({
          ...image,
          churchId: parseInt(params.id)
        }))
      })
    ])

    const churchWithImages = await prisma.church.findUnique({
      where: { id: parseInt(params.id) },
      include: { images: true }
    })

    return NextResponse.json(churchWithImages)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating church', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE church and its images
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.church.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Church deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting church', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}