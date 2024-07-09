import HeaderBlock from "./blocks/HeaderBlock";
import MediaBlock from "./blocks/MediaBlock";
import ContentBlock from "./blocks/ContentBlock";
import CollectionGroupBlock from "@/app/BlockRenderer/blocks/CollectionGroupBlock";

const BlockRenderer = ({blocks}: { blocks: any }) => {

    return <div>{
        blocks.map((block: any) => {
            switch (block.blockType) {
                case "HeaderBlock":
                    return <HeaderBlock block={block} key={block.id}/>
                case "ContentBlock":
                    return <ContentBlock block={block} key={block.id}/>
                case "MediaBlock":
                    return <MediaBlock block={block} key={block.id}/>
                case "CollectionGroupBlock":
                    return <CollectionGroupBlock block={block} key={block.id}/>
                default:
                    return <div className="bg-red-100 text-red-800 text-center w-96 mx-auto p-8">Unknown Block Type</div>
            }
        })
    }</div>
}

export default BlockRenderer;
