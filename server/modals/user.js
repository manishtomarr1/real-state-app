import { model, Schema, ObjectId } from "mongoose";

const schema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      // unique: true, //each user have unique username.
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      requried: true,
      // unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      requried: true,
      maxLength: 256,
    },

    address: { type: String, default: "" },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    phone: { type: String, default: "" },
    photo: {}, //be any type
    role: {
      type: [String],
      default: ["Buyer"],
      enum: ["Buyer", "Seller", "Admin"], //agar badh m role badalna chaye user to yeh option honge.
    },
    enquriedProperties: [{ type: ObjectId, ref: "Ad" }], //ad is basically the another modal od mongoDB and here we take the reference of that modal
    wishlist: [{ type: ObjectId, ref: "Ad" }],
    resetCode: {
      
    },
  },
  { timestamps: true } //this will update our data base automatically if anything is added or del, etc.
);

export default model("User", schema); //it is the user model which is based on the schema we defined.
