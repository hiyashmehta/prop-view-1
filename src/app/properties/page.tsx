"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Property {
	id: string;
	title: string;
	description: string;
	price: number;
	type: string;
	bedrooms?: number;
	bathrooms?: number;
	floors?: number;
	parkingSpaces?: number;
	address: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
	user: {
		name: string | null;
		email: string | null;
	};
}

export default function PropertiesPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [properties, setProperties] = useState<Property[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filters, setFilters] = useState({
		type: searchParams.get("type") || "",
		minPrice: searchParams.get("minPrice") || "",
		maxPrice: searchParams.get("maxPrice") || "",
		bedrooms: searchParams.get("bedrooms") || "",
		city: searchParams.get("city") || "",
	});

	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const queryParams = new URLSearchParams();
				Object.entries(filters).forEach(([key, value]) => {
					if (value) queryParams.append(key, value);
				});

				const response = await fetch(`/api/properties?${queryParams}`);
				if (!response.ok) throw new Error("Failed to fetch properties");
				const data = await response.json();
				setProperties(data);
			} catch (error) {
				console.error("Error fetching properties:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProperties();
	}, [filters]);

	const handleFilterChange = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		const newParams = new URLSearchParams(searchParams);
		if (value) {
			newParams.set(key, value);
		} else {
			newParams.delete(key);
		}
		router.push(`/properties?${newParams.toString()}`);
	};

	return (
		<div className="container py-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="md:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle>Filters</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Property Type
								</label>
								<Select
									value={filters.type}
									onValueChange={(value) =>
										handleFilterChange("type", value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">
											All Types
										</SelectItem>
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
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Price Range
								</label>
								<div className="grid grid-cols-2 gap-2">
									<Input
										type="number"
										placeholder="Min"
										value={filters.minPrice}
										onChange={(e) =>
											handleFilterChange(
												"minPrice",
												e.target.value,
											)
										}
									/>
									<Input
										type="number"
										placeholder="Max"
										value={filters.maxPrice}
										onChange={(e) =>
											handleFilterChange(
												"maxPrice",
												e.target.value,
											)
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Bedrooms
								</label>
								<Select
									value={filters.bedrooms}
									onValueChange={(value) =>
										handleFilterChange("bedrooms", value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select bedrooms" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">Any</SelectItem>
										<SelectItem value="1">1</SelectItem>
										<SelectItem value="2">2</SelectItem>
										<SelectItem value="3">3</SelectItem>
										<SelectItem value="4">4</SelectItem>
										<SelectItem value="5">5+</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									City
								</label>
								<Input
									placeholder="Enter city"
									value={filters.city}
									onChange={(e) =>
										handleFilterChange(
											"city",
											e.target.value,
										)
									}
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="md:col-span-3">
					{isLoading ? (
						<div className="text-center py-8">Loading...</div>
					) : properties.length === 0 ? (
						<div className="text-center py-8">
							No properties found
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{properties.map((property) => (
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
												router.push(
													`/properties/${property.id}`,
												)
											}
										>
											View Details
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
