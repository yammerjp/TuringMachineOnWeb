const STATE_INITIAL = "q_0";    //初期状態
const STATE_ACCEPT = "q_accept";//受理状態
const STATE_REJECT = "q_reject";//受理状態
const SEEK_DIRECTION_LEFT ="L";     //左への移動
const SEEK_DIRECTION_RIGHT ="R";    //右への移動
const SEEK_DIRECTION_STOP ="S";     //移動しない

let tableArray=    [["table"]];
let editingCell={
    "i":-1,
    "j":-1
};
/*
function loadAlphabetsFromHTML(){
    const alphabetsInput = document.getElementById("alphabets").value;
//    const alphabets=new Array();
    tableArray=[["table"]];

    for(let i=0;i<alphabetsInput.length;i++){
        if(tableArray[0].indexOf(alphabetsInput[i])==-1 && alphabetsInput[i]!=',')
//            alphabets.push(alphabetsInput[i]);
            tableArray[0].push(alphabetsInput[i]);
    }
    console.log(tableArray);
    addTableLine(STATE_INITIAL);

    printTable(tableArray);

}*/
function addTableLine(state){
    for(let i=0;i<tableArray[0].length;i++){
        if(i==0){
            tableArray.push([state]);
        }else{
            tableArray[tableArray.length-1].push("");
        }
    }
}

function addTableColumn(alphabet){
    for(let i=0;i<tableArray.length;i++){
        if(i==0){
            tableArray[i].push(alphabet);
        }else{
            tableArray[i].push("");
        }
    }
}

function addState(){
    if(editingCell.i!=-1&&editingCell.j!=-1)
        editCell(editingCell.i,editingCell.j);
    addTableLine(`q_${tableArray.length-1}`);
    printTable(tableArray);
}

function addAlphabet(){
    if(editingCell.i!=-1&&editingCell.j!=-1)
        editCell(editingCell.i,editingCell.j);
    const alphabets="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let newAlphabet;
    for(let i=0;i<alphabets.length;i++){
        if(tableArray[0].indexOf(alphabets[i])==-1){
            newAlphabet=alphabets[i];
            break;
        }
    }
    if(newAlphabet!=undefined){
        addTableColumn(newAlphabet);
        printTable(tableArray);    
    }else{
        console.log("012...abc..ABC.. is already used.");
    }
}

function editCell(i,j){
    if(i==editingCell.i&&j==editingCell.j){//現在編集中
        const elm=document.getElementById(`cell_${i}_${j}`)
        if(elm==null)
            return;
        const value = elm.value;

        //アルファベットが、複数文字もしくは重複
        if( i==0&(value.length!=1||(tableArray[0].indexOf(value)!=-1&&value!=tableArray[i][j]))){
            console.log("the alphabet is invalid.");
            return;
        }
        //状態名が重複
        if(j==0){
            for(let p=0;p<tableArray.length;p++){
                if(tableArray[p][0].indexOf(value)!=-1 && value!=tableArray[i][j]){
                    console.log("the state is invalid.");
                    return;
                }
            }
        }

        editingCell.i=-1;
        editingCell.j=-1;
        tableArray[i][j]=value;
    }else{
        editCell(editingCell.i,editingCell.j);//現在編集中のものを(書き換え可能なら)書き換えてから
        //編集状態にする
        editingCell.i=i;
        editingCell.j=j;    
    }

    printTable(tableArray);
}

function completeTable(){
    if(editingCell.i!=-1&&editingCell.j!=-1)
        editCell(editingCell.i,editingCell.j);
    let CSVtext="";
    for(let i=1;i<tableArray.length;i++){
        for(let j=1;j<tableArray[i].length;j++){
            if(tableArray[i][j]!=""){
                CSVtext=`${CSVtext}${tableArray[i][0]},${tableArray[0][j]},${tableArray[i][j]}\n`
            }
        }
    }
    document.getElementById('completedTransitionCSV').innerHTML=CSVtext;
}

function printTable(tableArr){
    const table=document.getElementById("transitionTable");
    let tableHTML="";
    let autofocus;
    for(let i=0;i<tableArr.length;i++){
        tableHTML=tableHTML+`<tr>`;
        for(let j=0;j<tableArr[i].length;j++){
            let content;
            if(i==editingCell.i&&j==editingCell.j){
                content=`<input type='text' class='editing_cell' id='cell_${i}_${j}' value='${tableArray[i][j]}'>`;
                autofocus={"i":i,"j":j};
            }else{
                content=tableArr[i][j];
            }

            if(i==0){
                tableHTML=`${tableHTML}<th onclick="editCell(${i},${j});">${content}</th>`;
            }else{
                tableHTML=`${tableHTML}<td onclick="editCell(${i},${j});">${content}</td>`;
            }    
        }
        if(i==0){
            tableHTML=`${tableHTML}<th class="non-line"><button onclick="addAlphabet();">Add alphabet</button></th>`;
        }
        tableHTML=tableHTML+`</tr>`;
    }
    tableHTML=tableHTML+`<tr><td class="non-line"><button onclick="addState();">Add state</button></td></tr>`
    table.innerHTML=tableHTML;
    if(autofocus!=undefined){
        document.getElementById(`cell_${autofocus.i}_${autofocus.j}`).focus();
    }
}

printTable(tableArray);