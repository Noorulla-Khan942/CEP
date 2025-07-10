import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport ({
    service: "gmail",
    auth:{
        user: "soundarya0018@gmail.com",
        pass: "edjr jegd lknq pxjz",
    },
});

export default transporter;