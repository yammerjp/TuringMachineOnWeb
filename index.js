const HEAD_INITIAL_POSITION = 1; //ヘッドの初期位置
const STATE_INITIAL = "q_0";    //初期状態
const STATE_ACCEPT = "q_accept";//受理状態
const STATE_REJECT = "q_reject";//受理状態
const SEEK_DIRECTION_LEFT ="L";     //右への移動
const SEEK_DIRECTION_RIGHT ="R";    //左への移動
const SEEK_DIRECTION_STOP ="S";     //移動しない
//csvの形式
//次行の順番で、余分な空白の含まない
// [ 状態 , テープヘッドの値 , 遷移先の状態 , 書き換える値 , ヘッドの移動先 ]


function startCalc(){   //startを押したときに実行される
    console.log("start");
    const CSVtext = document.getElementById("StateTransitionText").value;
    const firstTape = document.getElementById("tapeText").value;
    const stateTransition = csv2array(CSVtext);
    turingMachineSimuration(firstTape,stateTransition);

    function csv2array(csvData){    //csv形式の文字列を二次元配列に変換
        const lines = csvData.split("\n");
        const csvArray = new Array();
        lines.forEach((line,idx)=>{
            csvArray[idx]=line.split(",");
        });
        return csvArray;
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

function stateTransition(stateTransitionTable,config){ // 状態遷移
    //        0    1         2       3                 4
    // delta=[状態,ヘッドの値,遷移状態,ヘッドの書き換え値,シーク方向]
    for(const delta of stateTransitionTable){
        if(delta[0] == config.state && delta[1]==config.tape[config.head]){
            config.tape = config.tape.slice(0,config.head) + delta[3] + config.tape.slice(Number(config.head)+1)
            config.head += seek(delta[4]);
            config.state = delta[2];
//            return config;
            return;
        }
    }
    //ここでチューリングマシンはストップするはず。
    //現在の実装では、様相が全く変化しないことでループ検知が働いている。
//    return config;
    return;  
}

function turingMachineSimuration(tapeOrigin,stateTransitionTable){  // シュミレータ本体
    let config = new configuration(`_${tapeOrigin}_`,HEAD_INITIAL_POSITION,STATE_INITIAL);

    const tapeLog= new Array();
    tapeLog.push(Object.assign({},config));

    printTapeAndState(config);

    while(!(config.state===STATE_ACCEPT) && !(config.state===STATE_REJECT)){
        stateTransition(stateTransitionTable,config);

        printTapeAndState(config);

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
            return 0;
        }
        tapeLog.push(Object.assign({},config));
        // 拒否状態
        if(config.state===STATE_REJECT){
            console.log("(!!REJECT!!) It is rejected. ");
            return 0;
        }

        //受理される場合   
        if(config.state===STATE_ACCEPT){
            console.log("(ACCEPT) It is accepted. ");
            return 0;
        }
    }
}

function printTapeAndState(config){ //様相を表示
    console.log(config.tape +"   [status:"+config.state+"]");
    let text="";
    for(;text.length<config.head;text = text + " ");
    console.log(text+"^");
}

function configuration(tape,head,state){ //様相のオブジェクト(構造体)
    this.tape = tape;
    this.head = head;
    this.state = state;
}

