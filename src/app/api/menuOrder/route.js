import { NextResponse } from "next/server";
import { query, simpleQuery } from "../db/db";

export async function POST(request) {
  try {
    const { tableNumber, menuItemId, quantity, specialRequests } =
      await request.json();

    await simpleQuery("START TRANSACTION");

    let orderId;
    const existingOrders = await query(
      `SELECT id FROM orders 
       WHERE table_number = ? AND status NOT IN ('completed', 'cancelled')
       LIMIT 1`,
      [tableNumber]
    );

    if (existingOrders && existingOrders.length > 0) {
      orderId = existingOrders[0].id;
    } else {
      const newOrder = await query(
        `INSERT INTO orders (table_number, order_time, status)
         VALUES (?, NOW(), 'pending')`,
        [tableNumber]
      );
      orderId = newOrder.insertId;
    }

    await query(
      `INSERT INTO order_items (order_id, menu_item_id, quantity, special_requests, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [orderId, menuItemId, quantity, specialRequests]
    );

    await simpleQuery("COMMIT");

    return NextResponse.json({
      success: true,
      orderId: orderId,
    });
  } catch (error) {
    await simpleQuery("ROLLBACK");
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
