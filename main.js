let CryptoJS = require('crypto-js');
let bcrypt = require('bcrypt');

let INC = 1;

let defaultData = {
    ownerName: "Delta",
    address: "Faridabad",
    mobile: "9876543210", 
    phone: "+911242270524", 
    value: "Keep Calm and Listen ",
    password : "1234567890"
}

function hash(data){
    return CryptoJS.MD5(data).toString();
}

function hashPassword(password){
    return bcrypt.hashSync(password, 10);
}
function comparePassword(currentPassword, savedPassword){
    let val = bcrypt.compareSync(currentPassword, savedPassword)
    console.log(val);
    return val;
}
function encryptData(data, password){
    return CryptoJS.AES.encrypt(JSON.stringify(data), password);
}

function decryptData(data, password){
    var bytes  = CryptoJS.AES.decrypt(data.toString(), password);
    // return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return bytes;
}

class Details{
    constructor(ownerName,  address, mobile, phone, value, password){
        this.data = encryptData({
            ownerName : ownerName,
            address : address,
            mobile: mobile,
            phone : phone,
            value : value,
        }, password);
    }

    getData(password){
        return decryptData(this.data, password)
    }
}

class Node{
    constructor(ownerName, address, mobile, phone, algoKey, value, password,level, nodeNumber, ReferenceNodeId=null){
        this.password = password;
        this.algoKey = algoKey
        this.Data = new Details(ownerName,  address, mobile, phone, value, this.algoKey);
        this.TimeStamp = new Date();
        this.NodeNumber = nodeNumber
        this.NodeId = INC++;
        this.level = level;
        // address of parent node
        this.ReferenceNodeId = ReferenceNodeId;
        
        this.ChildNodeId = new Set;

        // address of parent of child
        this.ReferenceChildNodeId = new Set
    }
}

class Tree{
    constructor(level = 0){
        this.authenticated = false;
        this.password = hashPassword(defaultData.password)
        this.algoKey = defaultData.ownerName+"::::"+this.password;
        this.inc = 0;
        this.level = level;
        this.childSet = new Set;
        this.root = new Node(defaultData.ownerName,
            defaultData.address,
            defaultData.mobile,
            defaultData.phone,
            this.algoKey,
            defaultData.value,
            this.password,
            level,
            ++this.inc);
        // console.log(this.root)
    }
    addChild(ref, value, ReferenceNodeId=null){
        this = ref;
        let data = this.root.Data.getData(this.password)
        let child = new Node(data.ownerName,
            data.address,
            data.mobile,
            data.phone,
            this.algoKey, 
            value,
            this.password,
            this.level+1,
            ++this.inc,
            this)
        this.root.ChildNodeId.add(child.NodeId);
        this.root.ReferenceChildNodeId.add(child);
    }
    authenticate(ownerName, password){
        if(comparePassword(password, this.password)){
            let algo = ownerName+"::::"+this.password
            if(algo === this.algoKey){
                console.log("User Authenticated")
                this.authenticated = true;
                return;
            }
        }
        console.log("Authentication failed");
    }
    dive(node, target, value){
        if(node.NodeId == target){
            this.addChild(node, value);
        }else{
            if(node.ChildNodeId.has(target)){
                let iterator = node.ReferenceChildNodeId.values();
                while(iterator.value && iterator.value.NodeId !== target){
                    iterator = iterator.next();
                }
                let obj = iterator.value();
                this.addChild(obj, value);
                return true;
            }else{
                let iterator = node.ReferenceChildNodeId.values();
                while(iterator.value && ! this.dive(iterator.value, target, value){
                    iterator = iterator.next();
                }
                return iterator === undefined ? false : true;
            }
        }
    }
}


class Main{
    constructor(){
        this.node = new Tree(0);
    }
    createMultiSet(){
        let name = this.node.root.NodeNumber
        let value = this.node;
        this.node = {};
        this.node[name] = value;
    }
}
