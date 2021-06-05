export function doesKeywordPartialMatch(keyword: string, fieldValue: string) : boolean {
    if(!keyword) {
        return false;
    }
    const splittedKeyword = keyword.split(' ');
    const foundWordResults = [];

    for(let i = 0; i < splittedKeyword.length; i++) {
        const currentKeywordPartial = splittedKeyword[i].toLowerCase();
        foundWordResults.push(fieldValue.toLowerCase().indexOf(currentKeywordPartial) !== -1);
    }

    return foundWordResults.every(value => value === true);
}