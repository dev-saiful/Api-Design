import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

 export const comparePasswords = (password,hash)=>{
    return bcrypt.compare(password,hash);
}

export const hashPasswords = (password)=>{
    return bcrypt.hash(password,5);
}



export const createJwt = (user)=>{
    const token = jwt.sign(
        {
            id:user.id,
            username:user.username
        },
            process.env.JWT_SECRET
        );

        return token;
}

// protect routes
export const protect = (req,res,next)=>{
    const bearer = req.headers.authorization;
    if(!bearer)
    {
        res.status(401);
        res.json({message:"you are not authorized!!!"});
        return;
    }

    const [,token] = bearer.split(" ");
    if(!token)
    {
        res.status(401);
        res.json({message:"Invalid token!!"});
        return;
    }

    try 
    {
        const user = jwt.verify(token,process.env.JWT_SECRECT);
        req.user = user;
        next();
    }
    catch (e)
    {
        console.error(e);
        res.status(401);
        res.json({message:"Invalid token!!"});
        return;
    }
}