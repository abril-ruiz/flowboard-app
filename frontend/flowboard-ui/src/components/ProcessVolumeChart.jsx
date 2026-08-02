import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import client from "../api/client";
/**
 Componente de gráfico de volumen de procesos
 Muestra un gráfico de líneas que representa el volumen de procesos por mes.
 */
export default function ProcessVolumeChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get("/stats/processes/monthly");
        if (response.data && response.data.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching monthly stats:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#ffffff" }}>
        <Typography variant="body2" color="textSecondary">
          Cargando datos...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600, color: "#1e293b" }}
      >
        Volumen de Procesos por Mes
      </Typography>

      {data.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No hay datos disponibles para mostrar.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="#f0f0f0"
              vertical={true}
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              style={{ fontSize: "12px", fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#94a3b8"
              style={{ fontSize: "12px", fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={{ stroke: "#e2e8f0" }}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "12px",
              }}
              labelStyle={{ color: "#1e293b", fontWeight: 600 }}
              cursor={{ stroke: "#4f46e5", strokeWidth: 2 }}
              formatter={(value) => [value, "Procesos"]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{
                fill: "#4f46e5",
                r: 5,
                strokeWidth: 2,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 7,
                fill: "#4f46e5",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
