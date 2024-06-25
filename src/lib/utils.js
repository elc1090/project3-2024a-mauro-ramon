export function getValidId(arr)
{
    const existingIds = arr.map(item => + item.id);
    
    let i = -1;

    do {
        i++;
    } while (existingIds.includes(i));

    return i;
}

export const count = (arr) => { return arr.length; };
