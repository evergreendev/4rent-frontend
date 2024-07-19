"use server"
import {notFound} from "next/navigation";
import BlockRenderer from "@/app/BlockRenderer";
import qs from "qs";

async function getData(query:any, tag:string, page?:string){
    const stringifiedQuery = qs.stringify(
        {
            where: query,
        },
        {
            addQueryPrefix: true
        }
    );

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/pages/${stringifiedQuery}&depth=2`,
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
    const data = await getData({
        slug:{
            equals: 'home'
        }
    }, "pages_home");

    return (
        <main>
            <BlockRenderer blocks={data.docs[0]?.content || []}/>
        </main>
    );
}
