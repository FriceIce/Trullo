import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Task, User } from "./models/models.ts";
import { connectDB } from "./connect.ts";
import { ITask } from "./types.ts";

connectDB();

function generateData(): Partial<ITask>[] {
  const array: Partial<ITask>[] = [];

  for (let i = 0; i <= 5; i++) {
    const fakeTask = createRandomTask();
    array.push(fakeTask);
  }

  return array;
}

function createRandomTask(): Partial<ITask> {
  const userID = faker.string.uuid();
  return {
    // id: userID,
    title: faker.lorem.words(5),
    description: faker.lorem.words(10),
    assignedTo: [userID],
    createdAt: faker.date.recent(),
    finishedBy: "Not finished yet",
  };
}

const fakeData = generateData();

//Generera testdata
// await Task.insertMany(fakeData)
//   .then(() => {
//     console.log("Succesfully saved products");
//     mongoose.connection.close();
//     process.exit(0);
//   })
//   .catch((err: Error) => console.log(err));

//Ta bort testdata
// await Task.deleteMany({})
//   .then(() => {
//     console.log("Succesfully removed all products");
//     mongoose.connection.close();
//     process.exit(0);
//   })
//   .catch((err) => console.log(err));
