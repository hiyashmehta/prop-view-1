"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "BUYER",
	});
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Something went wrong");
			}

			router.push("/login");
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError("Something went wrong");
			}
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<Card className="w-[400px]">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>Sign up to get started</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Enter your name"
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={formData.password}
								onChange={(e) =>
									setFormData({
										...formData,
										password: e.target.value,
									})
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="role">I want to</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									setFormData({ ...formData, role: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select your role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="BUYER">
										Buy/Rent Properties
									</SelectItem>
									<SelectItem value="SELLER">
										Sell Properties
									</SelectItem>
									<SelectItem value="BROKER">
										Work as a Broker
									</SelectItem>
									<SelectItem value="BUILDER">
										Work as a Builder
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{error && (
							<p className="text-sm text-red-500">{error}</p>
						)}
						<Button type="submit" className="w-full">
							Create Account
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					<p className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Button
							variant="link"
							className="p-0"
							onClick={() => router.push("/login")}
						>
							Sign in
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
