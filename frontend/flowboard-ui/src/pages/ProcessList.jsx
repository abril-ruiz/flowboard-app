import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { createProcess, getProcesses } from "../api/processApi";

const statusColors = {
  CREADO: "default",
  EN_PROGRESO: "info",
  EN_REVISION: "warning",
  APROBADO: "success",
  RECHAZADO: "error",
};

// Página de lista de procesos
export default function ProcessList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await getProcesses(params);
      setRows(res.data.map((p) => ({ ...p, id: p.id })));
    } catch (error) {
      console.error("Error cargando procesos", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Maneja la creación de un nuevo proceso
  const handleCreateProcess = async () => {
    if (!formData.title.trim()) {
      setFormError("El título es obligatorio.");
      return;
    }

    if (formData.title.trim().length > 100) {
      setFormError(
        "El nombre del proceso no puede tener más de 100 caracteres.",
      );
      return;
    }

    if ((formData.description || "").trim().length > 1000) {
      setFormError(
        "La descripción del proceso no puede tener más de 1000 caracteres.",
      );
      return;
    }

    setFormError("");
    setFormSuccess("");

    try {
      await createProcess({
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      setFormSuccess("Proceso creado correctamente.");
      setFormData({ title: "", description: "" });
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      setFormError("No se pudo crear el proceso. Intenta nuevamente.");
    }
  };

  // Definición de las columnas para la tabla de procesos
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Título", flex: 1 },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value] || "default"}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Creado",
      width: 120,
      valueFormatter: (v) => new Date(v).toLocaleDateString(),
    },
    { field: "lastEditedByUsername", headerName: "Última edición", width: 180 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(`/processes/${params.row.id}`)}
        >
          Abrir
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Gestión de Procesos
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          displayEmpty
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos los estados</MenuItem>
          {Object.keys(statusColors).map((status) => (
            <MenuItem key={status} value={status}>
              {status.replace("_", " ")}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={fetchData}>
          Filtrar
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setFormError("");
            setFormData({ title: "", description: "" });
            setOpenDialog(true);
          }}
        >
          Crear proceso
        </Button>
      </Box>

      {formSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {formSuccess}
        </Alert>
      )}

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Crear nuevo proceso</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Título"
              fullWidth
              value={formData.title}
              inputprops={{ maxLength: 100 }}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              minRows={4}
              inputprops={{ maxLength: 1000 }}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {formError && <Alert severity="error">{formError}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setFormError("");
              setFormData({ title: "", description: "" });
            }}
          >
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleCreateProcess}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
