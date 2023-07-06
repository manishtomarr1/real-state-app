import { model, Schema, ObjectId } from "mongoose";

const schema = new Schema(
  {
    photos: [{}], //object is for key location etc
    price: { type: Number, maxLength: 255 },
    address: { type: String, maxLength: 255, required: true },
    bedrooms: Number,
    bathroom: Number,
    landsize: String,
    carpark: Number,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
    },
    coordinates: {
      type: [Number],
      default: [78.962883, 20.593683],
    },
    title: {
      type: String,
      maxLength: 255,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true, 
    },
    discription: {},
    postedBy: { type: ObjectId, ref: "User" },
    sold: { type: Boolean, default: false },
    googlemap: {},
    type: {
      type: String,
      default: "Others",
    },
    action: {
      type: String,
      default: "other",
    },
    views: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true } //this will update our data base automatically if anything is added or del, etc.
);
schema.index({location:"2dsphere"})
export default model("Ad", schema); //it is the user model which is based on the schema we defined.
