/*
    db = 
    {
        [group_name]: {
            lastPlayedUser: "",
            currentUser: "",
            latestCard: "",
            code:"",
            users: [
                {
                    name: "",
                    code: "",
                    cards: [
                        "",
                        "",
                        ""
                    ]
                }
            ]
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

*/

const db = {

};

class myDB {
    createGroup( groupCreationData ){
        if(!myDB.doesGroupExist(groupCreationData.groupName)) {
            db[groupCreationData.groupName] = {
                lastPlayedUser: "",
                currentUser: "",
                latestCard: "",
                code: groupCreationData.groupCode,
                users:[
                    {
                        name: groupCreationData.userName,
                        code: groupCreationData.userCode,
                        cards: []
                    }
                ]
            }
            return db[groupCreationData.groupName];
        }
        throw new Error(`group ${groupCreationData.groupName} already exists`);
    }

    getAllGroups() {
        return db;
    }

    static doesGroupExist( testGroupName ) {
        return Object.keys(db).some( groupName => groupName === testGroupName);
    }

    static doesUserExistInGroup( groupName, testUserName ) {
        return db[groupName].users.some( user => user.name === testUserName );
    }

    createUserInGroup(userCreationData) {
        
        if( myDB.doesGroupExist(userCreationData.groupName) ){
            
            if( !myDB.doesUserExistInGroup( userCreationData.groupName, userCreationData.userName) && db[userCreationData.groupName].code === userCreationData.groupCode  ){
                db[userCreationData.groupName].users.push({
                    name: userCreationData.userName,
                    code: userCreationData.userCode,
                    cards: []
                });
                return {
                    groupName: userCreationData.groupName,
                    userName: userCreationData.userName,
                    userCode: userCreationData.userCode
                }
            }
            throw new Error(`user ${userCreationData.userName} already exists`);
        }
        throw new Error(`group ${userCreationData.groupName} not found`);
    }
}

module.exports = myDB;