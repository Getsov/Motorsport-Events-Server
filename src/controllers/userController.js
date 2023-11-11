const userController = require("express").Router();
const {
  registerUser,
  loginUser,
  getById,
  updateUser,
} = require("../services/userService");

//TODO:  In Future Pavka! Check CORS for requests "req" authorization, in index.js wich is commented!!!
//TODO: In other words, if you turn on cors in index.js, no file will be returned on the client!

userController.post("/registerUser", async (req, res) => {
  // console.log(req.body.email);
  try {
    const userData = {
      email: req.body.email,
      //TODO = first and last names are optional
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      region: req.body.region ? req.body.region : "",
    };

    const user = await registerUser(userData);
    res.status(200).json(user);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userController.post("/loginUser", async (req, res) => {
  try {
    const user = await loginUser(req.body.email, req.body.password);
    res.status(200).json(user);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

userController.put("/updateUser", async (req, res) => {
  try {
    //TODO: user is useful in that case
    // const user = await getById(req.requester.id);
    const result = await updateUser(req.requester, req.body);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  userController,
};
