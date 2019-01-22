#!/usr/bin/env node
'use strict';

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------Turing Machine Simurator------------------------------
//--------------------------チューリングマシンシュミレータ-----------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//2018/12/04作成 計算論の授業課題でチューリングマシンの作成問題が出ていたので、解答の検証用
//としてシュミレータを作成した


//使い方
// node turing.js [状態遷移表csvファイルパス] [入力テープ]
// 以下の定数は適宜書き換えること。
//定数宣言
const STATEMENT_INITIAL = "q_0";    //初期状態
const STATEMENT_ACCEPT = "q_accept";//受理状態
const STATEMENT_REJECT = "q_reject";//受理状態
const SEEK_DIRECTION_LEFT ="L";     //右への移動
const SEEK_DIRECTION_RIGHT ="R";    //左への移動
const SEEK_DIRECTION_STOP ="S";     //移動しない
//csvの形式
//次行の順番で、UTF-8の余分な空白の含まないファイルであること。
// [ 状態 , テープヘッドの値 , 遷移先の状態 , 書き換える値 , ヘッドの移動先 ]




//コマンドライン引数の受け渡し
const filePass = process.argv[2];
const tapeOrigin = process.argv[3];

//csvファイル展開→配列として格納 の準備
const fs = require('fs');
const parse = require('csv').parse;

let stateTransitionTable_LET ="";
const parser = parse((err, data) => stateTransitionTable_LET = data);

fs.createReadStream(filePass).pipe(parser);

// ヘッドの移動
function seek(directon){
    switch(directon){
        case SEEK_DIRECTION_LEFT:
            return -1;
        case SEEK_DIRECTION_RIGHT:
            return +1;
        case SEEK_DIRECTION_STOP:
            return 0;
    }
}

// 状態遷移
function stateTransition(stateTransitionTable,tape,tapeHead,statement){
    //        0    1         2       3                 4
    // delta=[状態,ヘッドの値,遷移状態,ヘッドの書き換え値,シーク方向]
    for(const delta of stateTransitionTable){
        if(delta[0] == statement && delta[1]==tape[tapeHead]){
            tape = tape.slice(0,tapeHead) + delta[3] + tape.slice(Number(tapeHead)+1)
            tapeHead += seek(delta[4]);
            statement = delta[2];
            return [tape,tapeHead,statement];
        }
    }
    return [tape,tapeHead,statement];
    
}

// シュミレータ本体    ファイル読み込み完了後、実行される。
function turingMachineSimuration(){
    stateTransitionTable_LET[0][0] = stateTransitionTable_LET[0][0].slice(1);
    //よくわからないけどデータにゴミがついてる    

    const stateTransitionTable = stateTransitionTable_LET;// 状態遷移表を定数として導入

    let tape = `_${tapeOrigin}_`;   //テープの左右を空白(_)として追加
    let tapeHead = 1;               //ヘッドの初期位置
    let statement = STATEMENT_INITIAL; //初期状態

    const tapeLog=[[tape,tapeHead,statement]]; //テープとヘッドと状態を時系列に記録

    console.log(tape +"   [status:"+statement+"]");
    console.log(" ^");


    while(!(statement===STATEMENT_ACCEPT || statement===STATEMENT_REJECT)){

        [tape,tapeHead,statement] 
            = stateTransition(stateTransitionTable,tape,tapeHead,statement);

        console.log(tape +"   [status:"+statement+"]");

        let text="";
        for(;text.length<tapeHead;text = text + " ");
        console.log(text+"^");

        //受理されない場合
            // LOOP テープ、ヘッド、状態が過去の少なくともある一時点と一致したら、ループなので受理されない。
            // 遷移先が指定されずに停止した場合もここに含まれる。
        for(const tape_past of tapeLog){
            if(tape_past[0] == tape 
                &&tape_past[1] == tapeHead
                &&tape_past[2] == statement){
                console.log("(!!REJECT!!) It is looped");
                return 0;
            }
        }
        tapeLog.push([tape,tapeHead,statement]);
        // 拒否状態
        if(statement===STATEMENT_REJECT){
            console.log("(!!REJECT!!) It is rejected. ");
            return 0;
        }

        //受理される場合   
        if(statement===STATEMENT_ACCEPT){
            console.log("(ACCEPT) It is accepted. ");
            return 0;
        }
    }
}

parser.on('end',() => turingMachineSimuration());

