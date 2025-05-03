import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const propertySchema = z.object({
	title: z.string().min(5),
	description: z.string().min(20),
	price: z.number().positive(),
	type: z.enum(["HOUSE", "APARTMENT", "PLOT", "AGRICULTURAL_LAND"]),
	bedrooms: z.number().optional(),
	bathrooms: z.number().optional(),
	floors: z.number().optional(),
	parkingSpaces: z.number().optional(),
	address: z.string().min(5),
	city: z.string().min(2),
	state: z.string().min(2),
	country: z.string().min(2),
	zipCode: z.string().min(5),
});

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await req.json();
		const validatedData = propertySchema.parse(body);

		const property = await prisma.property.create({
			data: {
				...validatedData,
				userId: session.user.id,
				status: "AVAILABLE",
			},
		});

		return NextResponse.json(property, { status: 201 });
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

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const type = searchParams.get("type");
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		const bedrooms = searchParams.get("bedrooms");
		const city = searchParams.get("city");

		const where: any = {
			status: "AVAILABLE",
		};

		if (type) {
			where.type = type;
		}

		if (minPrice || maxPrice) {
			where.price = {};
			if (minPrice) where.price.gte = Number(minPrice);
			if (maxPrice) where.price.lte = Number(maxPrice);
		}

		if (bedrooms) {
			where.bedrooms = Number(bedrooms);
		}

		if (city) {
			where.city = {
				contains: city,
				mode: "insensitive",
			};
		}

		const properties = await prisma.property.findMany({
			where,
			include: {
				user: {
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

		return NextResponse.json(properties);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 },
		);
	}
}
