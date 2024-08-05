function getHighestAndLowest(item: any, fieldName: string, prefix?: string) {
    if (!item) return;
    const low = item.reduce((a: any, b: any) => {
        return Math.min(a, b[fieldName] || Infinity);
    }, Infinity);
    const high = item.reduce((a: any, b: any) => {
        return Math.max(a, b[fieldName] || 0);
    }, 0);

    if (high === 0) return "";

    return low === high ? `${prefix || ""}${low.toLocaleString()}` : `${prefix || ""}${low.toLocaleString()} - ${prefix || ""}${high.toLocaleString()}`;
}

export default getHighestAndLowest;
