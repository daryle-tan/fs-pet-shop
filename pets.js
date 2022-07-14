import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';

const subcommand = process.argv[2];

switch (subcommand) {
    case 'read': {
        const index = process.argv[3];
        fs.readFile('./pets.json', 'utf-8', (error, str) => {
            const data = JSON.parse(str);
            if (index < data.length && index >= 0) {
                console.log(data[index], 'data'); 
            } else {
                console.log('Usage: node pets.js read INDEX')
                process.exit(1);
            } 
        });
        break;
    }
    case 'create': {
        const age = process.argv[3];
        const kind = process.argv[4];
        const name = process.argv[5];     
        if (age && kind && name) {
            fs.readFile('./pets.json', 'utf-8', (error, str) => {
                const data = JSON.parse(str);
                const pet = { "age": Number(age), "kind": kind, "name": name };
                data.push(pet);

                fs.writeFile('./pets.json', JSON.stringify(data), (error, str) => {
                    // console.log(data);              
                })             
            });
        } else {
                console.error(console.log(`Usage: node pets.js create AGE KIND NAME`))
                process.exit(1);
            };
        break;
    }
    case 'update': {
        const [, , , index, age, kind, name] = process.argv;
        if (index && age && kind && name) {
            fs.readFile('./pets.json', 'utf-8', (error, str) => {
                const data = JSON.parse(str);
                const pet = { "age": age, "kind": kind, "name": name };
                pet.age = Number(age);
                pet.kind = kind;
                pet.name = name;
                data.splice(index, 0, pet)
                fs.writeFile('./pets.json', JSON.stringify(data), (error, str) => {
                    console.log(data); 
                });
            })
            } else {
                console.error(`Usage: node pets.js update INDEX AGE KIND NAME`)
                process.exit(1);               
            }           
        break;
    }

    case 'destroy': {
        const index = process.argv[3];
        fs.readFile("./pets.json", "utf-8", (error, str) => {
            const data = JSON.parse(str);
            if (data[index]) {
                delete data[index];
            } else {
                console.error('Usage: node pets.js destroy INDEX')
                process.exit(1);
            }
        })
        break;
    }
    default: {
        console.error('Usage: node pets.js [read | create | update | destroy]')
        process.exit(1);
    }
}