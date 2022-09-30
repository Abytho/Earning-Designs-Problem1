const router = require('express').Router();
const fast2sms = require("fast-two-sms");
const { Login } = require('../models/user.models');


router.get("/", (req, res) => {
    return res.render("register")
});


router.post("/register", async (req, res) => {

    const [userEmailExist, userMobileExist] = await Promise.all([
        Login.findOne({ email: req.body.email }),
        Login.findOne({ mobile: req.body.mobile })
    ]);

    if (userEmailExist || userMobileExist) {
        return res.render("status", { status: "failure", message: "Email/Mobile already registered" })
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    const login = new Login({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        otp: otp
    });

    const data = await login.save();
    sendOTP(login.name, login.otp, login.mobile);

    return res.render("otp", { mobile: login.mobile })
});

async function sendOTP(name, otp, mobile) {
    let options = {
        authorization: process.env.FAST2SMS_API,
        message: `Dear ${name}, Your OTP is ${otp}`,
        language: 'english',
        numbers: [mobile]
    }

    const response = await fast2sms.sendMessage(options);
}


router.post("/verify/:id", async (req, res) => {
    const login = await Login.findOne({ mobile: parseInt(req.params.id) });

    if (login && login["otp"] == parseInt(req.body.otp)) {
        const updatedLogin = await Login.findByIdAndUpdate({ _id: login["_id"] },
            { otpStatus: "VERIFIED" })
        return res.render("status", {
            status: "success",
            user: { name: login.name, mobile: login.mobile, email: login.email }
        })
    } else {
        return res.render("status", {
            status: "failure",
            message: "Invalid OTP"
        })
    }
})


module.exports = router;