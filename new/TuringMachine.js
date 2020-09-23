class TuringMachine{
    constructor(tape,transitions){
        this.config = new Config(`_${tape}_`,HEAD_INITIAL_POSITION,STATE_INITIAL);
        this.transitions = transitions;

        this.isWorking = true;
        this.configLog = new ConfigLog();
        this.configLog.add(this.config.dictionary());
/*      this.canvas = document.getElementById('turingMachineCanvas');
        if ( ! this.canvas || ! this.canvas.getContext )
            console.log("Error, canvas is false or canvas.getContext is false");
        this.ctx = this.canvas.getContext('2d');
        */
    }
    nextStep(){
        if(this.isWorking==false)
            return;
        this.updateConfig();
        this.isStopped();
        this.isLooped();
        this.configLog.add(this.config.dictionary());
        this.printTape2console();
    }
    updateConfig() {// 状態遷移
        const transition = this.transitions.find(this.config.state, this.config.tape[this.config.head]);
        if (transition == undefined) {
            console.log("(!!STOP!!) It is stopped. ");
            this.isWorking = false;
            return-1;
        }
        this.config.state = transition.newState;
        this.config.rewiteTapeHead(transition.newAlphabet);
        this.config.moveHead(transition.seek);
        return 0;
    }
    isStopped() {
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
    isLooped() {
        if (this.configLog.duplicated(this.config.dictionary()) == true) {
            console.log("(!!WILL NOT STOP!!) It is looped. ");
            this.isWorking = false;
        }
    }
    printTape2console(){
        console.log(this.config.tape +"   [status:"+this.config.state+"]");
        let text="";
        for(;text.length<this.config.head;text = text + " ");
        console.log(text + "^");
        console.log(this.configLog);
    }
}
class Config {
    constructor(tape, head, state) {
        this.tape = tape;
        this.head = head;
        this.state = state;
    }
    moveHead(direction) {
        switch(direction){
            case SEEK_DIRECTION_LEFT:
                this.head--;
                return;
            case SEEK_DIRECTION_RIGHT:
                this.head++;
                return;
            case SEEK_DIRECTION_STOP:
                return;
        }
    }
    rewiteTapeHead(newAlphabet) {
        this.tape = this.tape.slice(0, this.head) + newAlphabet + this.tape.slice(this.head + 1);
        this.updateTapeMargin();
    }
    updateTapeMargin() {
        if (this.tape[0] != '_') {
            this.tape = `_${this.tape}`;
            this.head++;
        }
        if (this.tape[this.tape.length - 1] != '_')
            this.tape = `${this.tape}_`;
    }
    dictionary() {
        return { tape: this.tape, state: this.state, head: this.head };
    }
}
class ConfigLog extends Array {
    constructor() {
        super();
    }
    duplicated(config) {
        if (this.find((elm)=>{return JSON.stringify(config)==elm }) == undefined)
            return false;
        return true;
    }
    add(config) {
        if (this.duplicated(config) == true)
            return -1;
        this.push(JSON.stringify(config));
        return 0;
    }
}