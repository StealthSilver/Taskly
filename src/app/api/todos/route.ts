import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectDB } from "@/app/lib/db";
import { Todo } from "@/app/models/Todo";

// GET todos with pagination
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);
  const limit = Math.max(
    parseInt(searchParams.get("limit") || "10", 10) || 10,
    1
  );
  const skip = (page - 1) * limit;

  const [todos, total] = await Promise.all([
    Todo.find({ user: (session.user as any).id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Todo.countDocuments({ user: (session.user as any).id }),
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
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const todo = await Todo.create({
    title,
    user: (session.user as any).id,
  });
  return NextResponse.json(todo, { status: 201 });
}
