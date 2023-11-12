const { updateEvent, findEventByID } = require("../services/eventsService");
const { updateOrganization } = require("../services/organizationService");
const { updateUser } = require("../services/userService");

const adminController = require("express").Router();

adminController.put("/updateOrganization", async (req, res) => {
    //TODO - MAKE TEST
  const isAdmin = req.requester.role == "admin";
  if (isAdmin) {
    try {
      const result = await updateOrganization(req.body.id, req.body);
      res.status(200).json(result);
      res.end();
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  } else {
    throw new Error("You do not have rights to these changes!");
  }
});

adminController.put("/updateUser", async (req, res) => {
        //TODO - MAKE TEST
  const isAdmin = req.requester.role == "admin";
  if (isAdmin) {
    try {
      const result = await updateUser(req.body.id, req.body, isAdmin);
      res.status(200).json(result);
      res.end();
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  } else {
    throw new Error("You do not have rights to these changes!");
  }
});

// Update Event By Admin?
adminController.put('/updateEvent', async (req, res) => {
  try {
      const event = await findEventByID(req.body.id);
      if (event === null) {
          throw new Error("Event doesn't exist!");
      }
      // IS not admin or undefined.
      if (req.requester._id === undefined || req.requester.role != 'admin') {
          throw new Error('You are not Admin to modify this Event!');
      }

      const updatedEvent = await updateEvent(req.body, event, req.requester.role === 'admin');

      res.status(200).json(updatedEvent);
      res.end();
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

module.exports = {
  adminController,
};
