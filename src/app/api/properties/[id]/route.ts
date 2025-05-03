import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const property = await prisma.property.findUnique({
			where: {
				id: params.id,
			},
			include: {
				user: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});

		if (!property) {
			return NextResponse.json(
				{ message: "Property not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(property);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 },
		);
	}
}
