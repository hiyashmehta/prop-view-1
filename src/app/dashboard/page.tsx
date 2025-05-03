"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Property {
	id: string;
	title: string;
	price: number;
	type: string;
	status: string;
	city: string;
	state: string;
	createdAt: string;
}

interface Message {
	id: string;
	content: string;
	createdAt: string;
	property: {
		id: string;
		title: string;
	};
	sender: {
		name: string | null;
		email: string | null;
	};
}

export default function DashboardPage() {
	const { data: session } = useSession();
	const router = useRouter();
	const [properties, setProperties] = useState<Property[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!session) {
			router.push("/login");
			return;
		}

		const fetchData = async () => {
			try {
				const [propertiesRes, messagesRes] = await Promise.all([
					fetch("/api/properties/user"),
					fetch("/api/messages"),
				]);

				if (propertiesRes.ok) {
					const propertiesData = await propertiesRes.json();
					setProperties(propertiesData);
				}

				if (messagesRes.ok) {
					const messagesData = await messagesRes.json();
					setMessages(messagesData);
				}
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [session, router]);

	if (isLoading) {
		return <div className="text-center py-8">Loading...</div>;
	}

	return (
		<div className="container py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				{session?.user.role !== "BUYER" && (
					<Button onClick={() => router.push("/properties/new")}>
						Add New Property
					</Button>
				)}
			</div>

			<Tabs defaultValue="properties" className="space-y-4">
				<TabsList>
					<TabsTrigger value="properties">My Properties</TabsTrigger>
					<TabsTrigger value="messages">Messages</TabsTrigger>
				</TabsList>

				<TabsContent value="properties">
					{properties.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								No properties found
							</p>
							{session?.user.role !== "BUYER" && (
								<Button
									variant="link"
									onClick={() =>
										router.push("/properties/new")
									}
									className="mt-2"
								>
									Add your first property
								</Button>
							)}
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
											<p className="text-sm">
												Status:{" "}
												{property.status.toLowerCase()}
											</p>
											<p className="text-sm">
												Listed:{" "}
												{new Date(
													property.createdAt,
												).toLocaleDateString()}
											</p>
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
				</TabsContent>

				<TabsContent value="messages">
					{messages.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								No messages found
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{messages.map((message) => (
								<Card key={message.id}>
									<CardHeader>
										<CardTitle className="text-sm">
											{message.sender.name ||
												message.sender.email}
										</CardTitle>
										<CardDescription>
											Property: {message.property.title}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-sm">
											{message.content}
										</p>
										<p className="text-xs text-muted-foreground mt-2">
											{new Date(
												message.createdAt,
											).toLocaleString()}
										</p>
									</CardContent>
									<CardFooter>
										<Button
											variant="outline"
											className="w-full"
											onClick={() =>
												router.push(
													`/properties/${message.property.id}`,
												)
											}
										>
											View Property
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
