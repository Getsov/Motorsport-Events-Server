const organizationController = require('express').Router();
const {
    registerOrganization,
    loginOrganization,
    updateOrganizationInfo,
    updateOrganizationEmail,
    updateOrganizationPassword,
} = require('../services/organizationService');

organizationController.post('/registerOrganization', async (req, res) => {
    try {
        if (req.body.password !== req.body.repass) {
            throw new Error('Password dismatch!');
        }
        const organizationData = {
            name: req.body.name,
            email: req.body.email,
            managerFirstName: req.body.managerFirstName,
            managerLastName: req.body.managerLastName,
            phone: req.body.phone,
            region: req.body.region,
            password: req.body.password,
            address: req.body.address ? req.body.address : '',
        };
        const organization = await registerOrganization(organizationData);

        res.status(200).json(organization);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

organizationController.post('/loginOrganization', async (req, res) => {
    try {
        const organization = await loginOrganization(
            req.body.email,
            req.body.password
        );
        res.status(200).json(organization);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

organizationController.put('/editOrganizationInfo/:id', async (req, res) => {
    const organizationId = req.params.id;
    const isAdmin = req.requester.role == 'admin';
    try {
        if (req.requester._id == organizationId || isAdmin) {
            const result = await updateOrganizationInfo(
                organizationId,
                req.body,
                isAdmin
            );
            res.status(200).json(result);
            res.end();
        } else {
            throw new Error('You do not have rights to modify the record!');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

organizationController.put('/editOrganizationEmail/:id', async (req, res) => {
    const organizationId = req.params.id;
    const isAdmin = req.requester.role == 'admin';
    try {
        if (req.requester._id == organizationId || isAdmin) {
            const result = await updateOrganizationEmail(
                organizationId,
                req.body
            );
            res.status(200).json(result);
            res.end();
        } else {
            throw new Error('You do not have rights to modify the record!');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

organizationController.put(
    '/editOrganizationPassword/:id',
    async (req, res) => {
        const organizationId = req.params.id;
        const isAdmin = req.requester.role == 'admin';
        try {
            if (req.body.newPassword !== req.body.newRepass) {
                throw new Error('Password dismatch!');
            }

            if (req.requester._id == organizationId || isAdmin) {
                const result = await updateOrganizationPassword(
                    organizationId,
                    req.body,
                    isAdmin
                );
                res.status(200).json(result);
                res.end();
            } else {
                throw new Error('You do not have rights to modify the record!');
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
    }
);

module.exports = {
    organizationController,
};
