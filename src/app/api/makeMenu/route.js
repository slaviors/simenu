import { NextResponse } from "next/server";
import { query } from "../db/db";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const category = formData.get("category");
    const image = formData.get("image");

    let imageUrl = "";
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `menu_${Date.now()}_${image.name.replace(/\s+/g, "_")}`;

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: fileName,
        folder: "/simenu/menu",
        useUniqueFileName: true,
        responseFields: ["url"],
        transformation: {
          pre: "format-png",
        },
      });
      imageUrl = uploadResponse.url;
    }

    const result = await query(
      `INSERT INTO menu_items (name, description, price, category, imageUrl, active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [name, description, price, category, imageUrl]
    );

    return NextResponse.json({
      success: true,
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const category = formData.get("category");
    const image = formData.get("image");

    const [menuItem] = await query(
      "SELECT imageUrl FROM menu_items WHERE id = ?",
      [id]
    );

    let imageUrl = menuItem.imageUrl;
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `menu_${Date.now()}_${image.name.replace(/\s+/g, "_")}`;

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: fileName,
        folder: "/simenu/menu",
        useUniqueFileName: true,
        responseFields: ["url"],
        transformation: {
          pre: "format-png",
        },
      });

      imageUrl = uploadResponse.url;
    }

    await query(
      `UPDATE menu_items 
       SET name = ?, description = ?, price = ?, category = ?, imageUrl = ? 
       WHERE id = ?`,
      [name, description, price, category, imageUrl, id]
    );

    return NextResponse.json({
      success: true,
      id: id,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}
