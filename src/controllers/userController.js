const bcrypt = require('bcryptjs');
const userController = require('express').Router();
const {
  registerUser,
  loginUser,
  editUserInfo,
  editUserEmail,
  editUserPassword,
  returnAllCreatedEvents,
  returnAllFavouriteEvents,
  editUserRole,
  getAllOrganizersForApproval,
  getAllOrganizers,
  getAllRegularUsers,
  getAllAdmins,
  getAllUsers,
  editDeletedProperty,
  approveUser,
  getUserById,
} = require('../services/userService');

const { validPassword } = require('../shared/sharedRegex');
const { checkRequestData } = require('../utils/checkData');
const { resetPassword } = require('../services/emailService');
//TODO: getAllAdminsForApproval
userController.post('/register', async (req, res) => {
  try {
    const passwordTest = validPassword.test(req.body.password);
    checkRequestData(req.body);
    if (!passwordTest) {
      throw new Error('Password cannot contain spaces!');
    }
    if (!req.body.password) {
      throw new Error('Password is required!');
    }
    if (req.body.password.length < 6) {
      throw new Error('Password must be at least 6 characters long!');
    }
    if (req.body.password.length > 24) {
      throw new Error('Password must be maximum 24 characters long!');
    }
    if (req.body.password !== req.body.repassword) {
      throw new Error('Password dismatch!');
    }
    if (!req.body.email || req.body.email == '') {
      throw new Error('Email is required!');
    }

    const userData = {
      email: req.body.email,
      firstName: req.body.firstName ? req.body.firstName : '',
      lastName: req.body.lastName ? req.body.lastName : '',
      role: req.body.role ? req.body.role : 'regular',
      region: req.body.region ? req.body.region : '',
      phone: req.body.phone ? req.body.phone : '',
      hashedPassword: await bcrypt.hash(req.body.password, 10),
    };

    if (userData.role == 'regular') {
      userData.isApproved = true;
    }

    if (req.body.role == 'organizer') {
      if (!req.body.organizatorName) {
        throw new Error('Name of organizator is required!');
      }
      if (!req.body.phone) {
        throw new Error('Phone is required!');
      }
      userData.organizatorName = req.body.organizatorName;
    }

    const user = await registerUser(userData);
    res.status(200).json(user);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.post('/login', async (req, res) => {
  try {
    checkRequestData(req.body);
    const user = await loginUser(req.body.email, req.body.password);
    res.status(200).json(user);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/editUserInfo/:id', async (req, res) => {
  try {
    const userForEdit = req.params.id;
    const requester = req.requester._id;
    checkRequestData(req.body);
    const result = await editUserInfo(userForEdit, req.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/editUserEmail/:id', async (req, res) => {
  try {
    const userForEdit = req.params.id;
    const requester = req.requester._id;
    checkRequestData(req.body);
    const result = await editUserEmail(userForEdit, req.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/editUserPassword/:id', async (req, res) => {
  try {
    const userForEdit = req.params.id;
    const requester = req.requester._id;
    checkRequestData(req.body);
    if (req.body.newPassword !== req.body.newRepassword) {
      throw new Error('Password dismatch!');
    }
    const result = await editUserPassword(userForEdit, req.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/editUserRole/:id', async (req, res) => {
  try {
    const userForEdit = req.params.id;
    const requester = req.requester._id;
    checkRequestData(req.body);
    const result = await editUserRole(userForEdit, req.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/editDeleted/:id', async (req, res) => {
  try {
    const userForEdit = req.params.id;
    const requester = req.requester._id;
    checkRequestData(req.body);
    const result = await editDeletedProperty(userForEdit, req.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/getUserById/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const requesterId = req.requester?._id;
    const user = await getUserById(userId, requesterId);

    res.send(user);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approving / Disapproving user/organizer
userController.put('/approveUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const requesterId = req.requester._id;
    checkRequestData(req.body);

    const result = await approveUser(userId, requesterId, req.body);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/getMyEvents', async (req, res) => {
  try {
    const userId = req.requester?._id;
    const result = await returnAllCreatedEvents(userId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/getMyFavourites', async (req, res) => {
  try {
    const userId = req.requester?._id;
    const result = await returnAllFavouriteEvents(userId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/organizersForApproval', async (req, res) => {
  try {
    const requesterId = req.requester._id;
    const result = await getAllOrganizersForApproval(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/allOrganizers', async (req, res) => {
  //TODO: what we want to return - all organizer or only already approved organizer
  try {
    const requesterId = req.requester._id;
    const result = await getAllOrganizers(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/allRegularUsers', async (req, res) => {
  try {
    const requesterId = req.requester._id;
    const result = await getAllRegularUsers(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/allAdmins', async (req, res) => {
  try {
    const requesterId = req.requester._id;
    const result = await getAllAdmins(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/allUsers', async (req, res) => {
  try {
    const requesterId = req.requester._id;
    const result = await getAllUsers(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.post('/resetPassword', async (req, res) => {
  try {
    if (req.body.to === undefined) {
      throw new Error('Email is not passed!');
    }
    if (req.body.to === '') {
      throw new Error('Email field is empty!');
    }

    const result = await resetPassword(req.body);

    res.status(200).json({ message: 'Email sent successfully' });
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// Unmatched route
userController.use((req, res) => {
  res.status(404).json({
    message: 'Route not found or request is not right!',
  });
});

module.exports = {
  userController,
};

/*
Ready user for register: 
    -   "regular":

    "email": "pavel@abv.bg",
    "firstName": "Pavel",
    "lastName": "Dimitrov",
    "region": "Бургас",
    "address": "Някъде в Бургас!",
    "phone": "0888888888",
    "password": "123",
    "repass": "123"
    
*/
