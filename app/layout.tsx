import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Image from "next/image";
import React from "react";
import ContactForm from "@/app/components/ContactForm";
import { GoogleTagManager } from "@next/third-parties/google"

const inter = Inter({subsets: ["latin"]});

async function getMeta() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/globals/site-options?locale=undefined&draft=false&depth=1`,
        {
            next: {
                tags: ["siteOptions_"]
            }
        });
    return await res.json();
}

export async function generateMetadata(): Promise<Metadata> {

    const meta = await getMeta();


    return {
        title: meta.siteTitle,
        description: meta.siteDescription,
    }
}


export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const meta = await getMeta();
    return (
        <html lang="en">
        <GoogleTagManager gtmId={"G-5B97XL2RJB"}/>
        <body className={`${inter.className} overflow-y-hidden`}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow p-6 inset-0 z-[1000] max-w-screen-lg w-full bg-slate-100 h-[900px] text-slate-950">
            <Image className="m-auto" src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${meta.siteLogoAlt?.url}` || ""} alt={meta.siteLogoAlt?.alt || ""}
                   width={meta.siteLogoAlt?.width || 200} height={meta.siteLogoAlt?.height || 200}/>
            <h2 className="text-red-600 mb-6 text-center font-anton text-5xl">Are you an owner or manager of an apartment complex or rental property in the Black Hills?</h2>
            <p className="text-4xl text-gray-800 text-center max-w-prose">Cut through the noise and price of big online directories and be seen on the Black Hill’s newest and most
                curated renter’s guide, 4Rent Black Hills.</p>
            <ContactForm/>
        </div>
        <div className="bg-black absolute z-[999] inset-0 opacity-10"/>
        <div className="blur">
            <Header image={meta.siteLogo}/>
            {children}
        </div>
        </body>
        </html>
    );
}
