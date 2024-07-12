//Define data scheme
const expectedDataFormat={
    Name:'string',
    LastName:'string',
    Age:'number',
    UserID:'number',
    Comment:'string_optional'
}

//Data validation function
function validateData(data,structure){
    for(const key in structure){
        const type=structure[key]
        const isOptional=type.endsWith('_optional')
        const actualType=type.replace('_optional','')

        if(!data.hasOwnProperty(key)){
            if(!isOptional){
                console.error(`Missing required field:${key}`)
                return false
            }
        }
        else{
            if(actualType=='number')
            {
                if(isNaN(Number(data[key]))){
                    console.error(`Field ${key} should be a number`)
                    return false;    
                }
            }
            else if (typeof data[key] !== actualType) {
            console.error(`Field ${key} should be of type ${actualType}`)
            return false;
            }
        }
    }
    return true
}

//Validate Data
function validateTestData(testData){
    return testData.every(data=>validateData(data,expectedDataFormat))
}

module.exports={
    validateData,
    validateTestData
}