const HEAD_INITIAL_POSITION = 1; //ヘッドの初期位置
const STATE_INITIAL = "q_0";    //初期状態
const STATE_ACCEPT = "q_accept";//受理状態
const STATE_REJECT = "q_reject";//受理状態
const SEEK_DIRECTION_LEFT ="L";     //左への移動
const SEEK_DIRECTION_RIGHT ="R";    //右への移動
const SEEK_DIRECTION_STOP ="S";     //移動しない
const ALPHABET_BLANK ="_";

get2textarea();

class TuringMachine{
    constructor(tapeOrigin,headInitialPosition,initialState,transition){
        this.config={   tape: ALPHABET_BLANK +tapeOrigin+ ALPHABET_BLANK,
                        head:headInitialPosition,
                        state:initialState  };
        this.transition=transition;//状態遷移関数をもとにした二次元配列
        this.isWorking = true;
        this.tapeLog = [JSON.stringify(this.config)];//状態が循環して永久に受理しないことの判定に用いる

        this.canvas = document.getElementById('turingMachineCanvas');
        if ( ! this.canvas || ! this.canvas.getContext )
            console.log("Error, canvas is false or canvas.getContext is false");
        this.ctx = this.canvas.getContext('2d');
    }
    nextStep(){
        if(this.isWorking==false)
            return;
        const pastHead = this.config.head;
        this.transitState();
//        this.printTape2console();
        this.printTape(pastHead);

        //ループ
        if( this.tapeLog.indexOf( JSON.stringify(this.config) )!=-1 ){
            console.log("(!!WILL NOT STOP!!) It is looped. ");
            this.isWorking = false;
        }
        this.tapeLog.push(JSON.stringify(this.config));
        //拒否
        if(this.config.state==STATE_REJECT){
            console.log("(!!REJECT!!) It is rejected. ");
            this.isWorking = false;
        }
        //受理
        if(this.config.state==STATE_ACCEPT){
            console.log("(ACCEPT) It is accepted. ");
            this.isWorking = false;
        }
    }
    transitState(){// 状態遷移
    //                     0    1         2       3                 4
    //transitionLine=[状態,ヘッドの値,遷移状態,ヘッドの書き換え値,シーク方向]
        const transitionLine=this.transition.find((line)=>{
            return line[0]==this.config.state && line[1]==this.config.tape[this.config.head];
        });
        if(transitionLine!=undefined){
            this.config.tape= this.config.tape.slice(0,this.config.head) 
                                + transitionLine[3] 
                                + this.config.tape.slice(this.config.head+1);   //テープを書き換え
            this.config.head +=seek(transitionLine[4]);//ヘッドを移動
            this.config.state=transitionLine[2];//状態遷移
        }else{
            console.log("(!!STOP!!) It is stopped. ");
            this.isWorking = false;
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
    }
    /*
    printTape2console(){
        console.log(this.config.tape +"   [status:"+this.config.state+"]");
        let text="";
        for(;text.length<this.config.head;text = text + " ");
        console.log(text+"^");
    }*/
    printTape(pastHead){
        let writingTape = `       ${this.config.tape.slice(1,-1)}       `;
        writingTape = writingTape.slice(this.config.head,this.config.head+13);
        if(pastHead==undefined){
            print(this.ctx,writingTape,this.config.state);
        }else{
            print(this.ctx,writingTape,this.config.state,(this.config.head-pastHead)*60);
        }

        function print(ctx,wTape,state,shift=0){
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.font = "28px 'Times New Roman'";
            ctx.clearRect(0, 0, 600, 300);
            ctx.beginPath();
            for(let i=0;i<13;i++){
                ctx.strokeRect(-90+i*60+ shift, 120, 60, 60);
                ctx.fillText(wTape[i],-60+i*60 + shift,150);
            }
            ctx.strokeRect(265, 110, 70, 140);
            ctx.font = "14px 'Times New Roman'";
            ctx.fillText(state,300,210);    
            if(shift!=0){
                if(shift>0)
                    shift-=2;
                else 
                    shift+=2;
                window.requestAnimationFrame(()=>print(ctx,wTape,state,shift));
            }
        }

    }
}

function loadTapeAndTransitionFromHTML(){
    const tapeOrigin = document.getElementById("tapeText").value;
    const transition = csv2array(document.getElementById("StateTransitionText").value);
    window.TM = new TuringMachine(tapeOrigin,HEAD_INITIAL_POSITION,STATE_INITIAL,transition);
//    TM.printTape2console();
    TM.printTape();
    
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
