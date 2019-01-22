function startCalc(){
    console.log("start");
    const CSVtext = document.getElementById("StateTransitionText").value;
    const firstTape = document.getElementById("tapeText").value;
    console.log("state transition : "+csv2array(CSVtext));
    console.log("first tape : "+ firstTape);
}

function csv2array(csvData){
    const lines = csvData.split("\n");
    const csvArray = new Array();
    lines.forEach((line,idx)=>{
        csvArray[idx]=line.split(",");
    });
    return csvArray;
}