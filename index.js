import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let country= {};
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "103Arditivw!",
  port: 5432,
});
db.connect()


app.get("/", async (req, res) => {

  
 const results = await db.query('SELECT country_code FROM visited_countries')

 const countryCodes = results.rows.map(row => row.country_code);
 console.log(countryCodes);

 res.render('index.ejs', { countries: countryCodes, total: countryCodes.length})
  
});

app.post("/add", async (req, res) => {

  const entry = req.body.country;
  try{
   const getCode = await db.query("select country_code from countries where country_name = ($1)", [entry]);
   const code = getCode.rows.map(al => al.country_code)
   if(getCode.rows.length === 0){
    const error = "Country does not exist"
    
    res.render('index.ejs', { countries: countryCodes, total: countryCodes.length, error})
   }
   try{
   const results = await db.query("insert into visited_countries (country_code) values ($1)",[code[0]]);
      
        res.redirect("/");
      }catch(err) {

        const results = await db.query('SELECT country_code FROM visited_countries')

        const countryCodes = results.rows.map(row => row.country_code);
        console.log(countryCodes);
       const error = "Country already added"
        res.render('index.ejs', { countries: countryCodes, total: countryCodes.length, error })

      }
    }catch(err) {

      const results = await db.query('SELECT country_code FROM visited_countries')

        const countryCodes = results.rows.map(row => row.country_code);
        console.log(countryCodes);
        const error = "Country does not exist";
        res.render('index.ejs', { countries: countryCodes, total: countryCodes.length, error })
    }
 });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

