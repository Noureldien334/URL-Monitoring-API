import { UrlSchema } from "../models/Url.js";
import { ReportSchema } from "../models/Report.js";
const getUrls = async function (req, res){
    try{
        const AllURLs = await UrlSchema.find(); //Get All URLs
        res.status(200).json({URLs: AllURLs});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const createUrl = async function(req, res){
    try{
        const CreatedUrl = await UrlSchema.create({
            UserId: req.UserId, // Fetched from Middleware authentication
            Name: req.body.Name,
            Url: req.body.Protocol+req.body.Url,
            Protocol: req.body.Protocol,
            Port: req.body.Port,
        })
        res
        .status(200)
        .json({URLDetails:
            {
            Id : CreatedUrl._id,
            Name: CreatedUrl.Name,
            Url:  CreatedUrl.Url,
            Protocol: CreatedUrl.Protocol,
            }
        });
        // ADDING A URL TO THE REPORT PART
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const DeleteUrl = async function(req, res) {
   // Make sure the deletor is the creator
   try{
        const DelUrl = await UrlSchema.findById(req.params.URLId);
       
        //Make sure that the URL ID exists and the Creater ID  == Deletor ID
        if(DelUrl != null && req.UserId == DelUrl.UserId){
            await UrlSchema.findByIdAndRemove(DelUrl._id);
            res.status(200).json({message: "URL deleted Successfully"});
        }
        // Make a two step error handling, one for the NULL URl and 
        //the Other for the Wrong User ID
   }catch(error){
        res.status(500).json({message: error.message});
   }
}
export {getUrls,createUrl,DeleteUrl};