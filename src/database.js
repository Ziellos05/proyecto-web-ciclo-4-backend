import mongoose from "mongoose";


const connect = () => mongoose.connect(process.env.DB, {
    autoIndex: true,
})
    .then(() => console.log('Connected to database'))
    .catch(err => console.error(err));

export default connect;
