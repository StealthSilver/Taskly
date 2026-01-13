import { connectDB } from "@/app/lib/db";
import { Todo } from "@/app/models/Todo";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const result = await Todo.deleteOne({
    _id: id,
    user: (session.user as any).id,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: (session.user as any).id },
    update,
    { new: true }
  );

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(todo);
}
