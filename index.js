const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");

const { LoginCollection, SignupCollection, ExperienceCollection, BlogCollection } = require("./mongodb");

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/loginsignuptutorial', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Ensure 'uploads' directory exists, otherwise create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);  // Set the upload destination to 'uploads/' folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;  // Ensure unique filenames
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// Set EJS as the view engine and specify the views directory
const templatePath = path.join(__dirname, './templates');
app.set("view engine", "hbs");
app.set("views", templatePath);

// Serve static files (e.g., images, styles, etc.)
app.use(express.static(path.join(__dirname, 'src')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route for homepage
app.get("/", async (req, res) => {
    try {
        const blogs = await BlogCollection.find();  // Fetch blog posts
        res.render("index", { blogs });  // Render homepage with blogs
    } catch (err) {
        console.error("Error fetching blogs:", err.message);
        res.status(500).send("Server error");
    }
});


// GET route for /share-experience
app.post('/share-experience', async (req, res) => {
    try {
      const { name, email, story } = req.body;
      const newExperience = new ExperienceCollection({ name, email, story });
      await newExperience.save();
      res.redirect('/home'); // Redirect to the home page
    } catch (err) {
      res.status(500).send('Error saving experience: ' + err.message);
    }
  });
  
  app.get("/share-experience", (req, res) => {
    res.render("share-experience");  // Render the create blog page
});

app.get("/home", (req, res) => {
    res.render("home");  // Render the create blog page
});



// Route for creating and submitting a blog post
app.get("/create-blog", (req, res) => {
    res.render("create-blog");  // Render the create blog page
});

// Handle form submission for creating a new blog post
app.post('/upload-blog', upload.single('profileImage'), async (req, res) => {
    const { title, content } = req.body;
    const file = req.file;  // If a file was uploaded

    try {
        const newBlog = new BlogCollection({
            title,
            content,
            image: file ? file.filename : null
        });
        await newBlog.save();

        // After saving the blog, redirect to the homepage to show the uploaded blog
        res.redirect('/homepage');
    } catch (err) {
        console.error("Error saving blog post:", err.message);
        res.status(500).send("Error saving the blog post.");
    }
});

// Route for homepage to display blogs
app.get("/homepage", async (req, res) => {
    try {
        const blogs = await BlogCollection.find();  // Fetch all blogs
        res.render("homepage", { blogs });  // Pass the blogs data to the homepage view
    } catch (err) {
        console.error("Error fetching blogs:", err.message);
        res.status(500).send("Server error");
    }
});


// Route for login page
app.get("/login", (req, res) => {
    res.render("login");  // Render login page
});

// Handle login POST request
app.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await SignupCollection.findOne({ name });  // Check in SignupCollection, not LoginCollection
        if (!user) {
            return res.status(400).send("Invalid login credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid login credentials");
        }

        res.redirect("/index");  // Redirect to home after successful login
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server error");
    }
});

// Route for signup page
app.get("/signup", (req, res) => {
    res.render("signup");  // Render signup page
});

// Handle signup form submission
app.post("/signup", async (req, res) => {
    try {
        const { name, password, age, gender } = req.body;
        
        // Check if user already exists
        const user = await SignupCollection.findOne({ name });
        if (user) {
            return res.status(400).send("User already exists");
        }
        
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new signup object with name, password, age, and gender
        const newSignup = new SignupCollection({
            name,
            password: hashedPassword,
            age,
            gender
        });

        // Save the new signup to the database
        await newSignup.save();

        // After saving the new user, redirect to the index page
        res.redirect('/index');
    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).send("Server error");
    }
});


// Route for about
app.get("/about", (req, res) => {
    res.render("about");  // Render about page
});

// Route for other pages as per your previous routes
app.get("/west", (req, res) => {
    res.render("west");  // Render west page
});

// More routes for other pages like 'south', 'east', etc. can go here

// Route to render index_new.ejs
app.get("/index-new", (req, res) => {
    res.render("index-new");  // Ensure this matches the template name you're trying to render
});






// route to west hbs  //
app.get("/west", (req, res) => {
    res.render("west");  // Render index.ejs
});

// route to singsore//
app.get("/singsore", (req, res) => {
    res.render("singsore");  // Render index.ejs
});

// route to skywalk //
app.get("/skywalk", (req, res) => {
    res.render("skywalk");  // Render index.ejs
});

// route to rabdentse //
app.get("/rabdentse", (req, res) => {
    res.render("rabdentse");  // Render index.ejs
});

// route to kcheopari //
app.get("/KCHEOPARI", (req, res) => {
    res.render("KCHEOPARI");  // Render index.ejs
});

// ROUTE  to bird park //
app.get("/Sidkeong-Tulku-Bird-Park", (req, res) => {
    res.render("Sidkeong-Tulku-Bird-Park");  // Render index.ejs
});

// route to barsey //
app.get("/barsey", (req, res) => {
    res.render("barsey");  // Render index.ejs
});

// route of north //
app.get("/north", (req, res) => {
    res.render("north");  // Render index.ejs
});

// route of yumthang valley//
app.get("/yumthang-valley", (req, res) => {
    res.render("yumthang-valley");  // Render index.ejs
});

// route of  Gurudongmar-Lake //

app.get("/Gurudongmar-Lake", (req, res) => {
    res.render("Gurudongmar-Lake");  // Render index.ejs
});

// route of Shingba-Rhododendron-Sanctuary//
app.get("/Shingba-Rhododendron-Sanctuary", (req, res) => {
    res.render("Shingba-Rhododendron-Sanctuary");  // Render index.ejs
});

//  route of  lachen//
app.get("/Lachen", (req, res) => {
    res.render("Lachen");  // Render index.ejs
});

// route of lachung //
app.get("/Lachung", (req, res) => {
    res.render("Lachung");  // Render index.ejs
});

// route of Goecha-La //
app.get("/Goecha-La", (req, res) => {
    res.render("Goecha-La");  // Render index.ejs
});

// route of about //

app.get("/about", (req, res) => {
    res.render("about");  // Render index.ejs
});

/// route of south //


app.get("/south", (req, res) => {
    res.render("south");  // Render index.ejs
});


// route of buddha park //
app.get("/buddha-park", (req, res) => {
    res.render("buddha-park");  // Render index.ejs
});

// route of char dham  //
app.get("/Char-Dham", (req, res) => {
    res.render("Char-Dham");  // Render index.ejs
});

// route of  tarey bhir   //
app.get("/Tarey-Bhir", (req, res) => {
    res.render("Tarey-Bhir");  // Render index.ejs
});

// route of  Rose-Garden  //
app.get("/Rose-Garden", (req, res) => {
    res.render("Rose-Garden");  // Render index.ejs
});

// route of   Samdruptse-Hill  //
app.get("/Samdruptse-Hill", (req, res) => {
    res.render("Samdruptse-Hill");  // Render index.ejs
});

// route of Temi-Tea-Garden     //
app.get("/Temi-Tea-Garden", (req, res) => {
    res.render("Temi-Tea-Garden");  // Render index.ejs
});

// route of east //
app.get("/east", (req, res) => {
    res.render("east");  // Render index.ejs
});

// route Tsomgo-lake //
app.get("/Tsomgo-lake", (req, res) => {
    res.render("Tsomgo-lake");  // Render index.ejs
});

// route of hanuman-tok //
app.get("/hanuman-tok", (req, res) => {
    res.render("hanuman-tok");  // Render index.ejs
});

// route of Gangtok-Ropeway //
app.get("/Gangtok-Ropeway", (req, res) => {
    res.render("Gangtok-Ropeway");  // Render index.ejs
});

// route of Nathula-Pass //
app.get("/Nathula-Pass", (req, res) => {
    res.render("Nathula-Pass");  // Render index.ejs
});

// route of mg marg //
app.get("/MG-Marg", (req, res) => {
    res.render("MG-Marg");  // Render index.ejs
});

// route of mg marg //
app.get("/MG-Marg", (req, res) => {
    res.render("MG-Marg");  // Render index.ejs
});

// route  of   banjhakri-waterfalls //
app.get("/banjhakri-waterfalls", (req, res) => {
    res.render("banjhakri-waterfalls");  // Render index.ejs
});

// route  of  SORENG//
app.get("/Soreng", (req, res) => {
    res.render("Soreng");  // Render index.ejs
});
 

// route of sai-mandir //
 app.get("/sai-mandir", (req, res) => {
    res.render("sai-mandir");  // Render index.ejs
});

// route of ramidham //
app.get("/ramidham", (req, res) => {
    res.render("ramidham");  // Render index.ejs
});

// route of barsey //
app.get("/Barsey-Rhododendron", (req, res) => {
    res.render("Barsey-Rhododendron");  // Render index.ejs
});

// route of soreng viewpoint //
app.get("/soreng-viewpoint", (req, res) => {
    res.render("soreng-viewpoint");  // Render index.ejs
});

 // xroute to ZULUK //
 app.get("/ZULUK", (req, res) => {
    res.render("ZULUK");  // Render index.ejs
});

// route to Saramsa-Garden  //
app.get("/Saramsa-Garden", (req, res) => {
    res.render("Saramsa-Garden");  // Render index.ejs

});

// route to pakyong //

app.get("/pakyong", (req, res) => {
    res.render("pakyong");  // Render index.ejs

});

// route to nathang valley //
app.get("/nathang-valley", (req, res) => {
    res.render("nathang-valley");  // Render index.ejs

});

// route of Lampokhari //
app.get("/Lampokhari", (req, res) => {
    res.render("Lampokhari");  // Render index.ejs

});


// route of Fambonglho Wildlife Sanctuary //

app.get("/Fambonglho-Wildlife-Sanctuary", (req, res) => {
    res.render("Fambonglho-Wildlife-Sanctuary");  // Render index.ejs

});


app.get("/index", (req, res) => {
    res.render("index");  // Render index.ejs

});






// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
