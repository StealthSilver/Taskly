import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Todo } from "@/app/models/Todo";

// GET todos with pagination
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);
  const limit = Math.max(
    parseInt(searchParams.get("limit") || "10", 10) || 10,
    1
  );
  const skip = (page - 1) * limit;

  const [todos, total] = await Promise.all([
    Todo.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Todo.countDocuments(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return NextResponse.json({
    todos,
    total,
    page,
    pageSize: limit,
    totalPages,
  });
}

// CREATE todo
export async function POST(req: Request) {
  await connectDB();
  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const todo = await Todo.create({ title });
  return NextResponse.json(todo, { status: 201 });
}
