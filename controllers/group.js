const myDB = require('../db/myDB');

const db = new myDB();

module.exports.createGroup = ( req, res, next ) => {
    const group = db.createGroup(req.body);

    res.send( group );
};

module.exports.getAllGroups = ( req, res, next ) => {
    res.send( db.getAllGroups() );
};

module.exports.createUserInGroup = ( req, res, next ) => {
    const userData = db.createUserInGroup(req.body);
    res.send( userData );
};