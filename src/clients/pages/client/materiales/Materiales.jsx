// components/Materiales.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListaMaterialesTable from './ListaMaterialesTable';
import AddMaterialDialog from './AddMaterialDialog';
import Breadcrumb from '../../../../general/Breadcrumb';

const Materiales = () => {
    const { projectId } = useParams();
    const [listas, setListas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLista, setSelectedLista] = useState(null);
    const [project, setProject] = useState(null);

    const fetchData = async () => {
        if (!projectId) {
            setError('ID de proyecto no proporcionado');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // Obtener datos del proyecto
            const projectResponse = await axios.get(`http://localhost:5000/api/projects`);
            const projectData = projectResponse.data.find(p => p.project_id === parseInt(projectId));
            
            if (!projectData) {
                throw new Error('No se encontró el proyecto');
            }
            setProject(projectData);

            // Obtener listas de materiales
            const listasResponse = await axios.get(`http://localhost:5000/api/lista-materiales/project/${projectId}`);
            
            // Asegurarse de que la respuesta sea un array
            const listasData = Array.isArray(listasResponse.data) 
                ? listasResponse.data 
                : listasResponse.data.data || [];
                
            setListas(listasData);
            
        } catch (err) {
            console.error('Error al cargar listas:', err);
            setError(err.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const handleCreateLista = async () => {
        try {
            if (!project?.quote_number) {
                throw new Error('Número de cotización no disponible');
            }

            const response = await axios.post('http://localhost:5000/api/lista-materiales/create', {
                project_id: parseInt(projectId),
                quote_number: project.quote_number
            });
            
            await fetchData();
            
            if (response.data && response.data.data) {
                setSelectedLista(response.data.data.lista_id);
                setOpenDialog(true);
            }
        } catch (error) {
            console.error('Error al crear lista:', error);
            setError(error.message || 'Error al crear nueva lista de materiales');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <div className="flex flex-col p-5 h-full">
            <div className="h-full rounded-xl">
                <Breadcrumb />
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5" component="h2">
                            Lista de Materiales - {project?.project_name || 'Proyecto sin nombre'}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreateLista}
                            sx={{ bgcolor: '#8B0000', '&:hover': { bgcolor: '#660000' } }}
                        >
                            Nueva Lista
                        </Button>
                    </Box>

                    {Array.isArray(listas) && listas.length > 0 ? (
                        listas.map((lista) => (
                            <ListaMaterialesTable
                                key={lista.lista_id}
                                lista={lista}
                                onAddMaterial={() => {
                                    setSelectedLista(lista.lista_id);
                                    setOpenDialog(true);
                                }}
                                onRefresh={fetchData}
                            />
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                            No hay listas de materiales disponibles
                        </Typography>
                    )}

                    <AddMaterialDialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        listaId={selectedLista}
                        quoteNumber={project?.quote_number}
                        onSuccess={fetchData}
                    />
                </Paper>
            </div>
        </div>
    );
};

export default Materiales;