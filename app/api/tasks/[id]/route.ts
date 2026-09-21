import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const body = await req.json();
        const { title, description, priority, status } = body;

        const updatedTask = await prisma.task.update({
            where: { id: params.id },
            data: { title, description, priority, status },
        });

        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        await prisma.task.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Task deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}