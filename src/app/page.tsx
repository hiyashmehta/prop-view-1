"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Property {
	id: string;
	title: string;
	price: number;
	type: string;
	city: string;
	state: string;
	bedrooms?: number;
	bathrooms?: number;
}

export default function HomePage() {
	const [featuredProperties, setFeaturedProperties] = useState<Property[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState(true);
	const [searchParams, setSearchParams] = useState({
		type: "",
		city: "",
	});

	useEffect(() => {
		const fetchFeaturedProperties = async () => {
			try {
				const response = await fetch("/api/properties?limit=3");
				if (!response.ok) throw new Error("Failed to fetch properties");
				const data = await response.json();
				setFeaturedProperties(data);
			} catch (error) {
				console.error("Error fetching featured properties:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFeaturedProperties();
	}, []);

	const handleSearch = () => {
		const queryParams = new URLSearchParams();
		if (searchParams.type) queryParams.append("type", searchParams.type);
		if (searchParams.city) queryParams.append("city", searchParams.city);
		window.location.href = `/properties?${queryParams.toString()}`;
	};

	return (
		<div className="flex flex-col min-h-[calc(100vh-4rem)]">
			{/* Hero Section */}
			<section className="bg-primary text-primary-foreground py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
							Find Your Dream Property
						</h1>
						<p className="text-xl mb-8">
							Discover the perfect home, apartment, or land that
							matches your lifestyle and preferences.
						</p>
						<div className="flex flex-col md:flex-row gap-4 justify-center">
							<Select
								value={searchParams.type}
								onValueChange={(value) =>
									setSearchParams({
										...searchParams,
										type: value,
									})
								}
							>
								<SelectTrigger className="w-full md:w-[200px]">
									<SelectValue placeholder="Property Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">All Types</SelectItem>
									<SelectItem value="HOUSE">House</SelectItem>
									<SelectItem value="APARTMENT">
										Apartment
									</SelectItem>
									<SelectItem value="PLOT">Plot</SelectItem>
									<SelectItem value="AGRICULTURAL_LAND">
										Agricultural Land
									</SelectItem>
								</SelectContent>
							</Select>
							<Input
								placeholder="Enter city"
								value={searchParams.city}
								onChange={(e) =>
									setSearchParams({
										...searchParams,
										city: e.target.value,
									})
								}
								className="w-full md:w-[200px]"
							/>
							<Button
								onClick={handleSearch}
								className="w-full md:w-auto"
								variant="secondary"
							>
								Search Properties
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Properties Section */}
			<section className="py-16 bg-muted/50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						Featured Properties
					</h2>
					{isLoading ? (
						<div className="text-center">Loading...</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{featuredProperties.map((property) => (
								<Card key={property.id}>
									<CardHeader>
										<CardTitle className="line-clamp-1">
											{property.title}
										</CardTitle>
										<CardDescription>
											{property.city}, {property.state}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-2xl font-bold">
											${property.price.toLocaleString()}
										</p>
										<div className="mt-2 space-y-1">
											<p className="text-sm">
												Type:{" "}
												{property.type.replace(
													"_",
													" ",
												)}
											</p>
											{property.bedrooms && (
												<p className="text-sm">
													Bedrooms:{" "}
													{property.bedrooms}
												</p>
											)}
											{property.bathrooms && (
												<p className="text-sm">
													Bathrooms:{" "}
													{property.bathrooms}
												</p>
											)}
										</div>
									</CardContent>
									<CardFooter>
										<Button
											className="w-full"
											onClick={() =>
												(window.location.href = `/properties/${property.id}`)
											}
										>
											View Details
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
					<div className="text-center mt-8">
						<Button
							variant="outline"
							onClick={() =>
								(window.location.href = "/properties")
							}
						>
							View All Properties
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						Why Choose PropView?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Wide Selection
							</h3>
							<p className="text-muted-foreground">
								Browse through thousands of properties across
								different categories and locations.
							</p>
						</div>
						<div className="text-center">
							<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Direct Communication
							</h3>
							<p className="text-muted-foreground">
								Connect directly with property owners and get
								your questions answered quickly.
							</p>
						</div>
						<div className="text-center">
							<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">
								Secure Platform
							</h3>
							<p className="text-muted-foreground">
								Your data is protected with industry-standard
								security measures and privacy controls.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-primary text-primary-foreground py-16">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-bold mb-4">
						Ready to Find Your Perfect Property?
					</h2>
					<p className="text-xl mb-8">
						Join thousands of satisfied users who found their dream
						property with PropView.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							variant="secondary"
							onClick={() => (window.location.href = "/register")}
						>
							Create Account
						</Button>
						<Button
							variant="outline"
							className="bg-transparent"
							onClick={() =>
								(window.location.href = "/properties")
							}
						>
							Browse Properties
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
