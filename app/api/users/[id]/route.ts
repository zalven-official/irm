import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Check if church exists if provided
    if (body.churchId) {
      const existingChurch = await prisma.church.findUnique({
        where: { id: body.churchId }
      });
      if (!existingChurch) {
        return NextResponse.json(
          { error: 'Church not found' },
          { status: 404 }
        );
      }
    }

    // Check if position exists if provided
    if (body.positionId) {
      const existingPosition = await prisma.position.findUnique({
        where: { id: body.positionId }
      });
      if (!existingPosition) {
        return NextResponse.json(
          { error: 'Position not found' },
          { status: 404 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        ...body,
        birthday: body.birthday ? new Date(body.birthday) : undefined,
        church: body.churchId ? { connect: { id: body.churchId } } : undefined,
        position: body.positionId ? { connect: { id: body.positionId } } : undefined,
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
        church: true,
        position: true,
        children: true,
        eudcationalAttainment: true,
        cases: true,
        subject: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}