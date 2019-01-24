const HEAD_INITIAL_POSITION = 1; //ヘッドの初期位置
const STATE_INITIAL = "q_0";    //初期状態
const STATE_ACCEPT = "q_accept";//受理状態
const STATE_REJECT = "q_reject";//受理状態
const SEEK_DIRECTION_LEFT ="L";     //左への移動
const SEEK_DIRECTION_RIGHT ="R";    //右への移動
const SEEK_DIRECTION_STOP ="S";     //移動しない
//csvの形式
//次行の順番で、余分な空白の含まない
// [ 状態 , テープヘッドの値 , 遷移先の状態 , 書き換える値 , ヘッドの移動先 ]
const config = new configuration("","","");
const tapeLog= new Array();
let stateTransitionTable= new Array();

let playingTuringMachine = false;

function configuration(tape,head,state){ //様相のオブジェクト(構造体)
    this.tape = tape;
    this.head = head;
    this.state = state;
}

function loadTapeAndTransitionFromHTML(){
    const CSVtext = document.getElementById("StateTransitionText").value;
    const tapeOrigin = document.getElementById("tapeText").value;
    const transition = csv2array(CSVtext);
    initializeTuringMachine(tapeOrigin,transition);
//    printTape2console(config);
    printTape(config);
    tapeLog.push(Object.assign({},config));
}

function initializeTuringMachine(tapeOrigin,transition){
    config.tape=`_${tapeOrigin}_`;
    config.head=HEAD_INITIAL_POSITION;
    config.state=STATE_INITIAL;
    stateTransitionTable = transition;
    playingTuringMachine = true;
}

function nextStep(){
    if(playingTuringMachine==false)
        return;
    const headBefore = config.head;
    printTape(config);
    stateTransition(stateTransitionTable,config);
//    printTape2console(config);
    switch(config.head-headBefore){
        case -1: 
            printTapeAnimetion(config,-60,SEEK_DIRECTION_RIGHT);
            break;
        case 0: 
            printTapeAnimetion(config,0,SEEK_DIRECTION_STOP);
            break;
        case 1:
            printTapeAnimetion(config,60,SEEK_DIRECTION_LEFT);
            break;
        default:
            console.log("Error: nextStep(); head jumped");
    }

    
    //受理されない場合
        // LOOP テープ、ヘッド、状態が過去の少なくともある一時点と一致したら、ループなので受理されない。
        // 遷移先が指定されずに停止した場合もここに含まれる。
    const matchConfig = tapeLog.filter((pastConfig)=>{
        return pastConfig.tape == config.tape 
          &&pastConfig.head == config.head
          &&pastConfig.state == config.state
    });
    if(matchConfig.length>0){
        console.log("(!!WILL NOT STOP!!) It is looped. ");
        playingTuringMachine = false;
    }
    tapeLog.push(Object.assign({},config));
    // 拒否状態
    if(config.state===STATE_REJECT){
        console.log("(!!REJECT!!) It is rejected. ");
        playingTuringMachine = false;
    }

    //受理される場合   
    if(config.state===STATE_ACCEPT){
        console.log("(ACCEPT) It is accepted. ");
        playingTuringMachine = false;
    }

}

function seek(directon){ // ヘッドの移動
    switch(directon){
        case SEEK_DIRECTION_LEFT:
            return -1;
        case SEEK_DIRECTION_RIGHT:
            return +1;
        case SEEK_DIRECTION_STOP:
            return 0;
    }
}

function stateTransition(stateTransitionTable,cfg){ // 状態遷移
    //        0    1         2       3                 4
    // delta=[状態,ヘッドの値,遷移状態,ヘッドの書き換え値,シーク方向]
    for(const delta of stateTransitionTable){
        if(delta[0] == cfg.state && delta[1]==cfg.tape[cfg.head]){
            cfg.tape = cfg.tape.slice(0,cfg.head) + delta[3] + cfg.tape.slice(Number(cfg.head)+1)
            cfg.head += seek(delta[4]);
            cfg.state = delta[2];
            return;
        }
    }
    console.log("(!!STOP!!) It is stopped. ");
    playingTuringMachine = false;
    return;  
}
/*
function printTape2console(cfg){ //様相を表示
    console.log(cfg.tape +"   [status:"+cfg.state+"]");
    let text="";
    for(;text.length<cfg.head;text = text + " ");
    console.log(text+"^");
}*/

function printTape(cfg,shift){
    let writingTape = `       ${cfg.tape.slice(1,-1)}       `;
    writingTape = writingTape.slice(cfg.head,cfg.head+13);

    if(shift===undefined)
        shift=0;

    const canvas = document.getElementById('turingMachineCanvas');
    if ( ! canvas || ! canvas.getContext ) { return false; }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 600, 300);
    ctx.beginPath();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    
    ctx.font = "28px 'Times New Roman'";
    for(let i=0;i<13;i++){
        ctx.strokeRect(-90+i*60+ shift, 120, 60, 60);
        ctx.fillText(writingTape[i],-60+i*60 + shift,150);
    }
    ctx.strokeRect(265, 110, 70, 140);
    ctx.font = "14px 'Times New Roman'";
    ctx.fillText(cfg.state,300,210);
}

function printTapeAnimetion(cfg,shift,direction){
    switch(direction){
        case SEEK_DIRECTION_LEFT:
            shift--;
            break;
        case SEEK_DIRECTION_RIGHT:
            shift++;
            break;
        case SEEK_DIRECTION_STOP:
            break;
        default: 
            console.log("Error:printTapeAnimetion(); direction is undefined");
            return;
    }
    printTape(cfg,shift);
    if(shift!=0)
        window.requestAnimationFrame((ms)=>printTapeAnimetion(cfg,shift,direction)) ;
}
function csv2array(csvData){    //csv形式の文字列を二次元配列に変換
    const lines = csvData.split("\n");
    const csvArray = new Array();
    lines.forEach((line,idx)=>{
        csvArray[idx]=line.split(",");
    });
    return csvArray;
}