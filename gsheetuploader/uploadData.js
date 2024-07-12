const fs=require('fs')
const {google}=require('googleapis')
const sheets=google.sheets('v4')
const {validateTestData}=require('./validation')


const DATA_PATH='./testData.js'

//Load configuration data
const config=JSON.parse(fs.readFileSync('./configure.json'))
const{secretKeyPath,credentialsPath,spreadsheetId,spreadsheetName}=config

//Load credentials
const credentials=JSON.parse(fs.readFileSync(credentialsPath,'utf8'))

//Authorize
async function authorize(){
    const{client_email,private_key}=credentials
    const auth=new google.auth.JWT(client_email,secretKeyPath,private_key,[
        'https://www.googleapis.com/auth/spreadsheets'    
    ])
    await auth.authorize()
    return auth
}

//Upload Data+Validating data format
async function uploadData(auth){
    const testDataContent = fs.readFileSync(DATA_PATH, 'utf8');
    const testData = eval(testDataContent)

    if(!validateTestData(testData)){
        console.error('Invalid data format')
        return
    }

    const columns=Array.from(new Set(testData.flatMap(Object.keys)))
    
    const resource={
        values:[
            ...testData.map(row=>columns.map(col=>row[col]||''))
        ]
    }

    await sheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range:`${spreadsheetName}!A1:${String.fromCharCode(64+columns.length)}${testData.length+1}`,
        valueInputOption:'RAW',
        resource
    })

    console.log(`Data uploaded successfully at ${new Date().toLocaleTimeString()}.`);
}

//Set Interval
async function main(){
    const auth=await authorize()
    await uploadData(auth)

    setInterval(async()=>{
        await uploadData(auth)
    },120000)
}

main().catch(console.error)