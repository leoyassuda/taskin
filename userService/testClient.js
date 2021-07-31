const messages = require('./proto/user_pb');
const services = require('./proto/user_grpc_pb');
const grpc = require('@grpc/grpc-js');

function main() {
    const client = new services.UserSvcClient('localhost:8080', grpc.credentials.createInsecure());

    let registerReq = new messages.RegisterRequest();
    registerReq.setName('Doggo');
    registerReq.setEmail('rouf@rouf.com');
    registerReq.setPassword('rouf');

    client.register(registerReq, function (err, response) {
        console.log(response);
    });
}

main();