"use server"
import {notFound} from "next/navigation";
import findDocumentByField from "@/app/utils/findDocumentByField";
import {Page} from "@/app/types/payloadTypes";
import BlockRenderer from "@/app/BlockRenderer";

async function getData(tag:string, page?: number) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/pages/?limit=10${page ? `&page=${page}` : ""}&locale=undefined&draft=false&depth=2`,
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
        <main>
            <BlockRenderer blocks={data.content}/>
        </main>
    );
}
