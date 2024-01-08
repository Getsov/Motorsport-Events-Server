module.exports.checkAdmin = async function (requester) {
  if (!requester) {
    throw new Error('User not found!');
  }
  if (requester.isDeleted) {
    throw new Error('Your profile is deleted!');
  }
  if (!requester.isApproved) {
    throw new Error('Your profile is not approved!');
  }
  if (requester.role !== 'admin') {
    throw new Error('You do not have access to these records!');
  }
};
//TODO : export checks same as upper one