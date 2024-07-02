import HeaderBlock from "./blocks/HeaderBlock";
import MediaBlock from "./blocks/MediaBlock";
import ContentBlock from "./blocks/ContentBlock";

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
                default:
                    return <div>Unknown Block Type</div>
            }
        })
    }</div>
}

export default BlockRenderer;
