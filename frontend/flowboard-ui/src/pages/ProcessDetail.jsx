import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  Button,
  TextField,
  List,
  ListItem,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getProcessById,
  updateStatus,
  getComments,
  addComment,
  getProcessHistory,
} from "../api/processApi";

// Página de detalle de un proceso
export default function ProcessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [process, setProcess] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, cRes, hRes] = await Promise.all([
          getProcessById(id),
          getComments(id),
          getProcessHistory(id),
        ]);
        setProcess(pRes.data);
        setComments(cRes.data);
        setHistory(hRes.data);
        setNewStatus(pRes.data.status);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  // Maneja el cambio de estado del proceso
  const handleStatusChange = async () => {
    if (newStatus === process.status) return;
    try {
      await updateStatus(id, {
        newStatus,
        comment: `Cambio manual a ${newStatus}`,
      });
      const [updatedRes, commentsRes, historyRes] = await Promise.all([
        getProcessById(id),
        getComments(id),
        getProcessHistory(id),
      ]);
      setProcess(updatedRes.data);
      setComments(commentsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      alert("Error al cambiar estado. Verifica las reglas de transición.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment(id, { content: commentText });
      setCommentText("");
      setComments(await getComments(id).then((r) => r.data));
    } catch (err) {
      alert("Error al enviar comentario");
    }
  };

  if (loading || !process) return <Box sx={{ p: 4 }}>Cargando...</Box>;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      {/* Header con botón de volver */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate("/processes")} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">{process.title}</Typography>
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Creado por: {process.createdByUsername || "Usuario"}
          </Typography>
        </Box>
      </Box>

      {/* Info del proceso */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Estado Actual
            </Typography>
            <Chip
              label={process.status}
              color={process.status === "APROBADO" ? "success" : "primary"}
              sx={{ mt: 1 }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Cambiar Estado
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Select
                size="small"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                sx={{ flex: 1 }}
              >
                {[
                  "CREADO",
                  "EN_PROGRESO",
                  "EN_REVISION",
                  "APROBADO",
                  "RECHAZADO",
                ].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                onClick={handleStatusChange}
                disabled={newStatus === process.status}
              >
                Guardar
              </Button>
            </Box>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          {process.description || "Sin descripción"}
        </Typography>
      </Paper>

      {/* Comentarios */}
      <Typography variant="h6" gutterBottom>
        Comentarios
      </Typography>
      <Paper sx={{ p: 2, mb: 2, maxHeight: 300, overflowY: "auto" }}>
        {comments.length === 0 ? (
          <Typography color="textSecondary">Sin comentarios aún.</Typography>
        ) : (
          <List disablePadding>
            {comments.map((c) => (
              <Box key={c.id} sx={{ mb: 1 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="body2" fontWeight="bold">
                      {c.authorUsername || "Usuario"}{" "}
                      <span
                        style={{
                          fontWeight: "normal",
                          color: "#888",
                          fontSize: "0.85rem",
                        }}
                      >
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </Typography>
                    <Typography variant="body1">{c.content}</Typography>
                  </Box>
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </Paper>

      <Typography variant="h6" gutterBottom>
        Historial de cambios
      </Typography>
      <Paper sx={{ p: 2, mb: 2, maxHeight: 300, overflowY: "auto" }}>
        {history.length === 0 ? (
          <Typography color="textSecondary">Sin historial aún.</Typography>
        ) : (
          <List disablePadding>
            {history.map((h) => (
              <Box key={h.id} sx={{ mb: 1 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="body2" fontWeight="bold">
                      {h.changedByUsername || "Usuario"}{" "}
                      <span
                        style={{
                          fontWeight: "normal",
                          color: "#888",
                          fontSize: "0.85rem",
                        }}
                      >
                        {new Date(h.changedAt).toLocaleString()}
                      </span>
                    </Typography>
                    <Typography variant="body2">
                      {h.oldStatus} → {h.newStatus}
                    </Typography>
                    {h.comment && (
                      <Typography variant="body2" color="textSecondary">
                        {h.comment}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </Paper>

      {/* Formulario comentario */}
      <form onSubmit={handleAddComment} style={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          label="Agregar comentario..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!commentText.trim()}
        >
          Enviar
        </Button>
      </form>
    </Box>
  );
}
