const HEAD_INITIAL_POSITION = 1; //ヘッドの初期位置
const STATE_INITIAL = "q_0";    //初期状態
const STATE_ACCEPT = "q_accept";//受理状態
const STATE_REJECT = "q_reject";//受理状態
const SEEK_DIRECTION_LEFT ="L";     //左への移動
const SEEK_DIRECTION_RIGHT ="R";    //右への移動
const SEEK_DIRECTION_STOP ="S";     //移動しない
const ALPHABET_BLANK ="_";

class Set{
    constructor(){
        this.arr=new Array();
    }
    duplicated(arg){
        if(this.arr.indexOf(arg)!=-1)
            return -1;
        return 0;
    }
    add(arg){
        if(this.duplicated(arg)!=0){
            console.log("Error,arg is invalid");
            return -1;
        }
        this.arr.push(arg);
        this.print();
        return 0;
    }
    change(arg,newArg){
        if(/*this.duplicated(newArg)==0 ||*/ this.duplicated(arg)==0){
            console.log("Error,arg is nothing");
            return -1;
        }
        this.arr[ this.arr.indexOf(arg) ] = newArg;
        return 0;
    }
    print(){
        console.log(this.toString());
    }
    toString(returnStr = function(elm){return `${elm},`;}){
        let str="";
        this.arr.forEach((elm)=>{
            str = str + returnStr(elm);
        });
        return str;
    }
}
class StringSet extends Set{
    constructor(){
        super();
    }
}

class Seek extends StringSet{
    constructor(){
        super();

    }
}

class State extends StringSet{
    constructor(){
        super();
        this.initial = STATE_INITIAL;
        this.accept = STATE_ACCEPT;
        this.reject = STATE_REJECT;
    }
    //callbackのデフォルト引数はこちらでは指定していないので次の関数呼び出し時は必ずコールバック関数が必要
    toStringWithSpetialState(callback){
        return this.toString(callback)
                + callback(this.accept)
                + callback(this.reject);
    }
}

class Alphabet extends StringSet{
    constructor(){
        super();
    }
    add(arg){
        if(arg.length!=1){
            console.log("Error,argument is not character");
            return -1;
        }
        super.add(arg);
    }
}

class Transition{
    constructor(state,alphabet,newState,newAlphabet,seek){
        this.state=state;
        this.alphabet=alphabet;
        this.newState=newState;
        this.newAlphabet=newAlphabet
        this.seek=seek;
    }
    print(){
        console.log(`{${this.state},${this.alphabet},${this.newState},${this.newAlphabet},${this.seek}},\n`);
    }
}

class Transitions extends Set{
    constructor(){
        super();
        this.state=new State();
        this.alphabet=new Alphabet();
        this.seek=new Seek();

        this.seek.add(SEEK_DIRECTION_LEFT);
        this.seek.add(SEEK_DIRECTION_STOP);
        this.seek.add(SEEK_DIRECTION_RIGHT);
    }
    duplicated(arg){
        if( this.find(arg.state,arg.alphabet) !=undefined){
            return -1;
        }
        return 0;

    }
    find(state,alphabet){
        const transition = this.arr.find((transition)=>{
            return transition.state == state && transition.alphabet == alphabet;
        });
        return transition;
    }
    rewite(arg){
        if(this.add(arg)==-1){
            this.change(this.find(arg.state,arg.alphabet),arg);
        }
    }
    toString(returnStr = function(t){
      return `${t.state},${t.alphabet},${t.newState},${t.newAlphabet},${t.seek}\n`;}){
        return super.toString(returnStr);
    }
}