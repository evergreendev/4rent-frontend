import {Text} from "slate";
import React from "react";
import escapeHtml from "escape-html";
import Link from "next/link";

function serialize(node:any,nodeIndex?:number) {
    nodeIndex = nodeIndex ? nodeIndex + 1 : 0;

    if (!node) return;

    if (Text.isText(node)) {
        return <React.Fragment key={node.text}>{node.text}</React.Fragment>
    }

    const children = node.children.map((n: any) => {
        return serialize(n, nodeIndex)
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
            return <Link key={nodeIndex} href={escapeHtml(node?.url)}>{children}</Link>
default:
    return children
}
}

export default serialize;
