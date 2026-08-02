import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell as RechartsCell,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import ProcessVolumeChart from "../components/ProcessVolumeChart";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const COLORS = {
  CREADO: "#9ca3af",
  EN_PROGRESO: "#3b82f6",
  EN_REVISION: "#f59e0b",
  APROBADO: "#10b981",
  RECHAZADO: "#ef4444",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get("/dashboard/stats");
        setStats(data);

        // Transformar datos para el gráfico
        if (data.porEstado) {
          const mapped = Object.keys(data.porEstado).map((key) => ({
            name: key.replace("_", " "),
            value: data.porEstado[key],
            color: COLORS[key] || "#ccc",
          }));
          setChartData(mapped);
        }
      } catch (err) {
        console.error("Error cargando stats", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <Box sx={{ p: 4 }}>Cargando estadísticas...</Box>;

  return (
    <Box sx={{ p: 3, background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Dashboard General
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Resumen de actividad y flujos de trabajo
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={4}>
          <Card sx={{ background: "#4f46e5", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Total Procesos</Typography>
              <Typography variant="h2" fontWeight="bold">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card sx={{ background: "#10b981", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Activos</Typography>
              <Typography variant="h2" fontWeight="bold">
                {stats.activos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <Card sx={{ background: "#5ddfd0", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Finalizados</Typography>
              <Typography variant="h2" fontWeight="bold">
                {stats.finalizados}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Process Volume Chart */}
      <ProcessVolumeChart />

      {/* Gráfico de Distribución */}
      <Paper sx={{ p: 3, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Distribución por Estado
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <RechartsCell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
