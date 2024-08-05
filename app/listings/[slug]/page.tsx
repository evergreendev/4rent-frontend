import qs from "qs";
import {notFound} from "next/navigation";
import {Listing, Media} from "@/app/types/payloadTypes";
import getHighestAndLowest from "@/app/utils/getHighestAndLowest";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Gallery from "@/app/components/Gallery";

async function getData(query: any, tag: string, page?: string) {
    const stringifiedQuery = qs.stringify(
        {
            where: query,
        },
        {
            addQueryPrefix: true
        }
    );

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/listings/${stringifiedQuery}&depth=2`,
        {
            next: {
                tags: [tag]
            }
        }
    );

    if (res.status !== 200) notFound();

    return res.json();
}

const Divider = () => {
    return <div className="w-[1px] self-stretch mx-3 bg-blue-100"/>;
}

export default async function LocationPage({params}: {
    params: { slug: string },
}) {
    const res = await getData({
        slug: {
            equals: params.slug
        }
    }, `listings_${params.slug}`);
    const data: Listing = res.docs[0];

    console.log(data.gallery) //todo delete

    data.gallery?.forEach(item => {
        console.log((item.gallery_item as Media).sizes?.card)
    })

    return (
        <main className="flex flex-wrap">
            <div className="w-full h-40 bg-slate-800 opacity-80"/>
            <div className="w-full bg-slate-800 opacity-80">
                <div
                    className="max-w-screen-2xl w-full mx-auto p-4 bg-slate-700 flex flex-wrap items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-anton">{data.title}</h1>
                        <address>
                            {data.street}, {data.city}, {data.state} {data.zip}
                        </address>
                    </div>
                    <div className="text-3xl font-light">
                        {getHighestAndLowest(data.features?.floorplans, "starting_at", "$")} /month
                    </div>
                </div>
            </div>
            <div className="max-w-screen-2xl w-full mx-auto p-4 bg-white text-slate-950 flex flex-wrap items-center">
                <p>
                    {getHighestAndLowest(data.features?.floorplans, "beds")} Beds
                </p>
                <Divider/>
                <p>
                    {getHighestAndLowest(data.features?.floorplans, "bath")} Baths
                </p>
                <Divider/>
                <p>
                    {getHighestAndLowest(data.features?.floorplans, "sq_ft")} sq. ft.
                </p>
            </div>
            <div className="w-full max-w-screen-2xl mx-auto bg-slate-200 text-red-950">
                <Gallery gallery={data.gallery}/>
            </div>
        </main>
    );
}

