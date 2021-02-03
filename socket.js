let io;

const GAME_PLAY_SUFFIX = "_gamePlay";
const GROUP_CHAT_SUFFIX = "_groupChat";

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: "*"
            }
        });
        return io;
    },
    getIO: () => {
        if(!io) {
            throw new Error("IO not initialized.");
        }
        return io;
    },
    //socketData = [{channel: string, controller: (data) => {}}];
    setUpUnoSockets: ( socketDataArr ) => {
        if(!io) {
            throw new Error("IO not initialized");
        }
        io.on('connection', (socket) => {
            io.emit('channel1', {
                Test1: 'Send test1'
            });
            socket.on('channel1', (data) => console.log(data));
            socketDataArr.map( socketData => {
                console.log(socketData);
                socket.on(socketData.channel, socketData.controller);
            } );
        });
    },
    GAME_PLAY_SUFFIX: GAME_PLAY_SUFFIX,
    GROUP_CHAT_SUFFIX: GROUP_CHAT_SUFFIX
};