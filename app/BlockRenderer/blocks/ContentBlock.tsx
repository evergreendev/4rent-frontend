import escapeHtml from 'escape-html'
import {Text} from 'slate'
import Link from "next/link";
import React from 'react';

const ContentBlock = ({block}:{block:any}) => {
    let nodeIndex = 0;

    function serialize(node:any) {
        nodeIndex++;
        if (Text.isText(node)) {
            return <React.Fragment key={node.text}>{escapeHtml(node.text)}</React.Fragment>
        }

        const children = node.children.map((n: any) => {
            return serialize(n)
        });

        switch (node.type) {
            case 'h2':
                return <h2 key={nodeIndex}>{children}</h2>
            case 'quote':
                return <blockquote key={nodeIndex}><p>{children}</p></blockquote>
            case 'paragraph':
                return <p key={nodeIndex}>{children}</p>
            case 'ul':
                return <ul key={nodeIndex}>{children}</ul>
            case 'li':
                return <li key={nodeIndex}>{children}</li>
            case 'link':
                return <Link key={nodeIndex} href={escapeHtml(node.url)}>{children}</Link>
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
