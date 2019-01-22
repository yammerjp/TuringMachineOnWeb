function csv2array(csvData){
    const lines = csvData.split("\n");
    const csvArray = new Array();
    lines.forEach((line,idx)=>{
        csvArray[idx]=line.split(",");
    });
    return csvArray;
}

const testText =`a,b,c
d,e,f
g,h,i`;

console.log( csv2array(testText) );
