module.exports.checkAuthorizedRequests = async function (
    userForEdit,
    requester,
    isAdminRequest
) {
    const isAdmin = requester.role == 'admin' ? true : false;

    if (isAdminRequest) {
        if (!isAdmin) {
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
    } else {
        if (
            !isAdmin &&
            requester._id.toString() != userForEdit._id.toString()
        ) {
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
};
