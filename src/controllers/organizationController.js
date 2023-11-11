const organizationController = require("express").Router();
const {
  registerOrganization,
  loginOrganization,
  updateOrganization,
} = require("../services/organizationService");

//TODO:  In Future Pavka! Check CORS for requests "req" authorization, in index.js wich is commented!!!
//TODO: In other words, if you turn on cors in index.js, no file will be returned on the client!

organizationController.post("/registerOrganization", async (req, res) => {
  // TODO: Check for passwords and token.
  try {
    const organizationData = {
      name: req.body.name,
      email: req.body.email,
      managerFirstName: req.body.managerFirstName,
      managerLastName: req.body.managerLastName,
      phone: req.body.phone,
      region: req.body.region,
      password: req.body.password,
      address: req.body.address ? req.body.address : "",
    };
    const organization = await registerOrganization(organizationData);

    res.status(200).json(organization);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

organizationController.post("/loginOrganization", async (req, res) => {
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

organizationController.put("/updateOrganization", async (req, res) => {
  try {
    const result = await updateOrganization(req.requester, req.body);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  organizationController,
};
