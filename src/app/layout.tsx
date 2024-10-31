import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Locale from "../locales";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: Locale.Title,
	description: Locale.Desc,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="apple-mobile-web-app-capable" content="yes"></meta>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
				></meta>
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
