const { Group, Uno } = require('../db/DB');
const { setUpUnoSockets, GROUP_CHAT_SUFFIX, GAME_PLAY_SUFFIX } = require('../socket');

module.exports.createGroup = ( req, res, next ) => {
    const group = Group.createGroup(req.body);
    setUpUnoSockets([
        { channel:req.body.groupName+GROUP_CHAT_SUFFIX, controller: Uno.updateGameState },
        { channel:req.body.groupName+GAME_PLAY_SUFFIX, controller: Uno.updateGameState }
    ]);
    res.send( group );
};

module.exports.getAllGroups = ( req, res, next ) => {
    res.send( Group.getAllGroups() );
};

module.exports.createUserInGroup = ( req, res, next ) => {
    const userData = Group.createUser(req.body);
    userData.canSeeGameScreen = true;
    res.send( userData );
};