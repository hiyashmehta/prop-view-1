"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const propertySchema = z.object({
	title: z.string().min(5, "Title must be at least 5 characters"),
	description: z
		.string()
		.min(20, "Description must be at least 20 characters"),
	price: z
		.string()
		.refine((val) => !isNaN(Number(val)), "Price must be a number"),
	type: z.enum(["HOUSE", "APARTMENT", "PLOT", "AGRICULTURAL_LAND"]),
	bedrooms: z.string().optional(),
	bathrooms: z.string().optional(),
	floors: z.string().optional(),
	parkingSpaces: z.string().optional(),
	address: z.string().min(5, "Address must be at least 5 characters"),
	city: z.string().min(2, "City must be at least 2 characters"),
	state: z.string().min(2, "State must be at least 2 characters"),
	country: z.string().min(2, "Country must be at least 2 characters"),
	zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function NewPropertyPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const form = useForm<PropertyFormValues>({
		resolver: zodResolver(propertySchema),
		defaultValues: {
			title: "",
			description: "",
			price: "",
			type: "HOUSE",
			bedrooms: "",
			bathrooms: "",
			floors: "",
			parkingSpaces: "",
			address: "",
			city: "",
			state: "",
			country: "",
			zipCode: "",
		},
	});

	const onSubmit = async (data: PropertyFormValues) => {
		try {
			setIsLoading(true);
			setError("");

			const response = await fetch("/api/properties", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					price: Number(data.price),
					bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
					bathrooms: data.bathrooms
						? Number(data.bathrooms)
						: undefined,
					floors: data.floors ? Number(data.floors) : undefined,
					parkingSpaces: data.parkingSpaces
						? Number(data.parkingSpaces)
						: undefined,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Something went wrong");
			}

			router.push("/dashboard");
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError("Something went wrong");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container max-w-2xl py-6">
			<Card>
				<CardHeader>
					<CardTitle>List a New Property</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter property title"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe your property"
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Enter price"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Property Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select property type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="HOUSE">
														House
													</SelectItem>
													<SelectItem value="APARTMENT">
														Apartment
													</SelectItem>
													<SelectItem value="PLOT">
														Plot
													</SelectItem>
													<SelectItem value="AGRICULTURAL_LAND">
														Agricultural Land
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="bedrooms"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bedrooms</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Number of bedrooms"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="bathrooms"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bathrooms</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Number of bathrooms"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="floors"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Floors</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Number of floors"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="parkingSpaces"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Parking Spaces
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Number of parking spaces"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter property address"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter city"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem>
											<FormLabel>State</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter state"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="country"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Country</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter country"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="zipCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Zip Code</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter zip code"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{error && (
								<p className="text-sm text-red-500 text-center">
									{error}
								</p>
							)}

							<Button
								type="submit"
								className="w-full"
								disabled={isLoading}
							>
								{isLoading ? "Creating..." : "Create Property"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
