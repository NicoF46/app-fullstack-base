//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require("express");
var app = express();
var utils = require("./mysql-connector");

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static("/home/node/app/static/"));

//=======[ Main module code ]==================================================

// Endpoit to list all the devices
app.get("/devices/", function (req, res, next) {
  utils.query("SELECT * FROM Devices", function (error, results, fields) {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send({ error: "Ha ocurrido un error, intente nuevamente más tarde." });
      return;
    }
    res.send(results);
  });
});

//Endpoint to create a new device, the device starts with status 0

app.post("/devices/", function (req, res, next) {
  utils.query(
    "INSERT INTO Devices (id, name, description,state, type) VALUES (?,?,?,0,?)",
    [req.body.id, req.body.name, req.body.description, req.body.type],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).send({
          error: "Ha ocurrido un error, intente nuevamente más tarde.",
        });
        return;
      }
      res.status(201).end();
    }
  );
});

//Endpoint to create a new device, the device starts with status 0

app.put("/devices/", function (req, res, next) {
  utils.query(
    "UPDATE Devices SET name = ?, description = ?, state = ?, type = ?  WHERE id = ? ",
    [req.body.name, req.body.description, req.body.state, req.body.type, req.body.id],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).send({
          error: "Ha ocurrido un error, intente nuevamente más tarde.",
        });
        return;
      }
      res.status(200).end();
    }
  );
});

//Endpoint to delete a device

app.delete("/devices/:id", function (req, res, next) {
    utils.query(
      "DELETE from Devices WHERE id = ? ",
      [req.params.id],
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500).send({
            error: "Ha ocurrido un error, intente nuevamente más tarde.",
          });
          return;
        }
        res.status(200).send({message: "Se ha eliminado el device correctamente"});
      }
    );
  });

app.listen(PORT, function (req, res) {
  console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
