import serialize from "@/app/BlockRenderer/utils/serialize";
import Link from "next/link";
import Image from "next/image";
import {Media} from "@/app/types/payloadTypes";

const MediaBlock = ({block}:{block:any}) => {
    return <div className="p-8 mt-8 mb-24 px-16 font-openSans bg-white shadow-md shadow-gray-400 flex flex-wrap w-full max-w-screen-lg mx-auto">
        <div className="w-full lg:w-5/12 prose prose-xl">
            <h2 className="text-red-700">{block.title}</h2>
            <div className="lg:max-w-[340px] text-2xl text-gray-400 mb-14">
                {block.content.map((block:any) => {
                    return serialize(block)
                })}
            </div>
            {
                block.button.ExternalLink
                    ? <Link className="bg-red-700 hover:bg-red-600 rounded-2xl p-8 py-4 no-underline text-white" href={block.button?.url}>{block.button.ButtonText}</Link>
                    : <Link className="bg-red-700 hover:bg-red-600 rounded-2xl p-8 py-4 no-underline text-white" href={`${block.button.Page.relationTo}/${block.button.Page.value.slug}`}>{block.button.ButtonText}</Link>
            }
        </div>
        <div className="w-full lg:w-6/12 flex flex-col relative">
            {
                block.images.map((image:{id:string,image:Media},i:number) => {
                    const imageObj = image.image.sizes?.tablet;
                    if (imageObj?.url){
                        return <Image
                            className={`
                            lg:absolute
                            hidden
                            sm:block
                            w-96
                            lg:w-full
                            ${i%2 === 0 ? "translate-y-16" : "scale-110 translate-x-36 absolute" }
                            ${i%2 === 0 ? "lg:-translate-y-16 lg:translate-x-36" : "lg:translate-y-40 lg:-translate-x-20" }
                            ${i%2 === 0 ? "lg:-translate-y-16 lg:translate-x-36" : "lg:translate-y-40 lg:-translate-x-20" }
                            `}
                            key={image.id}
                            width={imageObj?.width||0}
                            height={imageObj.height||0}
                            src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${imageObj?.url}`}
                            alt={image.image?.alt||""} />
                    }
                })
            }
        </div>
    </div>
}

export default MediaBlock;
