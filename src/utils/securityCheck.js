async function checkAuthorizedRequests(idOfUserForEdit, requesterId) {
    // TODO - Export most of check from userService
    // function for approving from Valeri Getsov

    const userForEdit = await User.findById(idOfUserForEdit);
    const requester = await User.findById(requesterId);
    const isAdmin = requester.role == 'admin' ? true : false;

    if (!isAdmin && requester._id != idOfUserForEdit) {
        throw new Error('You do not have rights to modify the record!');
    }
    if (!userForEdit || !requester) {
        throw new Error('User not found');
    }
    if (userForEdit.isDeleted || requester.isDeleted) {
        throw new Error('This profile is deleted!');
    }
    if (!userForEdit.isApproved || !requester.isApproved) {
        throw new Error('This profile is not approved!');
    }
}
module.exports = {
    checkAuthorizedRequests,
};
