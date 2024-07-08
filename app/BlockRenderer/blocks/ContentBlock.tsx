import escapeHtml from 'escape-html'
import {Text} from 'slate'

const ContentBlock = ({block}:{block:any}) => {

    function serialize(node:any) {
        if (Text.isText(node)) {
            return escapeHtml(node.text)
        }

        const children = node.children.map((n: any) => {
            return serialize(n)
        });

        switch (node.type) {
            case 'h2':
                return <h2>{children}</h2>
            case 'quote':
                return <blockquote><p>{children}</p></blockquote>
            case 'paragraph':
                return <p>{children}</p>
            case 'ul':
                return <ul>{children}</ul>
            case 'li':
                return <li>{children}</li>
            case 'link':
                return <a href={escapeHtml(node.url)}>{children}</a>
            default:
                return children
        }
    }

    return <div className="
    p-4
    prose
    prose-headings:text-red-600
    prose-headings:text-center
    md:prose-xl
    w-full mx-auto">
        {
            block.content.map((block:any) => {
                return serialize(block);
            })
        }
    </div>
}

export default ContentBlock;
