export function validText320(text, title){
    if(text === ""){
        return `"${title}" must not be blank`;
    }
    if(text.length < 3 || text.length > 20){
        return `"${title}" must be between 3 and 20 characters long`;
    }
}

export function validNumber(number, title){
    if(number === undefined){
        return `"${title}" must not be blank`;
    }
    if(number < 1){
        return `"${title}" must be bigger than 1`;
    }
}