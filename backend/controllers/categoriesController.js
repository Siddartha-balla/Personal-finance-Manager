const pool=require("../config/db.js");
const getCategories=async (req,res)=>{
    try{
    const [categories]=await pool.execute(`select * from categories`);
    res.status(200).json({
        success:true,
        categories:categories
    }); 
    }
    catch(err){
        console.log("Get Categories Error:",err.message);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
module.exports={getCategories};