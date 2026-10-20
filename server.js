import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.API_PORT || 5000;

app.use(express.json());

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, default: "Planning" },
  deadline: { type: String, default: "" }
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

const samples = [
  {
    projectId: "P101",
    name: "Student Portal",
    category: "Web Development",
    description: "Manage student records and attendance.",
    status: "In Progress",
    deadline: "2026-12-15"
  },
  {
    projectId: "P102",
    name: "Sales Dashboard",
    category: "Data Analytics",
    description: "Analyse sales and business performance.",
    status: "Planning",
    deadline: "2027-01-20"
  },
  {
    projectId: "P103",
    name: "Mobile Banking App",
    category: "Mobile App",
    description: "Manage balances and transactions.",
    status: "Completed",
    deadline: "2026-11-30"
  },
  {
    projectId: "P104",
    name: "Online Bookstore",
    category: "Web Development",
    description: "Browse books and manage customer orders.",
    status: "In Progress",
    deadline: "2027-02-10"
  }
];

app.get("/api", (req, res) => {
  res.json({ message: "Project Management API is running" });
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected:", mongoose.connection.name);

  for (const sample of samples) {
    await Project.updateOne(
      { projectId: sample.projectId },
      { $setOnInsert: sample },
      { upsert: true }
    );
  }

  console.log("Sample projects are ready.");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});
