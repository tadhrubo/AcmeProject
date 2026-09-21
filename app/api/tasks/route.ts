import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, priority } = body;


        if (!title || !description) {
            return NextResponse.json(
                { error: "Title and description are required" },
                { status: 400 }
            );
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || "MEDIUM",
                status: "PENDING",
            },
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}