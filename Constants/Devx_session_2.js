import { stdin, stdout} from "process";
import readline from 'readline/promises';
import {sql} from "./constants/db.js";

const rl = readline.createInterface({
    input:stdin,
    output: stdout
})
async function readVal(p){
    let res = await rl.question(p)
    return res;
}
async function showMenu(p) {
    const res =await readVal("1. Show available usesr \n2. Create a new user \n3. Delete user \n4. Exit \nChoose an option: ");
    return res; 
}
async function createUser(){
    const name = await readVal("Enter name:");
    const username = await readVal("Enter username: ");
   const email = await readVal("Enter email: ");
    const day= Number (await readVal("Enter day in dob: "));
    const month = Number(await readVal("Enter month in dob(1-12):"));
    const year = Number(await readVal("Enter year in dob: "));
    const dob = new Date(year,month -1, day+1);
    return{name,username,email,dob: dob.toDateString()}
}
async function main() {
    let loop = true;
    do{
        const option = Number(await showMenu());
        try{
            switch(option){
                //geting and displaying all users
                case 1:{
                    const users =await sql`SELECT * FROM users;`;
                    console.log("\nAvailable users: ");
                    if(users.length === 0){
                        console.log("No users found.\n");
                        break;
                    }
                    users.forEach((user, index)=>{
                        console.log(`${index + 1}: ${JSON.stringify(user)}`);
                    });
                    console.log("\n");
                    break;
                }
                case 2:{
                  //create new user
                  console.log("create new user");
                  const user = await createUser();
                  await sql`INSERT * INTO users(name,dob,username,email) VALUES(${user.name},${user.dob},${user.username},${user.email})`;
                  console.log("User addedd successfully!\n");
                  break;
                }
                case 3:{
                    //deleting user
                    console.log("Delete user");
                    const username = await readVal("Enter username of user to delete:");
                    await sql`DELETE * FROM users WHERE username = ${username};`;
                    console.log("User successfully deleted.\n");
                    break;
                }
                case 4:{
                    //editing user
                    console.log("Edit User");
                    const username =await readVal("Enter username to be edited");
                    await sql`UPDATE * FROM users WHERE username = ${username};`;
                    console.log("User Updated");
                    break;
                }
                case 5:{
                    //search user
                    console.log("Enter username");
                    const username = await readVal("Enter username");
                    await sql`SELECT * FROM users WHERE username = ${username};`;
                    console.log(username);
                    break;
                }
                case 5:{
                    //quit
                    loop = false;
                    console.log("Quiting....\n");
                    break;
                }
                default:{
                 // Invalid option
                 console.log("Invalid optipn\n");   
                }
            }
        }
      catch(err){
        console.error("An error occured: ", err);
        console.log("\n");
      }  
        
    }while(loop)
        process.exit(0)
}
await main()