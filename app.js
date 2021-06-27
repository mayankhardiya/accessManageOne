const cors = require("cors");
const express = require("express");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error} = require("consola");

const { DB, PORT } = require("./config");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

app.use("/api/users", require("./routes/users"));

const startApp = async () => {
   try {

    await connect(DB, {
        useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    success({
        message: `Succesfully connected with the Database \n${DB}`,
        badge: true
    });

    app.listen(PORT, () => 
        success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
   } catch (err) {
    error({
        message: `Unable to connect with Database \n${err}`,
        badge: true
    });
    startApp();
   }
};

startApp();

