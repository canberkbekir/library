const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const { response } = require("express");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST /*uzaktan için ip koyabilirsin*/,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,

  //http://localhost/phpmyadmin/
});

//DONE
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      //eger email ya da password boş ise
      return res.render("index", {
        message: "Please provide email and password.",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        console.log(results);
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render("index", {
            message: "Email or password is incorrect",
          });
        } else {
          //cookie olayları
          const id = results[0].idusers;
          console.log(results);

          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          console.log("The token is " + token);

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("jwt", token, cookieOptions);

          //anasayfaya yönlendiriyor burada
          res.status(200).redirect("/search");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
//DONE
exports.adminlogin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      //eger email ya da password boş ise
      return res.render("index", {
        message: "Please provide email and password.",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        const id = results[0].idusers;
        if (id == 1) {
          console.log(results);
          if (
            !results ||
            !(await bcrypt.compare(password, results[0].password))
          ) {
            res.status(401).render("index", {
              message: "Email or password is incorrect",
            });
          } else {

            //cookie olayları

            console.log(results);

            const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });

            console.log("The token is " + token);

            const cookieOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookieOptions);

            
            res.status(200).redirect("/privateInterface");
          }
        } else {
          res.render("PrivateLogin", {
            message: "Bu sayfaya erişiminiz yoktur.",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//DONE
exports.register = (req, res) => {
  console.log(req.body);

  const { name, last_name, tel_no, adress, email, password, passwordConfirm } =
    req.body;

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.log(err);
      }

      if (result.length > 0) {
        return res.render("register", {
          message: "That email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password do not match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query(
        "INSERT INTO adress SET ?",
        {
          adress: adress,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          }

          db.query(
            "INSERT INTO users SET ?",
            {
              users_name: name,
              user_lastname: last_name,
              tel_no: tel_no,
              email: email,
              password: hashedPassword,
              adress_idadress: results.insertId,
            },
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                return res.render("register", {
                  message: "Registered!",
                });
              }
            }
          );
        }
      );
    }
  );
};

//DONE
exports.search = (req, res) => {
  try {
    const { search } = req.body;

    if (!search) {
      return res.render("search", {
        message: "Lütfen boş bırakmayınız.",
      });
    }

    console.log("UserID: " + req.decode.id + " Search: " + search);

    db.query(
      "SELECT *  FROM books INNER JOIN author ON(books.author_idauthor = author.idauthor) WHERE book_name = ?",
      [search],
      (err, result) => {
        if (err) {
          console.log(err);
          res.render("search", {
            message: "Aradığınız kitap bulunmamaktadır.",
          });
        } else {
          //buradan veriler gönderilecek
          console.log(result);
          if (result.length == 0) {
            res.render("search", {
              message: "Aradığınız kitap bulunmamaktadır.",
            });
          }

          res.status(200).render("searchresult", {
            result: result,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//DATE PROBLEM
exports.privateSearch = (req, res) => {
  try {
    const { search } = req.body;

    if (!search) {
      return res.render("privateInterface", {
        message: "Lütfen boş bırakmayınız.",
      });
    }

    console.log("UserID: " + req.decode.id + " Search: " + search);

    db.query(
      "SELECT *  from books INNER JOIN author ON(books.author_idauthor = author.idauthor) WHERE book_name = ?",
      [search],
      (err, result) => {
        if (err) {
          console.log(err);
          res.render("privateInterface", {
            message: "Aradığınız kitap bulunmamaktadır.",
          });
        } else {
          //buradan veriler gönderilecek
          console.log(result);
          if (result.length == 0) {
            res.render("privateInterface", {
              message: "Aradığınız kitap bulunmamaktadır.",
            });
          }

          res.status(200).render("privateInterface", {
            result: result,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//DONE
exports.logout = (req, res) => {
  logoutFunction(req, res);
};

//DONE
exports.emanet = (req, response) => {
  const { id } = req.body;
  //değişecek
  console.log(
    id + " numraları kitap '" + req.decode.id + "' kişisi tarafından alındı."
  );
  const today = new Date();
  const nextDay = new Date();
  nextDay.setDate(today.getDate() + 14);

  db.query(
    "SELECT *  from emanet WHERE books_idbooks = ?",
    [id],
    (err, result) => {
      if (result.length == 0) {
        db.query(
          "INSERT INTO emanet SET ?",
          {
            iade_tarihi: nextDay.toISOString().split("T")[0],
            alim_tarihi: today.toISOString().split("T")[0],
            books_idbooks: id,
            users_idusers: req.decode.id,
          },
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              response.render("searchresult", {
                result: result,
                message: "Kitabı ödünç aldınız.",
              });
            }
          }
        );
      } else {
        response.render("searchresult", {
          result: result,
          message: "Ödünç almaya çalıştığınız kitap önceden ödünç alınmış.",
        });
      }
    }
  );
};
//DONE
exports.emanetkaldir = (req, res) => {
  const { id } = req.body;

  db.query(
    "DELETE FROM emanet WHERE books_idbooks = ?",
    [id],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.render("privateInterface", {
          message: "Emanet kaldırıldı.",
        });
        console.log(id + " numaralı kitabın emanet durumu kalktı.");
      }
    }
  );
};

//DONE
exports.deletebook = (req, res) => {
  const { id } = req.body;
  //değişecek UPDATE users SET users_name = ? , user_lastname = ? , email = ? , tel_no = ? WHERE idusers = ?
  db.query(
    "UPDATE books SET ISBN_no = NULL , book_name = NULL , yayinevi = NULL WHERE idbooks = ?",
    [id],
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.render("privateInterface", {
          message: "Kitap kütüphaneden kaldırıldı.",
        });

        console.log(id + " numaralı kitap kütüphaneden kaldırıldı.");
      }
    }
  );
};

//NOT
exports.addbook = (req, res) => {
  const { book_name, author_name, ISBN_No, category, yayinevi, kutuphane } =
    req.body;
};

const logoutFunction = (req, res) => {
  res.clearCookie("jwt");
  res.render("index");
};
//DONE
exports.profile = (req, res) => {
  db.query(
    "SELECT * FROM users INNER JOIN adress ON(users.adress_idadress = adress.idadress) WHERE idusers = ?",
    [req.decode.id],
    (err, result) => {
      if (err) {
        console.log(err);
        logoutFunction(req, res);
      } else {
        console.log(result);
        res.status(200).render("profile", {
          result: result,
        });
      }
    }
  );
};

//DONE
exports.updateProfile = (req, response) => {
  const { name, last_name, email, tel_no, adress } = req.body;
  db.query(
    "UPDATE users SET users_name = ? , user_lastname = ? , email = ? , tel_no = ? WHERE idusers = ?",
    [name, last_name, email, tel_no, req.decode.id],
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        db.query(
          "SELECT * FROM users INNER JOIN adress ON(users.adress_idadress = adress.idadress) WHERE idusers = ?",
          [req.decode.id],
          (err, result) => {
            if (err) {
              console.log(err);
              logoutFunction(req, res);
            } else {
              console.log(result);
              response.status(200).render("profile", {
                result: result,
              });
            }
          }
        );
      }
    }
  );
};
