import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({path: '../../.env'}); // configuring .env File

const Authenticate = async function(req, res, next) {
    try{
        const JwtToken = req.header('jwt-token');
        //Check if web token is provided
        if(!JwtToken){
            return res.status(401).json({message: "No Auth. Token found"})
        }
        
        const FetchedToken = jwt.verify(JwtToken, process.env.JWT_SECRET);
       
        if(!FetchedToken.UserId){ // Check if the Jwt Token is Valid
            return res.status(401).send({message:"Token verification failed"})
        }

        req.UserId = FetchedToken.UserId; // Storing the User Id for further Operations.
        next()
    }catch(error){
        return res.status(500).json({message: error.message});
   }
    
}

export {Authenticate};
