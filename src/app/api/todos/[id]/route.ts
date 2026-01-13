import { connectDB } from "@/app/lib/db";
import { Todo } from "@/app/models/Todo";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  await Todo.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const { completed, title } = await request.json();

  const update: Record<string, unknown> = {};

  if (typeof completed === "boolean") {
    update.completed = completed;
  }

  if (typeof title === "string" && title.trim().length > 0) {
    update.title = title.trim();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No valid fields provided to update" },
      { status: 400 }
    );
  }

  const todo = await Todo.findByIdAndUpdate(id, update, { new: true });

  return NextResponse.json(todo);
}
