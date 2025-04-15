import { NextResponse } from "next/server";
import { query, simpleQuery } from "../db/db";

export async function GET(request) {
  try {
    const billRequests = await query(`
      SELECT br.id, br.order_id, br.table_number, br.request_time, br.note, br.status,
             (SELECT SUM(oi.quantity * mi.price) 
              FROM order_items oi 
              JOIN menu_items mi ON oi.menu_item_id = mi.id 
              WHERE oi.order_id = br.order_id) as order_total
      FROM bill_requests br
      ORDER BY 
        CASE WHEN br.status = 'pending' THEN 0 ELSE 1 END,
        br.request_time DESC
    `);

    return NextResponse.json(billRequests);
  } catch (error) {
    console.error("Error fetching bill requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch bill requests", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { tableNumber, note } = await request.json();

    const orders = await query(
      `SELECT id FROM orders 
       WHERE table_number = ? AND status NOT IN ('completed', 'cancelled')
       LIMIT 1`,
      [tableNumber]
    );

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: "No active order found for this table" },
        { status: 400 }
      );
    }

    const orderId = orders[0].id;

    await query(
      `UPDATE orders SET bill_requested = 1, bill_time = NOW() WHERE id = ?`,
      [orderId]
    );

    const result = await query(
      `INSERT INTO bill_requests (order_id, table_number, request_time, note, status)
       VALUES (?, ?, NOW(), ?, 'pending')`,
      [orderId, tableNumber, note]
    );

    return NextResponse.json({
      success: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating bill request:", error);
    return NextResponse.json(
      { error: "Failed to create bill request", message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { billId, status } = await request.json();

    if (!billId || !status) {
      return NextResponse.json(
        { error: "Bill ID and status are required" },
        { status: 400 }
      );
    }

    await query(`UPDATE bill_requests SET status = ? WHERE id = ?`, [
      status,
      billId,
    ]);

    return NextResponse.json({
      success: true,
      message: `Bill status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating bill request:", error);
    return NextResponse.json(
      { error: "Failed to update bill request", message: error.message },
      { status: 500 }
    );
  }
}
