const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(express.json());
const port = 8000;
app.use(cors({
    orgin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));

app.delete("/users/:received_id", (req, res) => {
    let id = Number(req.params.received_id);
    console.log(id);
    let filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsers),
     (err) => {if (err) {
        res.status(500).send("Error writing to file");
    } else {
        return res.json(filteredUsers);
    }
        
    })
});

app.get("/users", (req, res) => {
    return res.json(users);
});
app.post("/users", (req, res) => {

    let { name, age, city } = req.body;
    
    if (!name || !age || !city) {
        console.log("Provide the reQuired Data");
    }
    else {
        let id = Date.now();
        const ne=[...users,{id,name,age,city}];
        fs.writeFile("./sample.json",JSON.stringify(ne),
        (err)=>{
            if (err) {
                res.status(500).send("Error writing to file");
            } else {
                return res.json(ne);
            }
            
        });
    }
});

app.patch("/users/:received_id", (req, res) => {
    console.log("from index-patch");
    let id=Number(req.params.received_id);
    console.log(id);
    let { name, age, city } = req.body;
    
    if (!name || !age || !city) {
        console.log("Provide the reQuired Data");
    }
    else {
        
        // const ne=[...users,{id,name,age,city}];
        let index=users.findIndex((user)=>user.id==id);
        users.splice(index,1,{...req.body});

        fs.writeFile("./sample.json",JSON.stringify(users),
        (err)=>{
            if (err) {
                res.status(500).send("Error editing to file");
            } else {
                return res.json(users);
            }
            
        });
    }
});

app.listen(port, (err) => {
    console.log(port, " running");
});
