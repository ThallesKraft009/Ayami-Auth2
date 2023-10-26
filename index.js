const express = require("express");
const { join } = require("path");
const app = express();
const { request } = require('undici');
const { URLSearchParams } = require("url");
const { blue, green } = require("colors")
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const DisocrdStrategy = require("passport-discord").Strategy
const passport = require("passport");
const bodyParser = require('body-parser')
require('dotenv').config()
const morgan = require('morgan')
const DiscordRequest = require("./utils.js")

passport.use(

  new DisocrdStrategy({
    clientID: process.env.id,
    clientSecret: process.env.secret,
    callbackURL: 'https://ayami-auth2.thalleskraft.repl.co/callback',
    scope: ['identify', "guilds"]
  },
                     
                     
          
 function (acessToken, refreshToken, profile, done){
  process.nextTick(function() {
    return done(null, profile);
     });
 } )
  )

app.use(session({
  store: new MemoryStore({checkPeriod:86400000}),
  secret: `kaedebot`,
  resave: false,
  saveUninotialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
});

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/login', async(req, res, next) => {

  next();
}, passport.authenticate("discord")
       
)

app.get("/callback", passport.authenticate("discord", {failureRedirect: "/gerenciar"}), function(req, res){

  res.redirect("/");
  
})

app.get("/", async(req, res) => {
  if (!req.user) return res.redirect("/login");

  //console.log(req.user)

  let guildId = "751534674723078174";
  let verificar = req.user.guilds.find(guild => guild.id === guildId);

 // console.log(verificar)

  if (verificar){

    await DiscordRequest(`/guilds/1163589188663394335/members/${req.user.id}/roles/1167055729186840646`,{
      method: "PUT"
    })

    return res.redirect("https://discord.com/channels/1163589188663394335/1167056017863999529")
    
  }
  
})
app.listen(process.env.PORT, async() => {
  
    console.log("Conectado!")
    
  })
