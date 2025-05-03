import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	role: z.enum(["BUYER", "SELLER", "BROKER", "BUILDER"]),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedData = registerSchema.parse(body);

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 },
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(validatedData.password, 10);

		// Create user
		const user = await prisma.user.create({
			data: {
				name: validatedData.name,
				email: validatedData.email,
				password: hashedPassword,
				role: validatedData.role,
			},
		});

		return NextResponse.json(
			{ message: "User created successfully" },
			{ status: 201 },
		);
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
