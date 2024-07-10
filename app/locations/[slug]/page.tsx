"use server"
import {notFound} from "next/navigation";
import {Listing} from "@/app/types/payloadTypes";
import qs from "qs";
import BlockRenderer from "@/app/BlockRenderer";
import Image from "next/image"
import Map from "@/app/components/Map";

async function getLocation(query:any, tag:string, page?:string){
    const stringifiedQuery = qs.stringify(
        {
            where: query,
        },
        {
            addQueryPrefix: true
        }
    );

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/locations/${stringifiedQuery}${page ? `&page=${page}`:""}`,
        {
            next: {
                tags: [tag]
            }
        }
    );

    if (res.status !== 200) notFound();

    return res.json();
}

async function getListings(query: any, tag:string, page?: number){
    const stringifiedQuery = qs.stringify(
        {
            where: query,
        },
        {
            addQueryPrefix: true
        }
    );

    const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/listings/${stringifiedQuery}&depth=0`,{
        next: {
            tags: [tag]
        }
    });
    return await res.json();
}

export default async function LocationPage({ params }: { params: { slug: string, page: string } }) {
    const location = await getLocation({
    slug: {
        equals: params.slug
    }
    }, `locations_${params.slug}`,"1");

    const data = location.docs[0];


    const listings = await getListings({
        locations: {
            contains: data.id
        }
    },"listings_",);

    return (
        <main className="flex flex-wrap">
            <div className="w-full h-40 bg-slate-800 opacity-80"/>
            {
            data.featuredImage && typeof data.featuredImage !== "number" ? <Image
                className={`
                            w-2/12
                            hidden
                            sm:block
                            object-cover
                            `}
                key={data.featuredImage.id}
                width={data.featuredImage.width || 0}
                height={data.featuredImage.height || 0}
                src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${data.featuredImage.url}`}
                alt={data.featuredImage.alt || ""}/> : ""
        }
            <div className="bg-white max-w-screen-2xl w-full p-8">
                    <h2 className="text-red-600 font-anton text-3xl mb-4">{data.title}</h2>
                <div className="bg-slate-200 text-slate-700 p-4 shadow-md">
                    <BlockRenderer blocks={data.content}/>
                    {
                        listings.docs.map((listing:Listing) => {
                            return <div key={listing.id} className="p-4 bg-slate-300 shadow-sm mb-7">
                                <h3 className="text-2xl">{listing.title}</h3>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="grow flex">
                <Map listings={listings.docs}/>
            </div>
        </main>
    );
}
