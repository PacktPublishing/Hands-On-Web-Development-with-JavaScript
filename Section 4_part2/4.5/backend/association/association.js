var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var AssocSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    trim: true
  },
  associationId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

AssocSchema.statics.groups = function(condition) {
  return new Promise((resolve, reject) => {
      this.find(condition, function(err, groupAssocs) {
      const grpIds = groupAssocs.map(obj => obj.associationId).filter((obj,idx,arr) => arr.indexOf(obj) === idx);
      const groups = grpIds.map(grp => {
        const grpObj = {
            userid: grp,
            name: grp,
            type: 'group'
        };
        grpObj.friendList = groupAssocs.filter(obj => obj.associationId === grp).map(obj => obj.userid);
        return grpObj;
      });
      resolve(groups);
    });
  });
};

var assocModel = mongoose.model('Association', AssocSchema);

module.exports = assocModel;