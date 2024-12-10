const mongoose = require("mongoose");

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/loginsignuptutorial', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});

// Define the schema for login (name, password)
const loginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
});

// Define the schema for signup (name, password, age, gender)
const signupCollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
});
// Define the schema for user experiences (name, email, story)
const experienceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    story: { type: String, required: true }
});

// Define the schema for blog posts (title, content, image)
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }  // Optional field for image filename
});

// defining the schema of contact //


// Create the models using the schemas
const LoginCollection = mongoose.model('logincollections', loginSchema);
const SignupCollection = mongoose.model('signupcollections', signupCollectionSchema);
const ExperienceCollection = mongoose.model('experiencecollections', experienceSchema);
const BlogCollection = mongoose.model('blogcollections', blogSchema);

// Export models
module.exports = { LoginCollection, SignupCollection, ExperienceCollection, BlogCollection };
