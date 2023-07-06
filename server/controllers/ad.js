import * as config from "../config.js";
import { nanoid } from "nanoid";
import Ad from "../modals/ad.js";
import User from "../modals/user.js";
import slugify from "slugify";
import { emailTemplate } from "../helpers/email.js";

export const uploadImage = async (req, res) => {
  try {
    console.log(req.body);
    const { image } = req.body;
    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    //image params

    const params = {
      //* params we nee dto upload to s3
      Bucket: "realstate-app-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };
    config.S_3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        console.log(data);
        res.send(data);
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "upload failed! try again." });
  }
};

export const deleteImage = (req, res) => {
  try {
    const { Key, Bucket } = req.body;
    config.S_3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.send({ ok: true });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req, res) => {
  try {
    console.log(req.body);
    const ad = await new Ad({
      ...req.body,
      postedBy: req.user._id,
      location: {
        type: "Point",
        //coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
      },
      slug: slugify(`${nanoid(6)}`),
    }).save(); //save the ad

    //make user role seller

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { role: "Seller" },
      },
      { new: true }
    );

    (user.password = undefined), (user.resetCode = undefined);

    res.json({
      ad,
      user,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "something went wrong. Try Again..." });
  }
};

export const ads = async (req, res) => {
  try {
    const adsForSell = await Ad.find({ action: "sell" })
      .select("-gooleMap -location -photo.key -photo.key -photo.Etag")
      .sort({ createdAt: -1 })
      .limit(12);

    const adsForRent = await Ad.find({ action: "rent" })
      .select("-gooleMap -location -photo.Key -photo.key -photo.Etag")
      .sort({ createdAt: -1 })
      .limit(12);
    res.json({ adsForSell, adsForRent });
  } catch (err) {
    console.log(err);
  }
};

export const read = async (req, res) => {
  try {
    const ad = await Ad.findOne({ slug: req.params.slug }).populate(
      //! kyuki route me :slug likha tha toh wo params mae milta hai
      "postedBy",
      "name username email phone company photo.Location"
    );

    //related
    const related = await Ad.find({
      _id: { $ne: ad._id }, //ne used for not include
      action: ad.action,
      type: ad.type,
      address: ad.address,
    });
    console.log(ad);
    res.json({ ad, related });
  } catch (err) {
    console.log(err);
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.adId }, //*this is avoid duplicate id
      },
      { new: true }
    );
    const { password, resetCode, ...rest } = user._doc;
    res.json(rest);
  } catch (err) {
    console.log(err);
  }
};

export const deleteFromWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.adId },
      },
      { new: true }
    );
    const { password, resetCode, ...rest } = user._doc;
    res.json(rest);
  } catch (err) {
    console.log(err);
  }
};

export const contactSeller = async (req, res) => {
  try {
    const { name, email, message, phone, adId } = req.body;
    const ad = await Ad.findById(adId).populate("postedBy", "email"); //! esse email nikal jayege ->populate

    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enquriedProperties: adId },
    });

    if (!user) {
      return res.json({ error: "user not found with that email" });
    } else {
      config.AWS_SES.sendEmail(
        //from AWS
        emailTemplate(
          ad.postedBy.email,
          `<p>you have received a new customer enquiry</p>
          <h4> customer details </h4>
          <p>name: ${name} </p>
          <p>email: ${email} </p>
          <p>phone: ${phone} </p>
          <p>message: ${message} </p>
            <a href="${config.CLIENT_URL}/ad/${ad.slug}">${ad?.type} on ${ad?.address} for ${ad?.action} for ${ad?.price}</a>`,
          email,
          "new enquiry recieved"
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
  }
};

export const userAds = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const total = await Ad.find({ postedBy: req.user._id });

    const ads = await Ad.find({ postedBy: req.user._id })
      .populate("postedBy", "name email username phone company")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json({ ads, total: total.length });
  } catch (err) {
    console.log(err);
  }
};

export const updateAd = async (req, res) => {
  try {
    const { photos, price, type, address, discription, title } = req.body;
    const ad = await Ad.findById(req.params._id);
    const owner = req.user._id == ad?.postedBy;
    if (!owner) {
      return res.json({ error: "permission denied" });
    } else {
      //validation
      if (!photos.length) {
        return res.json({ error: "photo are requried" });
      }
      if (!price) {
        return res.json({ error: "price are requried" });
      }
      if (!type) {
        return res.json({ error: "is property house or land" });
      }
      if (!address) {
        return res.json({ error: "address are requried" });
      }
      if (!discription) {
        return res.json({ error: "discription are requried" });
      }
      if (!title) {
        return res.json({ error: "title are requried" });
      }

      await ad.updateOne({
        ...req.body,
        slug: ad.slug,
        location: {
          type: "Point",
        },
      });

      res.json({ ok: "true" });
    }
  } catch (err) {
    console.log(err);
  }
};

export const enquiredProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.enquriedProperties }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const wishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.wishlist }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params._id);

    const owner = req.user._id == ad?.postedBy;
    console.log(owner);
    if (!owner) {
      return res.json({ error: "permission denied" });
    } else {
      await Ad.findByIdAndRemove(ad._id);
      res.json({ ok: "true" });
    }

    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const adsForSell = async (req, res) => {
  try {
    const ads = await Ad.find({ action: "sell" })
      .select(
        "-photos.Key -photos.key -photos.ETag -photos.Bucket -location -googleMap"
      )
      .populate("postedBy", "name username email phone company")
      .sort({ createdAt: -1 })
      .limit(12);

    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};
export const adsForRent = async (req, res) => {
  try {
    const ads = await Ad.find({ action: "rent" })
      .select(
        "-photos.Key -photos.key -photos.ETag -photos.Bucket -location -googleMap"
      )
      .populate("postedBy", "name username email phone company")
      .sort({ createdAt: -1 })
      .limit(12);

    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const search = async (req, res) => {
  try {
    console.log("-----UI Request : ", req.query);
    const { action, type, priceRange, address } = req.query;
    let property_Result = await Ad.find({ action: action, type: type, address:address});
    console.log("Searched property -- ", property_Result);

    return res.json(property_Result);
  } catch (error) {
    console.log(error);

    return next(error);
  }
};
