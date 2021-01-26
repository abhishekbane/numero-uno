const router = require('express').Router();

const groupController = require('../controllers/group');

router.post( '/group', groupController.createGroup);

router.get( '/groups', groupController.getAllGroups );

router.post( '/user',  groupController.createUserInGroup);

module.exports = router;