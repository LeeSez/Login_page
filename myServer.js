let url = require('url');
let fs = require('fs');
let http = require('http');
let mysql = require("mysql");
let fileProcess = require("./serverTools");

let server = http.createServer((req, res)=>{
    let q = url.parse(req.url, true);

    if(q.path.startsWith("/api")){
        // API request
        if(q.path.startsWith("/api/login")){
            //login request
            let email = q.query.email;
            let password = q.query.password;

            let databaseConnection = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "22022202",
                database: "website_data"
              });

            databaseConnection.connect((err)=>{
                if(err){
                    console.log(err);
                    console.log("there was a problem connecting to the data base");

                    databaseConnection.destroy();

                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end();
                }
                else{
                    //connected successfuly 
                    databaseConnection.query("SELECT Password FROM users WHERE Email=?",[email], (err, results)=>{
                        if(err){
                            //no such user found -- wrong email
                            console.log(err);
                            console.log("there was a problem in sql query");

                            databaseConnection.destroy();

                            res.writeHead(500, {"Content-Type":"text/plain"});
                            res.end();
                        }
                        else{
                            databaseConnection.destroy();

                            res.writeHead(200, {"Content-Type":"text/plain"});


                            if(results.length > 0 && results != null){
                                //found the email
                                if(results[0].Password == password){
                                    //correct password
                                    res.write("welcome to the website");
                                }
                                else{
                                    //wrong password
                                    res.write("wrong password");
                                }
                                res.end();
                            }
                            else{
                                //no matching user
                                res.write("no matching user");
                            }
                        }
                    });
                }
            });
        }//end of login
        if(q.path.startsWith("/api/register")){
            //register request
            let email = q.query.email;
            let password = q.query.password;

            let databaseConnection = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "22022202",
                database: "website_data"
            });

            if(email != null && password != null){
                databaseConnection.connect((err)=>{
                    if(err){
                        console.log(err);
                        console.log("there was a problem connecting to the data base");

                        databaseConnection.destroy();

                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end();
                    }
                    else{
                        //connected successfuly 
                        databaseConnection.query("INSERT INTO users(Email, Password) VALUES(?, ?)", [email,password], (err, results)=>{
                            if(err){
                                //no such user found -- wrong email
                                console.log(err);
                                console.log("there was a problem in sql query");

                                databaseConnection.destroy();

                                res.writeHead(500, {"Content-Type":"text/plain"});
                                res.end();
                            }
                            else{
                                res.writeHead(200, {"Content-Type":"text/plain"});
                                res.write("all good")
                                res.end();
                            }
                        });
                    }
                });
            }
            else{
                console.log("the information passed was null and will not be inserted to the database");
                res.writeHead(400, {"Content-Type":"text/plain"});
                res.end();
            }
        }
    }
    else{
        // File request
        fileProcess.fileServer( "./client", q.path, "./client/index.html", res);
    }
}
).listen(8080);