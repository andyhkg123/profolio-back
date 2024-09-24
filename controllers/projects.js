import { client } from "../db.js";

// import jwt from "jsonwebtoken";

export const getProjects = async (req, res) => {
  try {
    await client.connect();
    const database = client.db("profolio");
    const projects = database.collection("projects");

    const project = await projects.findOne({
      idprojects: parseInt(req.params.id),
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log(project);
    return res.status(200).json(project);
  } catch (err) {
    return res.status(500).json(err); // Handle the error appropriately
  } finally {
    await client.close();
  }
};
