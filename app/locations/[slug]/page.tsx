"use server"
import {notFound} from "next/navigation";
import {Listing} from "@/app/types/payloadTypes";
import qs from "qs";
import BlockRenderer from "@/app/BlockRenderer";
import Image from "next/image"
import Map from "@/app/components/Map";
import Pagination from "@/app/components/Pagination";
import {Suspense} from "react";
import Link from "next/link";

async function getLocation(query: any, tag: string) {
    const stringifiedQuery = qs.stringify(
        {
            where: query,
        },
        {
            addQueryPrefix: true
        }
    );

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/locations/${stringifiedQuery}`,
        {
            next: {
                tags: [tag]
            }
        }
    );

    if (res.status !== 200) notFound();

    return res.json();
}

async function getListings(query: any, tag: string, page?: string) {
    const stringifiedQuery = qs.stringify(
        {
            where: query,
        },
        {
            addQueryPrefix: true
        }
    );

    const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/listings/${stringifiedQuery}&depth=1&limit=6${page ? `&page=${page}` : ""}`, {
        next: {
            tags: [tag]
        }
    });
    return await res.json();
}

export default async function LocationPage({params, searchParams}: {
    params: { slug: string },
    searchParams?: { page?: string }
}) {
    const currentPage = searchParams?.page || "1";
    const location = await getLocation({
        slug: {
            equals: params.slug
        }
    }, `locations_${params.slug}`);

    const data = location.docs[0];


    const listings = await getListings({
        locations: {
            contains: data.id
        }
    }, "listings_", currentPage);

    return (
        <main className="flex flex-wrap">
            <div className="w-full h-40 bg-slate-800 opacity-80"/>
            {
                data.featuredImage && typeof data.featuredImage !== "number" ? <Image
                    className={`
                            w-2/12
                            hidden
                            md:block
                            object-cover
                            `}
                    key={data.featuredImage?.id}
                    width={data.featuredImage?.width || 0}
                    height={data.featuredImage?.height || 0}
                    src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${data.featuredImage?.url}`}
                    alt={data.featuredImage?.alt || ""}/> : ""
            }
            <div className="bg-white max-w-screen-lg w-full p-8  min-h-screen">
                <h2 className="text-red-600 font-anton text-3xl mb-4">{data.title}</h2>
                <BlockRenderer blocks={data.content}/>
                <div className="bg-slate-200 text-slate-700 p-4 shadow-md flex flex-wrap justify-between">

                    <Suspense key={currentPage} fallback={null}>
                        {
                            listings.docs.map((listing: Listing) => {

                                const startingAt = listing.features?.floorplans?.reduce((a, b) => {
                                    return Math.min(a, b.starting_at || Infinity);
                                }, Infinity);
                                const highestRent = listing.features?.floorplans?.reduce((a, b) => {
                                    return Math.max(a, b.starting_at || 0);
                                }, 0);

                                const minBeds = listing.features?.floorplans?.reduce((a, b) => {
                                    return Math.min(a, b.beds || Infinity);
                                }, Infinity);
                                const maxBeds = listing.features?.floorplans?.reduce((a, b) => {
                                    return Math.max(a, b.beds || 0);
                                }, 0);

                                const minBaths = listing.features?.floorplans?.reduce((a, b) => {
                                    return Math.min(a, b.bath || Infinity);
                                }, Infinity);
                                const maxBaths = listing.features?.floorplans?.reduce((a, b) => {
                                    return Math.max(a, b.bath || 0);
                                }, 0);

                                return <Link href={`/listings/${listing.slug}`} key={listing.id}
                                             className="bg-slate-100 shadow-sm mb-6 flex flex-col w-full md:w-[48%] duration-500 transition-all hover:brightness-110">
                                    {
                                        listing.featuredImage && typeof listing.featuredImage !== "number"
                                            ? <Image
                                                className="w-full aspect-video object-cover"
                                                src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${listing.featuredImage?.url}`}
                                                width={listing.featuredImage?.width || 0}
                                                height={listing.featuredImage?.height || 0}
                                                alt={`${listing.featuredImage?.alt}`}/>
                                            : ""
                                    }
                                    <div className="grow flex-col flex">
                                        <div className="flex mt-auto">
                                            {
                                                Number.isFinite(startingAt)
                                                && <div
                                                    className="font-bold w-full p-2 text-xl">${startingAt} {
                                                    startingAt !== highestRent ?
                                                        <>- ${highestRent}</> : <></>
                                                }</div>
                                            }
                                            <div className="ml-auto text-right w-full p-2">
                                                {
                                                    Number.isFinite(minBeds)
                                                    && <>{minBeds}{
                                                        minBeds !== maxBeds ? <>-{maxBeds}</> : ""
                                                    } Beds / </>
                                                }
                                                {
                                                    Number.isFinite(minBaths)
                                                    && <>{minBaths}{
                                                        minBaths !== maxBaths ? <>-{maxBaths}</> : ""
                                                    } Baths</>
                                                }
                                            </div>
                                        </div>

                                        <div className="px-4">
                                            <h3 className="text-2xl">{listing.title}</h3>

                                            {
                                                listing.state ?
                                                <address>
                                                    <p>{listing.street}</p>
                                                    <p>{listing.city}, {listing.state} {listing.zip}</p>
                                                </address> : ""
                                            }
                                            <Link className="block text-right font-bold"
                                                  href={`/listings/${listing.slug}`}
                                                  aria-label={`Learn more about ${listing.title}`}>Learn More</Link>
                                        </div>

                                    </div>
                                </Link>
                            })
                        }
                    </Suspense>
                    <div className="w-full">
                        <Pagination totalPages={listings.totalPages}/>
                    </div>
                </div>
            </div>
            <div className="grow flex">
                <Map listings={listings.docs}/>
            </div>
        </main>
    );
}
