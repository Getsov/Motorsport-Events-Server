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
  deleteRestoreSingleUser,
  deleteRestoreMultipleUsers,
  approveDisapproveSingleUser,
  getUserById,
  getApprovedAdmins,
  getAllAdminsForApprovals,
  approveDisapproveMultipleUsers,
  getApprovedOrganizators,
  getMyEventsForApproval,
  getUserForTokenGeneration,
} = require('../services/userService');

const { validPassword } = require('../shared/sharedRegex');
const { checkRequestData } = require('../utils/checkData');
const { resetPassword } = require('../services/emailService');
const {
  getPastEvents,
  getUpcomingEvents,
} = require('../services/eventService');
const { parseRefreshToken } = require('../utils/parseToken');

userController.post('/register', async (req, res) => {
  try {
    const passwordTest = validPassword.test(req.body.password);
    checkRequestData(req.body);
    if (!passwordTest) {
      throw new Error('Паролата не може да съдържа интервали!');
    }
    if (!req.body.password) {
      throw new Error('Паролата е задължителна!');
    }
    if (req.body.password.length < 6) {
      throw new Error('Паролата трябва да бъде поне 6 символа дълга!');
    }
    if (req.body.password.length > 24) {
      throw new Error('Паролата трябва да бъде максимум 24 символа дълга!');
    }
    if (req.body.password !== req.body.repassword) {
      throw new Error('Паролите не съвпадат!');
    }
    if (!req.body.email || req.body.email == '') {
      throw new Error('Имейлът е задължителен!');
    }

    const userDataFromRequest = {
      email: req.body.email,
      firstName: req.body.firstName ? req.body.firstName : '',
      lastName: req.body.lastName ? req.body.lastName : '',
      role: req.body.role ? req.body.role : 'regular',
      region: req.body.region ? req.body.region : '',
      phone: req.body.phone ? req.body.phone : '',
      hashedPassword: await bcrypt.hash(req.body.password, 10),
    };

    if (userDataFromRequest.role == 'regular') {
      userDataFromRequest.isApproved = true;
    }

    if (req.body.role == 'organizer') {
      if (!req.body.organizatorName) {
        throw new Error('Името на организатора е задължително!');
      }
      if (!req.body.phone) {
        throw new Error('Телефонът е задължителен!');
      }
      userDataFromRequest.organizatorName = req.body.organizatorName;
    }

    const user = await registerUser(userDataFromRequest);
    const userData = user.userData;
    const accessToken = user.accessToken;
    const refreshToken = user.refreshToken;
    res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      })
      .send({ userData, accessToken });
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.post('/login', async (req, res) => {
  try {
    checkRequestData(req.body);
    const user = await loginUser(req.body.email, req.body.password);
    const userData = user.userData;
    const accessToken = user.accessToken;
    const refreshToken = user.refreshToken;
    res
      .status(200)
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      })
      .send({ userData, accessToken });
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/editUserInfo/:id', async (req, res) => {
  try {
    const userForEdit = req.params?.id;

    if (userForEdit === ',' || userForEdit === '{id}') {
      throw new Error('Липсва идентификатор "id" на потребителя!');
    }

    const requester = req.requester?._id;
    checkRequestData(req?.body);
    const result = await editUserInfo(userForEdit, req?.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/editUserEmail/:id', async (req, res) => {
  try {
    const userForEdit = req.params?.id;

    if (userForEdit === ',' || userForEdit === '{id}') {
      throw new Error('Липсва идентификатор "id" на потребителя!');
    }

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
    const requester = req.requester?._id;

    if (userForEdit === ',' || userForEdit === '{id}') {
      throw new Error('Липсва идентификатор "id" на потребителя!');
    }

    if (!requester) {
      throw new Error('Requester "_id" is missing!');
    }

    checkRequestData(req.body);
    if (req.body.newPassword !== req.body.newRepassword) {
      throw new Error('Паролите не съвпадат!');
    }
    const result = await editUserPassword(userForEdit, req.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.put('/editUserRole/:id', async (req, res) => {
  try {
    const userForEdit = req.params?.id;
    const requester = req.requester?._id;

    if (userForEdit === ',' || userForEdit === '{id}') {
      throw new Error('Липсва идентификатор "id" на потребителя!');
    }

    checkRequestData(req.body);
    const result = await editUserRole(userForEdit, req.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/deleteRestoreUser/:id', async (req, res) => {
  try {
    const userForEdit = req.params?.id;
    const requester = req.requester?._id;

    if (userForEdit === ',' || userForEdit === '{id}') {
      throw new Error('Липсва идентификатор "id" на потребителя!');
    }

    checkRequestData(req.body);
    const result = await deleteRestoreSingleUser(
      userForEdit,
      req.body,
      requester
    );
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/deleteRestoreUsers', async (req, res) => {
  try {
    const requester = req.requester?._id;

    checkRequestData(req.body);
    const result = await deleteRestoreMultipleUsers(req.body, requester);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/getUserById/:id', async (req, res) => {
  try {
    const userId = req.params?.id;
    const requesterId = req.requester?._id;

    if (userId === ',' || userId === '{id}') {
      throw new Error('Липсва идентификатор "id" на потребителя!');
    }

    const user = await getUserById(userId, requesterId);

    res.send(user);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approving / Disapproving user/organizer
userController.put('/approveDisapproveUser/:id', async (req, res) => {
  try {
    const userId = req.params?.id;
    const requesterId = req.requester?._id;

    if (userId === ',' || userId === '{id}') {
      throw new Error('Липсва идентификатор "id" на потребителя!');
    }

    checkRequestData(req.body);

    const result = await approveDisapproveSingleUser(
      userId,
      requesterId,
      req.body
    );
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put('/approveDisapproveUsers', async (req, res) => {
  try {
    const requester = req.requester?._id;
    checkRequestData(req.body);
    const result = await approveDisapproveMultipleUsers(req.body, requester);
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
    const result = await returnAllFavouriteEvents(userId, req.query);

    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/getApprovedAdmins', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    const result = await getApprovedAdmins(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/getAllAdminsForApproval', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    const result = await getAllAdminsForApprovals(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/getApprovedOrganizators', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    const result = await getApprovedOrganizators(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/getAllOrganizersForApproval', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    const result = await getAllOrganizersForApproval(requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/allOrganizers', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    const query = req.query;
    const result = await getAllOrganizers(requesterId, query);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/allRegularUsers', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    const query = req.query;
    const result = await getAllRegularUsers(requesterId, query);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/allAdmins', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    const query = req.query;
    const result = await getAllAdmins(requesterId, query);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/allUsers', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    const query = req.query;
    const result = await getAllUsers(requesterId, query);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/myEventsForApproval', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    if (!requesterId) {
      throw new Error('Влезте в профила си!');
    }
    const result = await getMyEventsForApproval(requesterId, req.query);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/myUpcomingEvents', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    if (!requesterId) {
      throw new Error('Влезте в профила си!');
    }
    const result = await getUpcomingEvents(req.query, requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/myPastEvents', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    if (!requesterId) {
      throw new Error('Влезте в профила си!');
    }
    const result = await getPastEvents(req.query, requesterId);
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
      throw new Error('Липсва имейл');
    }
    if (req.body.to === '') {
      throw new Error('Полето за имейл е празно!');
    }

    const result = await resetPassword(req.body);

    res.status(200).json({ message: 'Имейлът е изпратен успешно' });
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.get('/accessToken', async (req, res) => {
  // TODO: Be sure that you will remove the refreshToken Cookie from logout for FE!
  const cookieRefreshToken = req.cookies['refreshToken'];
  if (!cookieRefreshToken) {
    return res
      .status(401)
      .json({ error: 'Access Denied. No refresh token provided.' });
  } else {
    try {
      const payload = parseRefreshToken(cookieRefreshToken);
      const userId = payload._id;
      const tokens = await getUserForTokenGeneration(userId);
      const accessToken = tokens.accessToken;
      const refreshToken = tokens.refreshToken;
      res
        .status(200)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        })
        // .header('Authorization', accessToken)
        .send({ accessToken });
      res.end();
    } catch (error) {
      return res.status(401).json({
        message:
          'Invalid refresh token, please login again in RaceFanatic application!',
      });
    }
  }
});

// Unmatched route
userController.use((req, res) => {
  res.status(404).json({
    message: 'Пътят не е намерен или заявката не е правилна!',
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
