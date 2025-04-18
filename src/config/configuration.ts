import * as dotenv from 'dotenv'
dotenv.config();

export default()=>({
    port:process.env.PORT || 3000,
    db_url:process.env.MONGO_URL,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
})