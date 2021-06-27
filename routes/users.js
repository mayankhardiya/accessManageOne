const express = require("express");
const router = express();

const { userRegister,userAuth , checkRole, userLogin,serializeUser } = require("../utils/Auth");

//Users Registeration Route
router.post("/register-user", async(req, res) => {
    await userRegister(req.body, "user", res);
});

//Admin Registeration Route
router.post("/register-admin", async(req, res) => {
    await userRegister(req.body, "admin", res);
});

//Super Admin Registeration Route
router.post("/register-super-admin", async(req, res) => {
    await userRegister(req.body, "superadmin", res);
});

//Users Login Route
router.post("/login-user", async(req, res) => {
    await userLogin(req.body, "user", res);
});

//Admin Login Route
router.post("/login-admin", async(req, res) => {
    await userLogin(req.body, "admin", res);
});

//Super admin Login Route
router.post("/login-super-admin", async(req, res) => {
    await userLogin(req.body, "superadmin", res);
});

//Profile Route
router.get("/profile", userAuth, async(req, res) => {
    return res.json(serializeUser(req.user));
});

//Users Protected Route
router.post("/user-protected", userAuth, checkRole(["users"]), async(req, res) => {
    return res.json("Hello Admin");
});

//Admin Protected Route
router.post("/admin-protected", userAuth, checkRole(["admin"]), async(req, res) => {
    return res.json("Hello Admin");
});

//Super Admin Protected Route
router.post("/super-admin-protected", userAuth, checkRole(["superadmin"]), async(req, res) => {
    return res.json("Hello Admin");
});

//Super Admin Protected Route
router.post("/super-admin-and-admin-protected", userAuth, checkRole(["superadmin", "admin"]), async(req, res) => {
    return res.json("Hello Admin");
});


module.exports = router;