require('dotenv').config();
const aws = require('aws-sdk');
const multer = require('multer');


const {Messages} = require('../database');
const sequelize = require('../sequelize');
const services = require('../services/s3service');


try{
        
    // Configure multer for file upload
    const storage = multer.memoryStorage(); // Store files in memory as buffers i have to stream the file s3 in next optimization
    exports.upload = multer({ storage: storage });

}catch(err){
    res.send({error: `multer error${err}`})
    console.trace(err);
}


exports.uploadS3 = async(req,res,next) =>{
    let t = await sequelize.transaction();

    try{
        let id = Number(req.userId);
        let group = Number(req.query.groupId);
        let file = req.file;
        // console.trace( file);

        
        let s3 = new aws.S3({
            accessKeyId: process.env.IAM_USER_KEY,
            secretAccessKey: process.env.IAM_USER_SECRET,
          
        });


        let fileName = file.originalname;
        // console.trace(fileName);

        const S3res = await services.uploadToS3(file.buffer, file.originalname);
        console.log(S3res);

        let chat = await Messages.create({
            message: S3res.Location,
            userId: id,
            groupId:group,
            media: true
        },{transaction: t}
        );
console.log(chat)
        res.send(chat);

        await t.commit();

    }catch(err){
        await t.rollback();
        res.status(500).send({error: `${err }`});
        // console.trace(err);
    }


};




















// exports.upload = async(req,res,next)=>{

//     try{

//         let s3 = new aws.S3({
//             accessKeyId: process.env.IAM_USER_KEY,
//             secretAccessKey: process.env.IAM_USER_SECRET,
                      
//         });

//         const upload = multer({
//             storage: multerS3({
//               s3: s3,
//               bucket: process.env.BUCKET_NAME,
//               acl: 'public-read',
//               key: req.file.originalname
//             })
//           });

//           let response = await upload.single('file');

//           console.trace(response);




//     }catch(err){
//         console.trace(err);
//     }


// }



















