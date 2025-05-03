import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";

export async function Navbar() {
	const session = await getServerSession(authOptions);

	return (
		<nav className="border-b">
			<div className="flex h-16 items-center px-4 container mx-auto">
				<Link href="/" className="font-bold text-xl">
					PropView
				</Link>
				<div className="ml-auto flex items-center space-x-4">
					<Link href="/properties">
						<Button variant="ghost">Properties</Button>
					</Link>
					{session ? (
						<UserNav user={session.user} />
					) : (
						<Link href="/login">
							<Button>Sign In</Button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
