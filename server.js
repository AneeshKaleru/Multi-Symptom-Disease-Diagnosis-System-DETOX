const express = require("express")
const path = require("path")
const db = require("./mongodb")
const { spawn } = require('child_process');
const { name } = require("ejs");
// const session = require("session");


const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/css', express.static('css'));



app.get("/", function(req,res){
    res.render("login");
});


app.get("/signup", function(req,res){
    res.render("signup");
});


app.get("/index", function(req,res){
    res.render("index");
});


app.get("/diagnose", function(req,res){
  const symptoms=['back_pain','constipation','abdominal_pain','diarrhoea','mild_fever','yellow_urine',
    'yellowing_of_eyes','acute_liver_failure','fluid_overload','swelling_of_stomach',
    'swelled_lymph_nodes','malaise','blurred_and_distorted_vision','phlegm','throat_irritation',
    'redness_of_eyes','sinus_pressure','runny_nose','congestion','chest_pain','weakness_in_limbs',
    'fast_heart_rate','pain_during_bowel_movements','pain_in_anal_region','bloody_stool',
    'irritation_in_anus','neck_pain','dizziness','cramps','bruising','obesity','swollen_legs',
    'swollen_blood_vessels','puffy_face_and_eyes','enlarged_thyroid','brittle_nails',
    'swollen_extremeties','excessive_hunger','extra_marital_contacts','drying_and_tingling_lips',
    'slurred_speech','knee_pain','hip_joint_pain','muscle_weakness','stiff_neck','swelling_joints',
    'movement_stiffness','spinning_movements','loss_of_balance','unsteadiness',
    'weakness_of_one_body_side','loss_of_smell','bladder_discomfort','foul_smell_of urine',
    'continuous_feel_of_urine','passage_of_gases','internal_itching','toxic_look_(typhos)',
    'depression','irritability','muscle_pain','altered_sensorium','red_spots_over_body','belly_pain',
    'abnormal_menstruation','dischromic _patches','watering_from_eyes','increased_appetite','polyuria','family_history','mucoid_sputum',
    'rusty_sputum','lack_of_concentration','visual_disturbances','receiving_blood_transfusion',
    'receiving_unsterile_injections','coma','stomach_bleeding','distention_of_abdomen',
    'history_of_alcohol_consumption','fluid_overload','blood_in_sputum','prominent_veins_on_calf',
    'palpitations','painful_walking','pus_filled_pimples','blackheads','scurring','skin_peeling',
    'silver_like_dusting','small_dents_in_nails','inflammatory_nails','blister','red_sore_around_nose',
    'yellow_crust_ooze'];
    res.render("diagnose", { symptoms: symptoms });


});


app.get("/about", function(req,res){
    res.render("about");
});


app.get("/faqs", function(req,res){
    res.render("faqs");
});


app.post("/signup",async function(req, res) {
    const info = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
  
      await db.getDb().collection('details').insertMany([info]);
      res.render("login");
  });


app.post("/", async function(req, res){
      const email = req.body.email;
      const password = req.body.password;
 try{
  const existingUser = await  db.getDb().collection('details').findOne({ email: req.body.email});

  if(!existingUser){
    res.redirect('/');
  }

  const crctpassword = await  db.getDb().collection('details').findOne({ password: req.body.password});

  if(!crctpassword){
    res.redirect('/');
  }
  else{
    res.render("index")
  }
 }  catch (error) {
  res.status(400).json({ error });
}   
});


app.post('/diagnose', function(req, res){
  const inputs = Object.values(req.body);
  // Execute your Python code here
  const pythonScript = spawn('python', ['ml.py', ...inputs]);

  pythonScript.stdout.on('data', (data) => {
    const result = data.toString().trim();
    res.render("result", { result: result })
 
  });
  pythonScript.stderr.on('data', (error) => {
    console.error('Python script error:', error.toString());
    res.status(500).json({ error: 'Internal server error' });
  });
});


// function isLoggedIn(req, res, next) {
//   if (req.session && req.session.userId) {
//     // User is authenticated, proceed to the next middleware or route handler
//     return next();
//   }
  
//   // User is not authenticated, redirect to the login page or any other desired route
//   res.redirect("/");
// }


db.connectToDatabase().then(function(){
  app.listen(3000, function(){
    console.log("Server started on port 3000"); 
 });
})




























