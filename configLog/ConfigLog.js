class ConfigLog extends Array {
    constructor() {
        super();
    }
    duplicated(config) {
        if (this.find((elm)=>{return JSON.stringify(config)==elm }) == undefined)
            return true;
        return false;
    }
    add(config) {
        if (this.duplicated(config) == false)
            return -1;
        this.push(JSON.stringify(config));
        return 0;
    }
}

const cfg = { a: 1 };
const configLog = new ConfigLog();
configLog.add(cfg);
cfg.a = 2;
console.log(`configLog.add(cfg) : ${configLog.add(cfg)}`);
console.log(`configLog.add(cfg) : ${configLog.add(cfg)}`);
console.log(`configLog.duplicated(cfg) : ${configLog.duplicated(cfg)}`);

console.log(`cfg.a = 4 : ${cfg.a = 4}`);
console.log(`configLog.duplicated(cfg) : ${configLog.duplicated(cfg)}`);

console.log(`configLog.add(cfg) : ${configLog.add(cfg)}`);
console.log(`configLog.duplicated(cfg) : ${configLog.duplicated(cfg)}`);