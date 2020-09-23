function loadTapeAndTransitionFromHTML(){
    const tapeOrigin = document.getElementById("tapeText").value;
    const transitionsArray = csv2array(document.getElementById("StateTransitionText").value);
    const transitions=new Transitions;
    transitionsArray.forEach((line) => {
        transitions.add(new Transition(line[0], line[1], line[2], line[3], line[4]));
    });
    window.TM = new TuringMachine(tapeOrigin,transitions);
    TM.printTape2console();

    function csv2array(csvData){    //csv形式の文字列を二次元配列に変換
        const lines = csvData.split("\n");
        const csvArray = new Array();
        lines.forEach((line,idx)=>{
            csvArray[idx]=line.split(",");
        });
        return csvArray;
    }
}
function get2textarea(){
    const getData =getUrlVars();
    if(getData.completedTransitionCSV!=undefined){
        const StateTransitionText = document.getElementById("StateTransitionText");
        StateTransitionText.innerHTML= decodeURIComponent(getData.completedTransitionCSV);
    }
    function getUrlVars(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
}
get2textarea();
