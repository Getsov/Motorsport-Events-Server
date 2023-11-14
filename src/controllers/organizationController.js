const organizationController = require('express').Router();
const {
  registerOrganization,
  loginOrganization,
  updateOrganization,
} = require('../services/organizationService');

//TODO:  In Future Pavka! Check CORS for requests 'req' authorization, in index.js wich is commented!!!
//TODO: In other words, if you turn on cors in index.js, no file will be returned on the client!

organizationController.post('/registerOrganization', async (req, res) => {
  // TODO: Check for passwords and token.
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

organizationController.put('/:id', async (req, res) => {
  const id = req.params.id;
  const isAdmin = req.requester.role == 'admin';
  try {
    //TODO - HOW WE MANAGE WITH REPASS?
    // if (req.body.password !== req.body.repass) {
    //   throw new Error('Password dismatch!');
    // }
    //if not the same organization or not admin cannot
    if (req.requester._id == id || isAdmin) {
      const result = await updateOrganization(id, req.body, isAdmin);
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

module.exports = {
  organizationController,
};
