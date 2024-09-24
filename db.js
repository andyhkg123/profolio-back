import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
const uri =
  "mongodb+srv://andywong3111:mongodb3111@cluster0.mxtfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB once at startup
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server after connecting to the database
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
