class TransitionsEditorView{
    constructor(instanceName){
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
        this.instanceName = instanceName;
    }

    onChangeSelected() {
        this.selected.state = this.state.value;
        this.selected.alphabet = this.alphabet.value;
        this.selected.newState = this.newState.value;
        this.selected.newAlphabet = this.newAlphabet.value;
        this.seek.state = this.seek.value;
        this.printTable();
        this.printSeekTable();
    }
    onStateClicked(newState) {
        this.selected.newState = newState;
        this.print();
    }
    onAlphabetClicked(newAlphabet) {
        this.selected.newAlphabet = newAlphabet;
        this.print();
    }
    onCellClicked(state, alphabet) {
        this.selected.state = state;
        this.selected.alphabet = alphabet;
        this.print();
    }
    onSeekClicked(seek) {
        this.selected.seek = seek;
        this.print();
    }

    addAlphabet(){
//        const alphabets="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const alphabets = "01XAB_23456789abcdefghijklmnopqrstuvwxyzCDEFGHIJKLMNOPQRSTUVWYZ";  
        this.ts.alphabet.add(alphabets[this.ts.alphabet.arr.length]);
        this.print();
    }
    addState(){
        this.ts.state.add(`q_${this.ts.state.arr.length}`);
        this.print();
    }
    addNewTransition() {
        if (this.ts.state.arr.length == 0 || this.ts.alphabet.arr.length == 0)
            return -1;
        const transition = new Transition(this.state.value,this.alphabet.value,this.newState.value,this.newAlphabet.value,this.seek.value);
//        this.ts.add(transition);
        this.ts.rewite(transition);
        this.printTable();
    }

    printLineAdder() {
        const optionPrint = function (str = "") {
            return function (elm) {
                return `<option value="${elm}"${(elm == str) ? ' selected ' : ''}>${elm}</option>\n`;
            };
        };
        this.state.innerHTML = this.ts.state.toString(optionPrint(this.selected.state));
        this.alphabet.innerHTML = this.ts.alphabet.toString(optionPrint(this.selected.alphabet));
        this.newState.innerHTML = this.ts.state.toStringWithSpetialState(optionPrint(this.selected.newState));
        this.newAlphabet.innerHTML = this.ts.alphabet.toString(optionPrint(this.selected.newAlphabet));
        this.seek.innerHTML = this.ts.seek.toString(optionPrint(this.selected.seek));
    }
    printTable(){
        //1行目
        let str = "<tr><th>state＼alphabet</th>" + this.ts.alphabet.toString((alphabet) => {
            return `<th onclick="${this.instanceName}.onAlphabetClicked('${alphabet}');" ${(alphabet==this.newAlphabet.value)?'class="selected"':''}>${alphabet}</th>`;
        }) + `<th class="non-line"><button onclick="${this.instanceName}.addAlphabet();">Add alphabet</button></th></tr>`;
        //2~最終前行
        this.ts.state.arr.forEach((state) => {
            str += `<tr><td onclick="${this.instanceName}.onStateClicked('${state}');"  ${(state==this.newState.value)?'class="selected"':''}>${state}</td>`;
            this.ts.alphabet.arr.forEach((alphabet) => { 
                str += `<td onclick="${this.instanceName}.onCellClicked('${state}','${alphabet}');"  ${(alphabet==this.alphabet.value&&state==this.state.value)?'class="selected"':''}>`;
                const transition = this.ts.find(state, alphabet);
                if (transition != undefined) { 
                    str += `${transition.newState},${transition.newAlphabet},${transition.seek}`;
                }
                str += `</td>`;
            });
            str += "</tr>";
        });
        //最終行
        str += `<tr><td class="non-line"><button onclick="${this.instanceName}.addState();">Add state</button></td></tr>`;

        const element = document.getElementById("transitionTable");
        element.innerHTML = str;
    }
    printSeekTable() { 
        const element = document.getElementById("seekTable");
        element.innerHTML = "<tr>" + this.ts.seek.toString((seek) => {
            return `<td onclick="${this.instanceName}.onSeekClicked('${seek}');" ${(seek==this.seek.value)?'class="selected"':''}>${seek}</td>`;
        }) +"</tr>";
    }
    print() {
        this.printLineAdder();
        this.printTable();
        this.printSeekTable();
    }
    submit(){
        const form = document.createElement("form");
        const textarea = document.createElement("textarea");

        form.method="get";
        form.action="index.html";
        textarea.name="completedTransitionCSV";
        textarea.innerHTML = this.ts.toString();
        form.appendChild(textarea);

        document.getElementById('form').appendChild(form);
        form.submit();
    }
}