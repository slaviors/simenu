import { NextResponse } from "next/server";
import { query } from "../db/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableNumber = searchParams.get("table");
    const allOrders = searchParams.get("all") === "true";

    if (allOrders) {
      const orders = await query(`
        SELECT o.id, o.table_number, o.order_time, o.status, o.bill_requested
        FROM orders o
        WHERE o.status NOT IN ('completed', 'cancelled')
        ORDER BY o.order_time DESC
      `);

      for (const order of orders) {
        const items = await query(
          `
          SELECT oi.id, oi.menu_item_id, oi.quantity, oi.special_requests, oi.status,
                 mi.name, mi.price, mi.imageUrl
          FROM order_items oi
          JOIN menu_items mi ON oi.menu_item_id = mi.id
          WHERE oi.order_id = ?
        `,
          [order.id]
        );

        order.items = items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          special_requests: item.special_requests,
          status: item.status,
          menu_item: {
            id: item.menu_item_id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
          },
        }));
      }

      return NextResponse.json(orders);
    } else if (tableNumber) {
      const orderItems = await query(
        `
        SELECT oi.id, oi.quantity, oi.special_requests, oi.status,
               mi.id AS menu_item_id, mi.name, mi.price, mi.imageUrl
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE o.table_number = ? AND o.status NOT IN ('completed', 'cancelled')
        ORDER BY oi.id DESC
      `,
        [tableNumber]
      );

      const formattedItems = orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        specialRequests: item.special_requests,
        status: item.status,
        menuItem: {
          id: item.menu_item_id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        },
      }));

      return NextResponse.json(formattedItems);
    }

    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", message: error.message },
      { status: 500 }
    );
  }
}
