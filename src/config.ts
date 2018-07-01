export default {
    "connectionStr" : process.env.MONGODB_STR  || "mongodb://localhost:27017" ,
    "jwtSecret" : process.env.TOKEN_SECRET || 'tm2018',
    "port" : process.env.PORT || 8080
}