"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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

interface Message {
	id: string;
	content: string;
	createdAt: string;
	senderId: string;
}

export default function PropertyDetailsPage() {
	const { id } = useParams();
	const { data: session } = useSession();
	const [property, setProperty] = useState<Property | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchProperty = async () => {
			try {
				const response = await fetch(`/api/properties/${id}`);
				if (!response.ok) throw new Error("Failed to fetch property");
				const data = await response.json();
				setProperty(data);
			} catch (error) {
				console.error("Error fetching property:", error);
			} finally {
				setIsLoading(false);
			}
		};

		const fetchMessages = async () => {
			try {
				const response = await fetch(`/api/properties/${id}/messages`);
				if (!response.ok) throw new Error("Failed to fetch messages");
				const data = await response.json();
				setMessages(data);
			} catch (error) {
				console.error("Error fetching messages:", error);
			}
		};

		fetchProperty();
		if (session) {
			fetchMessages();
		}
	}, [id, session]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !session) return;

		try {
			const response = await fetch(`/api/properties/${id}/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content: newMessage }),
			});

			if (!response.ok) throw new Error("Failed to send message");
			const message = await response.json();
			setMessages((prev) => [...prev, message]);
			setNewMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	if (isLoading) {
		return <div className="text-center py-8">Loading...</div>;
	}

	if (!property) {
		return <div className="text-center py-8">Property not found</div>;
	}

	return (
		<div className="container py-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>{property.title}</CardTitle>
							<CardDescription>
								{property.city}, {property.state}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-3xl font-bold">
								${property.price.toLocaleString()}
							</p>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium">Type</p>
									<p>{property.type.replace("_", " ")}</p>
								</div>
								{property.bedrooms && (
									<div>
										<p className="text-sm font-medium">
											Bedrooms
										</p>
										<p>{property.bedrooms}</p>
									</div>
								)}
								{property.bathrooms && (
									<div>
										<p className="text-sm font-medium">
											Bathrooms
										</p>
										<p>{property.bathrooms}</p>
									</div>
								)}
								{property.floors && (
									<div>
										<p className="text-sm font-medium">
											Floors
										</p>
										<p>{property.floors}</p>
									</div>
								)}
								{property.parkingSpaces && (
									<div>
										<p className="text-sm font-medium">
											Parking Spaces
										</p>
										<p>{property.parkingSpaces}</p>
									</div>
								)}
							</div>
							<div>
								<p className="text-sm font-medium">
									Description
								</p>
								<p className="mt-1">{property.description}</p>
							</div>
							<div>
								<p className="text-sm font-medium">Address</p>
								<p className="mt-1">
									{property.address}
									<br />
									{property.city}, {property.state}{" "}
									{property.zipCode}
									<br />
									{property.country}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="md:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle>Contact Seller</CardTitle>
							<CardDescription>
								{property.user.name || property.user.email}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{session ? (
								<div className="space-y-4">
									<div className="h-[300px] overflow-y-auto space-y-4">
										{messages.map((message) => (
											<div
												key={message.id}
												className={`p-3 rounded-lg ${
													message.senderId ===
													session.user.id
														? "bg-primary text-primary-foreground ml-auto"
														: "bg-muted"
												} max-w-[80%]`}
											>
												<p className="text-sm">
													{message.content}
												</p>
												<p className="text-xs mt-1 opacity-70">
													{new Date(
														message.createdAt,
													).toLocaleString()}
												</p>
											</div>
										))}
									</div>
									<form
										onSubmit={handleSendMessage}
										className="space-y-2"
									>
										<Textarea
											placeholder="Type your message..."
											value={newMessage}
											onChange={(e) =>
												setNewMessage(e.target.value)
											}
											className="min-h-[100px]"
										/>
										<Button
											type="submit"
											className="w-full"
										>
											Send Message
										</Button>
									</form>
								</div>
							) : (
								<div className="text-center py-4">
									<p className="text-sm text-muted-foreground mb-4">
										Please sign in to contact the seller
									</p>
									<Button
										onClick={() =>
											(window.location.href = "/login")
										}
									>
										Sign In
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
