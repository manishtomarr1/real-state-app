import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

//matlab hum kuch route kewal uneh user ko denge jo login honge like forgotpasword and all 

export const requireSignin = (req, res, next) => {
  try {
    const decode= jwt.verify(req.headers.authorization,JWT_SECRET)
    req.user=decode
    //ab hum req.user._id ki help se pta lga lenge login user ka then we use this concept in all the routes agar yeh hai jbhi wo route access hoga
    //otherwise the error 401 is displayed on screen.
    next() //ese ki help se code aage chalega 
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid or expired token" }); //401 = unauthorise status
  }
};
