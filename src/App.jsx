
import { useEffect, useState } from "react";
import "./App.css";

const initialProjects = [
  {
    _id: "1",
    name: "Student Portal",
    category: "Web Development",
    description: "A portal for managing student records and attendance.",
    status: "In Progress",
    deadline: "2026-12-15"
  },
  {
    _id: "2",
    name: "Sales Dashboard",
    category: "Data Analytics",
    description: "A dashboard for analysing sales and business performance.",
    status: "Planning",
    deadline: "2027-01-20"
  },
  {
    _id: "3",
    name: "Mobile Banking App",
    category: "Mobile App",
    description: "A mobile application for checking balances and transactions.",
    status: "Completed",
    deadline: "2026-11-30"
  },
  {
    _id: "4",
    name: "Online Bookstore",
    category: "Web Development",
    description: "A platform for browsing books and managing orders.",
    status: "In Progress",
    deadline: "2027-02-10"
  }
];

function ProjectCard({ project, onView }) {
  return (
    <article className="project-card">
      <span className="category-tag">{project.category}</span>
      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <div className="project-info">
        <span>Status: {project.status}</span>
        <span>Deadline: {project.deadline || "Not set"}</span>
      </div>

      <button onClick={() => onView(project)}>
        View Details →
      </button>
    </article>
  );
}

function App() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Use the REST API when the backend URL is configured.
        const apiUrl = import.meta.env.VITE_API_URL;

        if (apiUrl) {
          const response = await fetch(`${apiUrl}/projects`);

          if (!response.ok) {
            throw new Error("Unable to fetch projects from the API.");
          }

          const data = await response.json();
          setProjects(data);
        } else {
          // Local demonstration data when no backend URL is configured.
          setProjects(initialProjects);
        }
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category))
  ];

  const filteredProjects =
    category === "All"
      ? projects
      : projects.filter((project) => project.category === category);

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">ProjectFlow<span>.</span></div>
        <div className="nav-label">PROJECT WORKSPACE</div>
      </header>

      {selectedProject ? (
        <main className="container">
          <button
            className="back-button"
            onClick={() => setSelectedProject(null)}
          >
            ← Back to projects
          </button>

          <section className="details-card">
            <span className="category-tag">
              {selectedProject.category}
            </span>
            <h1>{selectedProject.name}</h1>
            <p>{selectedProject.description}</p>
            <hr />
            <p><strong>Status:</strong> {selectedProject.status}</p>
            <p><strong>Deadline:</strong> {selectedProject.deadline || "Not set"}</p>
            <p><strong>Project ID:</strong> {selectedProject._id}</p>
          </section>
        </main>
      ) : (
        <main className="container">
          <section className="hero">
            <p className="eyebrow">PLAN · TRACK · ACHIEVE</p>
            <h1>Manage your projects<br />with clarity.</h1>
            <p>Everything your team is working on, all in one place.</p>
          </section>

          <section className="projects-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR WORKSPACE</p>
                <h2>Project Overview</h2>
                <p className="subtitle">
                  Explore and track your team's projects.
                </p>
              </div>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label="Filter by category"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </div>

            {loading && <p>Loading projects...</p>}
            {message && <p className="error">{message}</p>}

            {!loading && !message && (
              <>
                <p className="count">
                  Showing {filteredProjects.length} projects
                </p>

                <div className="project-grid">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onView={setSelectedProject}
                    />
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <p>No projects in this category.</p>
                )}
              </>
            )}
          </section>
        </main>
      )}

      <footer>ProjectFlow · Project Management Application</footer>
    </div>
  );
}

export default App;
