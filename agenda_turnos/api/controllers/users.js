const User = require('../models/user');

// CRUD Controllers

//get all users
exports.getUsers = (req, res, next) => {
    User.findAll()
        .then(users => {
            res.status(200).json({ users: users });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error fetching users',
                error: err.message
            });
        });
}

//get user by id
exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    User.findByPk(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }
            res.status(200).json({ user: user });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error fetching user',
                error: err.message
            });
        });
}

//create user
exports.createUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  User.create({
    name: name,
    email: email,
    password: password
  })
    .then(result => {
      console.log('Created User');
      res.status(201).json({
        message: 'User created successfully!',
        user: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error creating user',
        error: err.message
      });
    }); 
}

//update user
exports.updateUser = (req, res, next) => {
  const userId = req.params.userId;
  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  const updatedPassword = req.body.password;
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      user.name = updatedName;
      user.email = updatedEmail;
      if (updatedPassword) {
        user.password = updatedPassword;
      }
      return user.save();
    })
    .then(result => {
      res.status(200).json({message: 'User updated!', user: result});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error updating user',
        error: err.message
      });
    });
}

//delete user
exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      return User.destroy({
        where: {
          id: userId
        }
      });
    })
    .then(result => {
      res.status(200).json({ message: 'User deleted!' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error deleting user',
        error: err.message
      });
    });
}
