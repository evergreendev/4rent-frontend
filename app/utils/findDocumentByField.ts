import {notFound} from "next/navigation";

export default async function findDocumentByField<T>(getDataFunction: (page?: number) => Promise<any>, fieldValue: string, fieldName: string): Promise<T> {
    const data = await getDataFunction()

    const doc = data.docs.find((doc: { fieldName: string; }) => doc[fieldName as keyof {fieldName: string}] === fieldValue);

    if (doc) return doc;

    if (data.hasNextPage) {
        return await findDocumentByField(() => getDataFunction(data.nextPage), fieldValue,fieldName)
    } else {
        notFound()
    }

}
