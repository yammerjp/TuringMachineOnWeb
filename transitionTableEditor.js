const STATE_INITIAL = "q_0";    //初期状態
const STATE_ACCEPT = "q_accept";//受理状態
const STATE_REJECT = "q_reject";//受理状態
const SEEK_DIRECTION_LEFT ="L";     //左への移動
const SEEK_DIRECTION_RIGHT ="R";    //右への移動
const SEEK_DIRECTION_STOP ="S";     //移動しない

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

class View{
    constructor(){
        this.state = document.getElementById("stateInput");
        this.alphabet= document.getElementById("alphabetInput");
        this.newState= document.getElementById("newStateInput");
        this.newAlphabet= document.getElementById("newAlphabetInput");
        this.seek= document.getElementById("seekInput");

        this.ts = new Transitions();
        this.selected = {
            state: "",
            alphabet: "",
            newState: "",
            newAlphabet: "",
            seek:""
        }
    }
    addNewTransition() {
        if (this.ts.state.arr.length == 0 || this.ts.alphabet.arr.length == 0)
            return -1;
        const transition = new Transition(this.state.value,this.alphabet.value,this.newState.value,this.newAlphabet.value,this.seek.value);
//        this.ts.add(transition);
        this.ts.rewite(transition);
        this.printTable();
    }
    setLineAdder(state = "", alphabet = "", newState = "", newAlphabet = "", seek = "") {
        if (state != "")
            this.selected.state = state;
        if (alphabet != "")
            this.selected.alphabet = alphabet;
        if (newState != "")
            this.selected.newState = newState;
        if (newAlphabet != "")
            this.selected.newAlphabet = newAlphabet;
        if (seek != "")
            this.selected.seek = seek;
        
        this.printLineAdder(this.selected);
    }
    printLineAdder(sld) {
        const optionPrint = function (str = "") {
            return function (elm) {
                return `<option value="${elm}"${(elm == str) ? ' selected ' : ''}>${elm}</option>\n`;
            };
        };
        if (sld == undefined)
            sld = this.selected;
        this.state.innerHTML = this.ts.state.toString(optionPrint(sld.state));
        this.alphabet.innerHTML = this.ts.alphabet.toString(optionPrint(sld.alphabet));
        this.newState.innerHTML = this.ts.state.toStringWithSpetialState(optionPrint(sld.newState));
        this.newAlphabet.innerHTML = this.ts.alphabet.toString(optionPrint(sld.newAlphabet));
        this.seek.innerHTML = this.ts.seek.toString(optionPrint(sld.seek));

        this.printTable();
    }
    addAlphabet(){
//        const alphabets="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const alphabets = "01XAB_23456789abcdefghijklmnopqrstuvwxyzCDEFGHIJKLMNOPQRSTUVWYZ";  
        this.ts.alphabet.add(alphabets[this.ts.alphabet.arr.length]);
        this.printLineAdder();
        this.printTable();
    }
    addState(){
        this.ts.state.add(`q_${this.ts.state.arr.length}`);
        this.printLineAdder();
        this.printTable();
    }
    printTable(){
        //1行目
        let str = "<tr><th>state＼alphabet</th>" + this.ts.alphabet.toString((alphabet) => {
            return `<th onclick="view.setLineAdder('','','','${alphabet}');" ${(alphabet==this.newAlphabet.value)?'class="editing_cell"':''}>${alphabet}</th>`;
        }) + '<th class="non-line"><button onclick="view.addAlphabet();">Add alphabet</button></th></tr>';
        //2~最終前行
        this.ts.state.arr.forEach((state) => {
            str += `<tr><td onclick="view.setLineAdder('','','${state}');"  ${(state==this.newState.value)?'class="editing_cell"':''}>${state}</td>`;
            this.ts.alphabet.arr.forEach((alphabet) => { 
                str += `<td onclick="view.setLineAdder('${state}','${alphabet}');"  ${(alphabet==this.alphabet.value&&state==this.state.value)?'class="editing_cell"':''}>`;
                const transition = this.ts.find(state, alphabet);
                if (transition != undefined) { 
                    str += `${transition.newState},${transition.newAlphabet},${transition.seek}`;
                }
                str += `</td>`;
            });
            str += "</tr>";
        });
        //最終行
        str += `<tr><td class="non-line"><button onclick="view.addState();">Add state</button></td></tr>`;

        const element = document.getElementById("transitionTable");
        element.innerHTML = str;
        this.printSeekTable();
    }
    submit(){
        const form = document.createElement("form");
        const textarea = document.createElement("textarea");

        form.method="get";
        form.action="machine.html";
        textarea.name="completedTransitionCSV";
        textarea.innerHTML = this.ts.toString();
        form.appendChild(textarea);

        document.getElementById('form').appendChild(form);
        form.submit();
    }
    printSeekTable() { 
        const element = document.getElementById("seekTable");
        element.innerHTML = "<tr>" + this.ts.seek.toString((seek) => {
            return `<td onclick="view.setLineAdder('','','','','${seek}');" ${(seek==this.seek.value)?'class="editing_cell"':''}>${seek}</td>`;
        }) +"</tr>";
    }
}

const view= new View();
view.printTable();


