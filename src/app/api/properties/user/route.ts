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

		const properties = await prisma.property.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(properties);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 },
		);
	}
}
