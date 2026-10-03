import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getProjectById } from "../services/dashboardService";
import "../styles/dashboard.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      setLoading(true);
      setError(null);

      try {
        const data = await getProjectById(id);
        if (!mounted) return;
        setProject(data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load project.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProject();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <p className="p-4">Loading project...</p>;
  if (error) return <p className="text-danger p-4">{error}</p>;
  if (!project) return <p className="p-4">Project not found.</p>;

  const title = project.emertimi || "Project";
  const description = project.pershkrimi || "No description provided.";
  const status = project.statusi || "-";
  const owner = project.emriPronarit || "-";
  const progress = project.perqindjaProgresit ?? 0;
  const startDate = project.dataFillimit;
  const endDate = project.dataPerfundimit;

  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <main className="flex-grow-1 p-5 overflow-auto">
        <Link to="/projects" className="btn btn-link mb-3 text-white">
          ← Back to Projects
        </Link>

        <div className="card border-secondary shadow-sm p-4 bg-transparent">
          <h1 className="text-white">{title}</h1>
          <p className="text-muted">{description}</p>

          <div className="row g-3 mt-4">
            <div className="col-md-4">
              <div className="border rounded p-3 bg-dark text-white">
                <strong>Status</strong>
                <p className="mb-0">{status}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded p-3 bg-dark text-white">
                <strong>Owner</strong>
                <p className="mb-0">{owner}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded p-3 bg-dark text-white">
                <strong>Progress</strong>
                <p className="mb-0">{progress}%</p>
              </div>
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-md-6">
              <div className="border rounded p-3 bg-dark text-white">
                <strong>Start Date</strong>
                <p className="mb-0">{startDate ? new Date(startDate).toLocaleDateString() : "-"}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3 bg-dark text-white">
                <strong>End Date</strong>
                <p className="mb-0">{endDate ? new Date(endDate).toLocaleDateString() : "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
