import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prismaClient";

export async function POST(request: NextRequest) {
  try {
    console.log("=== WEBHOOK RECEIVED ===");

    const body = await request.json();
    console.log("Full webhook payload:", JSON.stringify(body, null, 2));

    // Supabase webhook payload structure
    const { type, table, record, old_record } = body;

    console.log(`Webhook details: table="${table}", type="${type}"`);
    console.log(`Record ID: ${record?.id}`);
    console.log(`Old email: ${old_record?.email}`);
    console.log(`New email: ${record?.email}`);

    // Only handle auth.users table updates (table name might be just "users" from auth.users)
    if (table !== "users" || type !== "UPDATE") {
      console.log(`❌ Ignoring webhook: table=${table}, type=${type}`);
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    // Check if email actually changed
    if (!old_record || !record || old_record.email === record.email) {
      console.log("❌ No email change detected, skipping sync");
      return NextResponse.json(
        { message: "No email change detected" },
        { status: 200 }
      );
    }

    console.log(
      `✅ Email change detected: ${old_record.email} -> ${record.email} for user ${record.id}`
    );

    // Update the email in your Prisma database
    const updatedUser = await prisma.user.update({
      where: { id: record.id },
      data: {
        email: record.email,
        updatedAt: new Date(),
      },
    });

    console.log(`🎉 Successfully synced email for user ${record.id}`);

    return NextResponse.json(
      {
        message: "Email synced successfully",
        userId: record.id,
        newEmail: record.email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Webhook error:", error);

    // If user doesn't exist in Prisma, that's okay
    if (error.code === "P2025") {
      console.log("User not found in Prisma database, ignoring");
      return NextResponse.json(
        { message: "User not found, ignored" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: "Webhook failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Test endpoint to simulate webhook locally
export async function GET(request: NextRequest) {
  console.log("Testing webhook locally...");

  // Simulate a Supabase webhook payload
  const testPayload = {
    type: "UPDATE",
    table: "users",
    record: {
      id: "ffbbdc9a-f2f1-4508-a63a-f512e847f3bb",
      email: "test-webhook-sync@example.com",
    },
    old_record: {
      id: "ffbbdc9a-f2f1-4508-a63a-f512e847f3bb",
      email: "kakkaraaryan3@gmail.com",
    },
  };

  // Call the POST method with test data
  const testRequest = new NextRequest(
    "http://localhost:3000/api/webhooks/sync-user",
    {
      method: "POST",
      body: JSON.stringify(testPayload),
      headers: { "Content-Type": "application/json" },
    }
  );

  const response = await POST(testRequest);
  const result = await response.json();

  return NextResponse.json({
    message: "Webhook test completed",
    testPayload,
    webhookResult: result,
  });
}
