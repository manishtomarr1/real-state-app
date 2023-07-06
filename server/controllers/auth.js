//jaise hum router se callback dere the usme hume kuch multipal tasks krne pad skte hai
//jiske liye controller fuctions bana rhe hai.
import * as config from "../config.js";
import jwt from "jsonwebtoken";
import { emailTemplate } from "../helpers/email.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../modals/user.js";
import Ad from "../modals/ad.js";
import { nanoid } from "nanoid";
import validator from "email-validator";
import user from "../modals/user.js";
// import { AccessAnalyzer } from "aws-sdk";

const tokenAndUserResponse = (req, res, user) => {
  //TODO what is token?
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  //TODO what is the need of this?
  const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    //password valid for 7 days
    expiresIn: "7d",
  });
  //TODO why we do this?
  user.password = undefined;
  user.resetCode = undefined;
  return res.json({
    token,
    refreshToken,
    user,
  });
};

export const welcome = (req, res) => {
  res.json({
    //response by server.
    data: "node.js welcome you! you are successufully connect with me.",
  });
};

export const check = (req, res) => {
  res.json({
    //response by server.
    data: "ok report.",
  });
};

export const preRegister = async (req, res) => {
  //* create jwt (json viwer tocken) with email and password then email as the clickable link
  //*only hen user click that link the registration will complete.
  //*for this we want email provier which is given by AWS.
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    //validation
    if (!validator.validate(email)) {
      return res.json({ error: "A valid email is requried" });
    }
    if (!password) {
      return res.json({ error: "password is requried" });
    }
    if (password && password?.length < 6) {
      return res.json({ error: "password should be at least 6 characters" });
    }

    //if user already in database.
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ error: "user is already registerd with us :)" });
    }

    //this is send the verify link to user after the verification we add user in DB
    const token = jwt.sign({ email, password }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    config.AWS_SES.sendEmail(
      //from AWS
      emailTemplate(
        email,
        `<p>please click to the link below to activate your account.</p>
      <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>`,
        config.REPLY_TO,
        "Activate your account"
      ),
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ ok: "false" });
        } else {
          console.log(data);
          return res.json({ ok: "true" });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong, Try again!" });
  }
};

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
    // console.log(decode)

    const hashedPassword = await hashPassword(password); //*yeh hash krega password ko.

    const user = await new User({
      //create the document in the databse.
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "something went wrong, Try again" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //1. find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "no user found! please register" });
    }
    //2. compare password
    const match = await comparePassword(password, user.password); // password jo user ne dia, user.password jo databse se aaya
    if (!match) {
      return res.json({ error: "wrong password" });
    }
    //3. create jwt tokens
    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "something went wrong! Try again." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log(">>>>>>>before reset", user);

    if (!user) {
      return res.json({ error: "could not find user." });
    } else {
      const resetCode = nanoid(); //yeh reset code mae reset userid hogi, jb user password reset kreag toh new id store hogi database mae.
      user.resetCode = resetCode; //TODO what is this?
      user.save();
      console.log(".....after reset code", user);
      const token = jwt.sign({ resetCode }, config.JWT_SECRET, {
        expiresIn: "1h",
      });
      console.log(">>>>>token", token);
      config.AWS_SES.sendEmail(
        emailTemplate(
          email,
          `
        <p>please click to the link below to access your account</p>
        <a href="${config.CLIENT_URL}/auth/access-account/${token}">access your account</a>
        `,
          config.REPLY_TO,
          "Access your account"
        ),
        (err, data) => {
          if (err) {
            console.log(err);
            return res.json({ ok: "false" });
          } else {
            console.log(data);
            return res.json({ ok: "true" });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: "something went wrong" });
  }
};

export const accessAccount = async (req, res) => {
  try {
    const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET); //come from verifier.
    const user = await User.findOneAndUpdate({ resetCode }, { resetCode: "" }); //TODO why the resetCode is set to empty?
    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "something went wrong" });
  }
};

export const refreshToken = async (req, res) => {
  //TODO what is this?
  try {
    const { _id } = jwt.verify(req.headers.refresh_token, config.JWT_SECRET); //here we use refresh token
    const user = await User.findById(_id); //user dhund k
    //gererate new token
    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "refresh token failed" }); //forbidden status
  }
};

export const currentUser = async (req, res) => {
  //* check from postman through header
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "unauthorize" });
  }
};

export const publicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "user not found" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log("=======", req.user);
    // console.log("password that go to server from auth.js", password)

    if (!password) {
      return res.json({ error: "password is requried" });
    }
    if (password && password?.length < 6) {
      return res.json({ error: "password should be min 6 charactor" });
    }
    // const user = await User.findById(req.user._id);

    const user = await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(password),
    });
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "unauthorize" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("======= user from update profile", req.user);

    const user = await User.findByIdAndUpdate(
      req.user._id, //! jb tak user login nhi hoga id nhi aygee wo requireSignIn mae hai usse user._id ayege
      {
        ...req.body,
      },
      { new: true }
    );

    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res.status(403).json({ error: "Username is taken" });
    } else {
      return res.status(403).json({ error: "Unauhorized" });
    }
  }
};

export const agents = async (req, res) => {
  try {
    const agents = await User.find({ role: "Seller" }).select(
      "-password -role -enquriedProperties -wishlist -photo.key -photo.Bucket"
    );
    res.json(agents);
  } catch (err) {
    console.log(err);
  }
};

export const agentsAdCount = async (req, res) => {
  try {
    const ads = await Ad.find({ postedBy: req.params._id }).select("_id");
    // console.log(">>>>>>>ads",ads)
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const agent = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -role -enquriedProperties -wishlist -photo.key -photo.Bucket"
    );
    const ads = await Ad.find({ postedBy: user._id }).select(
      "-photos.key -photo.Key -photos.ETag -photos.Bucket -location"
    );
    return res.status(200).json({user, ads})
  } catch (err) {
    console.log(err);
  }
};
