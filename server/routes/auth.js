import express from "express";
import { requireSignin } from "../middlewares/auth.js";

const router = express.Router();
import * as auth from "../controllers/auth.js"; //aise sb kuch import kr skte hain, by using '.'

//get post put delete
//get-to get data, post-to post data from clint to server, put for updating, deleting for deleting
router.get("/check", auth.check); //ab yhan check chalega matlab /api/check aise
router.get("/", requireSignin, auth.welcome); // '/' yeh khaali rahega fher hum server.js pae denge route jaise '/api diya hai.
//because we post the user info and save in the database.
router.post("/pre-regester", auth.preRegister); //for the valid email address.
router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/access-account", auth.accessAccount);
router.get("/refresh-token", auth.refreshToken);
router.get("/current-user", requireSignin, auth.currentUser);
router.get("/profile/:username", auth.publicProfile); //we can access :username through param-> go to controller

router.put("/update-password",requireSignin, auth.updatePassword); // put use for update
router.put("/update-profile", requireSignin, auth.updateProfile)
router.get('/agents', auth.agents) //all agents
router.get('/agents-ad-count/:_id', auth.agentsAdCount) // add count of all agents
router.get('/agents/:username', auth.agent) //single user




export default router;
