import {revalidateTag} from "next/cache";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    const collection = request.nextUrl.searchParams.get('collection')
    const slug = request.nextUrl.searchParams.get('slug')
    const secret = request.nextUrl.searchParams.get('secret')

    if (
        !secret ||
        secret !== process.env.NEXT_PRIVATE_REVALIDATION_KEY
    ) {
        // Do not indicate that the revalidation key is incorrect in the response
        // This will protect this API route from being exploited
        return new Response('Invalid request', { status: 400 })
    }

    if (collection && slug) {
        revalidateTag(`${collection}_${slug}`)
        return NextResponse.json({ revalidated: true, now: Date.now() })
    }
    if (collection) {
        revalidateTag(`${collection}_`)
        return NextResponse.json({ revalidated: true, now: Date.now() })
    }

    return NextResponse.json({ revalidated: false, now: Date.now() })
}
