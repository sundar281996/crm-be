import jwt from 'jsonwebtoken'


export const auth=async(request,response,next)=>{
    try
    {
   const token= await request.header('x-auth-token')
   const result= await jwt.verify(token,process.env.key)
   console.log(result);
   next();
    }
    catch(err)
    {
        response.send({msg:err.message})
    }

}