const { GROUP_CHAT_SUFFIX, GAME_PLAY_SUFFIX } = require('../socket');
const { cardColour } = require('../unoCards'); 
/*
    db = 
    {
        [group_name]: {
            isGameOn: boolean,
            lastPlayedUser: number,
            currentUser: number,
            latestCard: {
                colour: "",
                value: ""
            },
            code:"",
            [user_name]: {
                num: number
                code: "",
                cards: [
                    "",
                    "",
                    ""
                ],
                canSeeGameScreen: boolean,
                isActive: boolean
            }
        }
    }

    groupCreationData:{
        groupName: string,
        groupCode: string,
        userName: string,
        userCode: string
    }

    userCreationData:{
        groupName: string,
        groupCode: string,
        userName: string,
        userCode: string
    }

    gameState {
        groupName: string,
        groupCode: string,
        latestCard: "",
        finalCard: "", //this has an user selected colour if the latestCard is a wild card
        userName: "",
        userPassword: "",
        userNum: number
    }

    unoCard: {
        colour: string,
        value: string
    }

*/

const uno = require( '../unoCards' );
const CARDS_PER_USER = 7;

const db = {

};

class Group {

    static doesGroupExist( testGroupName ) {
        return !!db[testGroupName];
    }

    static doesUserExistInGroup( groupName, testUserName ) {
        return !!db[groupName][testUserName];
    }

    static isValidGroup( groupName, groupCode ) {
        console.log({ groupName, groupCode });
        return !!db[groupName] && db[groupName].code === groupCode;
    }

    static isValidUser( { userName, userCode, groupName, groupCode } ) {
        console.log({ userName, userCode, groupName, groupCode });
        return (
            Group.isValidGroup(groupName, groupCode) && 
            (Group.doesUserExistInGroup(groupName, userName) && db[groupName][userName].code === userCode )
        );
    }

    static getUserNumber( groupName, userName ) {
        return db[groupName].user
    }

    static isValidPlayer( playerData ) {
        console.log(playerData);
        console.log(Group.isValidUser(playerData));
        console.log(db[playerData.groupName][playerData.userName].num === playerData.num);
        console.log(db[playerData.groupName].currentUser === playerData.num);

        return (
            Group.isValidUser(playerData) &&
            db[playerData.groupName][playerData.userName].num === playerData.num &&
            db[playerData.groupName].currentUser === playerData.num
        );
    }

    static getAllGroups() {
        return db;
    }

    static getGroup(groupName, groupCode) {
        if(Group.isValidGroup( groupName, groupCode )) {
            return db[groupName];
        }
    }

    static setNextPlayer( groupName ) {
        const currentUser = db[groupName].currentUser
        const newUser = currentUser >= db[groupName].totalUsers ? 1 : currentUser+1;
        db[groupName].lastPlayedUser = currentUser;
        db[groupName].currentUser = newUser;

        return newUser;
    }

    static createGroup( groupCreationData ){
        if(!Group.doesGroupExist(groupCreationData.groupName)) {
            db[groupCreationData.groupName] = {
                lastPlayedUser: 0,
                currentUser: 1,
                latestCard: null,
                totalUsers: 1,
                code: groupCreationData.groupCode,
                groupChatChannel: groupCreationData.groupName+GROUP_CHAT_SUFFIX,
                gamePlayChannel: groupCreationData.groupName+GAME_PLAY_SUFFIX,
                [groupCreationData.userName]: {
                    num: 1,
                    code: groupCreationData.userCode,
                    cards: uno.getCards(CARDS_PER_USER),
                    canSeeGameScreen: true,
                    isActive: true
                }
            }
            return db[groupCreationData.groupName];
        }
        throw new Error(`group ${groupCreationData.groupName} already exists`);
    }

    static createUser(userCreationData) {
        if( Group.doesGroupExist(userCreationData.groupName) ){
            
            if( !Group.doesUserExistInGroup( userCreationData.groupName, userCreationData.userName) && db[userCreationData.groupName].code === userCreationData.groupCode  ){
                const totalUsers = db[userCreationData.groupName].totalUsers+1;

                db[userCreationData.groupName].totalUsers = totalUsers;
                db[userCreationData.groupName][userCreationData.userName] = {
                    num: totalUsers,
                    code: userCreationData.userCode,
                    cards: uno.getCards(CARDS_PER_USER),
                    canSeeGameScreen: true,
                    isActive: true
                };

                return {
                    num: totalUsers,
                    groupName: userCreationData.groupName,
                    userName: userCreationData.userName,
                    userCode: userCreationData.userCode,
                    canSeeGameScreen: true,
                    groupChatChannel: userCreationData.groupName+GROUP_CHAT_SUFFIX,
                    gamePlayChannel: userCreationData.groupName+GAME_PLAY_SUFFIX,
                }
            }
            throw new Error(`user ${userCreationData.userName} already exists`);
        }
        throw new Error(`group ${userCreationData.groupName} not found`);
    }

    static removeCard(groupName, userName, userCard) {
        db[groupName][userName].cards = db[groupName][userName].cards.filter( card => {
            return !(card.colour === userCard.colour &&
            card.value === userCard.value);
        });
    }
}

class Uno {
    static updateGameState( newGameState ) {
        console.log('New Game State: ', newGameState);
        if(Group.isValidPlayer(newGameState) && Uno.isNewCardValid( newGameState.latestCard, newGameState.groupName, newGameState.groupCode )){
            const group = Group.getGroup( newGameState.groupName, newGameState.groupCode );
            console.log(group);

            group.latestCard = newGameState.finalCard;
            Group.setNextPlayer(newGameState.groupName);
            Group.removeCard( newGameState.groupName, newGameState.userName, newGameState.latestCard );

            return {
                currentUser: group.currentUser,
                latestCard: group.latestCard
            }
        }
    }

    static isNewCardValid = ( newCard, groupName, groupCode ) => {
        console.log(newCard);
        console.log(groupName);
        const latestCard = Group.getGroup(groupName, groupCode).latestCard;
        if(
            latestCard === null ||
            newCard.colour === latestCard.colour || 
            newCard.value === latestCard.value ||
            newCard.colour === cardColour.WILD 
        ) {
            return true
        }
    }
}

module.exports = {
    Group: Group,
    Uno: Uno
};