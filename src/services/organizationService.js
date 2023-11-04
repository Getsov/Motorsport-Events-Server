const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');

//TODO: use env and change secret
const secret = 'q213fdfsddfasd231adfas12321kl'