import { NextResponse } from "next/server";
import { query, simpleQuery } from "../db/db";

export async function PUT(request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "preparing",
      "ready",
      "delivered",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    await simpleQuery("START TRANSACTION");

    const orderItems = await query(`SELECT id FROM order_items WHERE id = ?`, [
      orderId,
    ]);

    if (!orderItems || orderItems.length === 0) {
      await simpleQuery("ROLLBACK");
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );
    }

    await query(`UPDATE order_items SET status = ? WHERE id = ?`, [
      status,
      orderId,
    ]);

    const orderIdResult = await query(
      `SELECT order_id FROM order_items WHERE id = ?`,
      [orderId]
    );

    if (orderIdResult && orderIdResult.length > 0) {
      const mainOrderId = orderIdResult[0].order_id;

      await query(`UPDATE orders SET status = ? WHERE id = ?`, [
        status,
        mainOrderId,
      ]);
    }

    await simpleQuery("COMMIT");

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    await simpleQuery("ROLLBACK");
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order", message: error.message },
      { status: 500 }
    );
  }
}
