import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "../../../../db/authServer.ts";

const prisma = new PrismaClient();

// GET /api/bids/[id] - Get a specific bid
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const bid = await prisma.bid.findUnique({
      where: { id },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
            skills: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
            skills: true,
            details: true,
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    return NextResponse.json(bid);
  } catch (error) {
    console.error("Error fetching bid:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/bids/[id] - Delete a bid
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.client.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if bid exists
    const existingBid = await prisma.bid.findUnique({
      where: { id },
      include: {
        bidder: true,
        project: true,
      },
    });

    if (!existingBid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    // Only allow bidder to delete their own bid, and only if project is still open
    if (existingBid.bidder.email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (existingBid.project.status !== "open") {
      return NextResponse.json(
        { error: "Cannot delete bid on assigned/completed project" },
        { status: 400 }
      );
    }

    await prisma.bid.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Bid deleted successfully" });
  } catch (error) {
    console.error("Error deleting bid:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
