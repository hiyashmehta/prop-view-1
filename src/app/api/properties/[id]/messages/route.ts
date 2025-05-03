import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
	content: z.string().min(1, "Message cannot be empty"),
});

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const property = await prisma.property.findUnique({
			where: {
				id: params.id,
			},
		});

		if (!property) {
			return NextResponse.json(
				{ message: "Property not found" },
				{ status: 404 },
			);
		}

		// Only allow access to messages if the user is the property owner or a buyer
		if (
			property.userId !== session.user.id &&
			session.user.role !== "BUYER"
		) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const messages = await prisma.message.findMany({
			where: {
				propertyId: params.id,
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		return NextResponse.json(messages);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 },
		);
	}
}

export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const property = await prisma.property.findUnique({
			where: {
				id: params.id,
			},
		});

		if (!property) {
			return NextResponse.json(
				{ message: "Property not found" },
				{ status: 404 },
			);
		}

		const body = await req.json();
		const validatedData = messageSchema.parse(body);

		const message = await prisma.message.create({
			data: {
				content: validatedData.content,
				propertyId: params.id,
				senderId: session.user.id,
			},
		});

		return NextResponse.json(message, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ message: error.errors[0].message },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 },
		);
	}
}
