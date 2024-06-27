"use server"
import {notFound} from "next/navigation";
import findDocumentByField from "@/app/utils/findDocumentByField";
import {Page} from "@/app/types/payloadTypes";

async function getData(tag:string, page?: number) {
    const res = await fetch(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/pages/?limit=10${page ? `&page=${page}` : ""}&locale=undefined&draft=false&depth=1`,
        {
            next: {
                tags: [tag]
            }
        }
    );

    if (res.status !== 200) notFound();

    return res.json();
}

export default async function Home() {
    const data = await findDocumentByField<Page>(getData, "home", "slug","pages_home");

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                {data.title}
            </div>
        </main>
    );
}
