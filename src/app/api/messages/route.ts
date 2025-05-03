import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						property: {
							userId: session.user.id,
						},
					},
					{
						senderId: session.user.id,
					},
				],
			},
			include: {
				property: {
					select: {
						id: true,
						title: true,
					},
				},
				sender: {
					select: {
						name: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
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
