import React from 'react';
import serialize from "@/app/BlockRenderer/utils/serialize";

const ContentBlock = ({block}:{block:any}) => {

    return <div className="
    p-4
    prose
    prose-headings:text-red-600
    prose-headings:text-center
    md:prose-xl
    font-opensans
    w-full mx-auto">
        {
            block.content.map((block:any) => {
                return serialize(block);
            })
        }
    </div>
}

export default ContentBlock;
