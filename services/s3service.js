const AWS = require('aws-sdk');
require('dotenv').config();

let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
  
});


exports.uploadToS3 = async (data, fileName)=>{

    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
    const params = {
      Bucket: BUCKET_NAME,
      Body: data,
      Key: fileName,
      ACL: 'public-read'
    }

   
    // return new Promise((resolve,reject)=>{
    //   s3bucket.upload(params,(err,s3Res)=>{
    //   if(err){
    //     console.trace('something went wrong: ',err);
    //     reject(err);
       
    //   }
    //   else{
    //     console.trace('success', s3Res);
    //     resolve(s3Res);

    //   }
    //   })
    // })


    try{
      let res = await s3bucket.upload(params).promise();
      return res;
    }
    catch(err){
      // console.trace(err);
      return `${err}`;
    }
    
   

};


