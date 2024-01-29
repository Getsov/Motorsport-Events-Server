module.exports.checkAuthorizedRequests = async function (
  userForEdit,
  requester,
  isAdmin
) {
  //If the requester or the user which will be edit can't be found in DB
  if (!userForEdit || !requester) {
    throw new Error('User not found');
  }

  //If the requester have property "isDeleted" : true
  if (requester.isDeleted) {
    throw new Error('Your profile is deleted!');
  }

  //If the requester have property "isApproved" : false
  if (!requester.isApproved) {
    throw new Error('Your profile is not approved!');
  }

  //If the requester is not "admin" or is not the user itslef
  if (!isAdmin && requester._id.toString() != userForEdit._id.toString()) {
    throw new Error('You do not have rights to modify the record!');
  }

  //If the user for edit have property "isDeleted" : true
  if (userForEdit.isDeleted) {
    throw new Error('This profile is deleted!');
  }

  //If the user for edit have property "isApproved" : false
  if (!userForEdit.isApproved) {
    throw new Error('This profile is not approved!');
  }
};
