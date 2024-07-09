import React from 'react';
import {Listing, Page, Location} from "@/app/types/payloadTypes";
import Link from "next/link";
import Image from "next/image";

const Button = ({slug, collection}: {
    slug: string, collection: Page | Listing | Location
}) => {
    return <Link
        className="w-[30%] bg-red-700 hover:bg-red-600 rounded-2xl p-8 py-4 no-underline text-white text-center"
        href={`/${slug}/${collection.slug}`}>{collection.title}</Link>
}

const ListingImageCard = ({slug, collection}: { slug: string, collection: Page | Listing | Location }) => {
    if (typeof collection.featuredImage === "number" || !process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL) return <></>

    return <Link href={`/${slug}/${collection.slug}`}
                 className="relative h-96 w-[24%] prose-img:m-0 overflow-hidden group"
    >
        <p className="absolute leading-tight text-white no-underline z-20 font-openSans max-w-[160px] top-[40%] -translate-y-1/2 w-full text-center left-1/2 -translate-x-1/2">
            {collection.title}
        </p>
        <Image className="inset-0 object-cover absolute group-hover:scale-110 transition-transform duration-1000"  src={process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL + collection.featuredImage?.url || ""} width={collection.featuredImage?.width || 0}
               height={collection.featuredImage?.height || 0} alt={collection.featuredImage?.alt || ""}/>
        <div className="bg-black opacity-50 group-hover:opacity-40 transition-opacity duration-700 z-10 inset-0 absolute"/>
    </Link>
}

const CollectionGroupBlock = ({block}: { block: any }) => {

    return <div className={`
    p-4
    prose
    prose-headings:text-red-700
    prose-headings:text-center
    md:prose-xl
    font-opensans
    max-w-screen-lg
    flex
    flex-wrap
    justify-between
    gap-2
    gap-y-8
    w-full mx-auto
    `}>
        {
            block.collections.map((collection: { relationTo: string, value: Page | Listing | Location }) => {
                switch (block.type) {
                    case "buttons":
                        return <Button key={collection.relationTo + collection.value.slug} collection={collection.value}
                                       slug={collection.relationTo}/>
                    case "featured_images":
                        return <ListingImageCard key={collection.relationTo + collection.value.slug}
                                                 collection={collection.value} slug={collection.relationTo}/>
                }
            })
        }
    </div>
}

export default CollectionGroupBlock;
