module.exports.checkAuthorizedRequests = async function (
    userForEdit,
    requester,
    isAdmin
) {
    if (requester.isDeleted) {
        throw new Error('Your profile is deleted!');
    }

    if (!requester.isApproved) {
        throw new Error('Your profile is not approved!');
    }

    if (!isAdmin && requester._id.toString() != userForEdit._id.toString()) {
        throw new Error('You do not have rights to modify the record!');
    }

    if (!userForEdit || !requester) {
        throw new Error('User not found');
    }

    if (userForEdit.isDeleted) {
        throw new Error('This profile is deleted!');
    }

    if (!userForEdit.isApproved) {
        throw new Error('This profile is not approved!');
    }

    // if (isAdminRequest) {
    //     if (!isAdmin) {
    //         throw new Error('You do not have rights to modify the record!');
    //     }
    //     if (!userForEdit || !requester) {
    //         throw new Error('User not found');
    //     }
    //     if (editDeleteRequest) {

    //     } else if (!editDeleteRequest && editApproveRequest) {
    //         if (userForEdit.isDeleted ) {
    //             throw new Error('This profile is deleted!');
    //         }

    //     } else {
    //         if (userForEdit.isDeleted || requester.isDeleted) {
    //             throw new Error('This profile is deleted!');
    //         }
    //         if (!userForEdit.isApproved || !requester.isApproved) {
    //             throw new Error('This profile is not approved!');
    //         }
    //     }
    // } else {

    // }
};
