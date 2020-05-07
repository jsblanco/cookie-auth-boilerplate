const mongoose = require('mongoose');

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log(`Connected to database`);
    } catch (e) {
        console.log(`Error connecting to database: ${e}`)
        process.exit(1);
    }
}
