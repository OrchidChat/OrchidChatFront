function createKeys(){
    return Module.createKeys().split(" ")
}

function encrypt(message, publicKey, module){
    let vectorPointer = Module.encryptMessage(message, publicKey, module);
    const ptr = Module.getVectorPointer(vectorPointer);
    const size = Module.getVectorSize(vectorPointer);

    return new Uint8Array(Module.HEAPU8.buffer, ptr, size);
}

function decrypt(message, privateKey, module){
    return Module.decryptMessage(message, privateKey, module);
}




