import { NextResponse } from 'next/server';
import { query } from '../db/db';

export async function GET(request) {
  try {
    const menuItems = await query(
      "SELECT * FROM menu_items WHERE active = 1 ORDER BY id DESC"
    );
    
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}