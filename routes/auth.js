const express = require("express");
const authController = require("../controllers/auth");
const jsonwebtoken = require("jsonwebtoken");

const authControl = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    res.render("index");
  } else {
    jsonwebtoken.verify(jwt, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        console.log(err);
        res.render("index");
      } else {
        req.decode = decode;
        next();
      }
    });
  }
};

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/adminlogin", authController.adminlogin);

router.post("/privatelogin", authController.login);

router.post("/logout", authControl, authController.logout);

router.post("/search", authControl, authController.search);

router.post("/privateSearch", authControl, authController.privateSearch);

router.post("/emanet", authControl, authController.emanet);

router.post("/emanetkaldir", authControl, authController.emanetkaldir);

router.post("/profile", authControl, authController.profile);

router.post("/updateProfile", authControl, authController.updateProfile);

router.post("/addbook", authControl, authController.addbook);

router.post("/deletebook", authControl, authController.deletebook);

//router export
module.exports = router;
