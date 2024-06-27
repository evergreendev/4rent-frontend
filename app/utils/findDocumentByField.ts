import {notFound} from "next/navigation";

export default async function findDocumentByField<T>(getDataFunction: (tag:string,page?: number) => Promise<any>, fieldValue: string, fieldName: string, tag:string): Promise<T> {
    const data = await getDataFunction(tag);

    const doc = data.docs.find((doc: { fieldName: string; }) => doc[fieldName as keyof {fieldName: string}] === fieldValue);

    if (doc) return doc;

    if (data.hasNextPage) {
        return await findDocumentByField(() => getDataFunction(tag, data.nextPage), fieldValue,fieldName,tag)
    } else {
        notFound()
    }

}
