import { useState, FC, useEffect } from 'react';
import { Grid, Paper, TextField, Button, FormControl, InputLabel, MenuItem, Select, Typography, Divider, Box, CircularProgress, Avatar, Dialog, DialogActions, DialogContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFetchMovies } from '@hooks/useFetchMovies'; // Import useFetchMovies
import { useFetchMovieDetails, MovieDetails } from '../hooks/useFetchMovieDetails'; // Import useFetchMovieDetails
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the icon for accordion
import { InputView } from '@src/components/Fragments/InputView';
import HistoricalView from './Fragments/HistoricalView';
import { fetchMovies } from '@src/reduxs/slices/moviesSlice';

const App: FC = () => {
    const theme = useTheme();

    // State untuk menyimpan histori dan data input
    const [ticketHistory, setTicketHistory] = useState<{ title: string, quantity: number, total: number, date: string }[]>([]);
    const [ticketQuantity, setTicketQuantity] = useState<number | ''>('');
    const [selectedMovie, setSelectedMovie] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [htm, setHTM] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedMovieDetails, setSelectedMovieDetails] = useState<MovieDetails | null>(null);

    // State untuk modal
    const [openModal, setOpenModal] = useState(false);
    const [htmSeninKamis, setHtmSeninKamis] = useState(30000);
    const [htmJumatSabtu, setHtmJumatSabtu] = useState(50000);
    const [htmMinggu, setHtmMinggu] = useState(40000);

    // Menggunakan custom hooks
    const { movies, loading: moviesLoading, error: moviesError, fetchMovies } = useFetchMovies();
    const { movieDetails, loading: movieDetailsLoading, error: movieDetailsError, fetchMovieDetails } = useFetchMovieDetails();

    // Fungsi untuk menangani input tiket
    const handleSave = () => {
        if (ticketQuantity && selectedMovie && htm && selectedDate) {
            const totalPrice = ticketQuantity * htm;

            // Tambahkan data ke histori
            setTicketHistory([...ticketHistory, { title: selectedMovieDetails?.Title || '', quantity: ticketQuantity, total: totalPrice, date: selectedDate }]);

            // Reset input form setelah simpan
            setTicketQuantity('');
            setSelectedMovie('');
            setHTM(0);
            setSelectedDate('');
            setSelectedMovieDetails(null);
        }
    };

    // Pencarian film berdasarkan input
    const handleSearch = () => {
        if (searchQuery) {
            fetchMovies(searchQuery);
        }
    };

    // Menentukan HTM berdasarkan hari dalam seminggu
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        const dayOfWeek = new Date(date).getDay(); // Mengambil hari dalam bentuk angka (0 = Minggu, 6 = Sabtu)

        if (dayOfWeek >= 1 && dayOfWeek <= 4) {
            setHTM(htmSeninKamis); // Harga Senin-Kamis
        } else if (dayOfWeek === 5 || dayOfWeek === 6) {
            setHTM(htmJumatSabtu); // Harga Jumat-Sabtu
        } else {
            setHTM(htmMinggu); // Harga Minggu
        }
    };

    // Ambil detail film ketika selectedMovie berubah
    useEffect(() => {
        if (selectedMovie) {
            fetchMovieDetails(selectedMovie).then(() => {
                if (movieDetails) {
                    setSelectedMovieDetails({ Title: movieDetails.Title, Poster: movieDetails.Poster, Plot: movieDetails.Plot, Runtime: movieDetails.Runtime, Genre: movieDetails.Genre });
                }
            });
        }
    }, [selectedMovie, fetchMovieDetails, movieDetails]);

    // Handle modal open/close
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // Handle modal save
    const handleModalSave = () => {
        handleCloseModal();
    };

    // Group ticket history by date
    const groupHistoryByDate = ticketHistory.reduce((acc, item) => {
        if (!acc[item.date]) {
            acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
    }, {} as Record<string, { title: string, quantity: number, total: number, date: string }[]>);

    // Sort dates in descending order
    const sortedDates = Object.keys(groupHistoryByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <>
        <HistoricalView ticketHistory={ticketHistory} onDelete={handleSave} />
        <InputView onSave={handleSave}  />
            <Box p={2}>
                <Grid container spacing={3}>
                    {/* Historical View */}
                    <Grid item xs={12} sm={7}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontSize: theme.typography.body2.fontSize, fontWeight: 'bold' }}>
                                Ringkasan Tanggal
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {/* Loop through the sorted history by date */}
                            {sortedDates.map((date, index) => {
                                const dailyHistory = groupHistoryByDate[date];
                                const totalTickets = dailyHistory.reduce((acc, item) => acc + item.quantity, 0);
                                const totalRevenue = dailyHistory.reduce((acc, item) => acc + item.total, 0);

                                return (
                                    <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="h6" sx={{ fontSize: theme.typography.body2.fontSize, fontWeight: 'bold' }}>
                                                Tanggal: {date}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {dailyHistory.slice().reverse().map((historyItem, subIndex) => (
                                                <Grid container spacing={2} key={subIndex}>
                                                    <Grid item xs={12} sm={7}>
                                                        <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                                            Judul Film: {historyItem.title}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={2}>
                                                        <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                                            Jumlah: {historyItem.quantity}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={3}>
                                                        <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                                            Total: Rp. {historyItem.total.toLocaleString()}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            ))}

                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="body2" sx={{ fontSize: theme.typography.body2.fontSize, fontWeight: 'bold' }}>
                                                Total Tiket Terjual: {totalTickets}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: theme.typography.body2.fontSize, fontWeight: 'bold' }}>
                                                Total Pendapatan: Rp. {totalRevenue.toLocaleString()}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1, fontSize: theme.typography.body2.fontSize, fontWeight: 'bold' }}>
                                Ringkasan Harian (Keseluruhan):
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                Total Tiket Terjual: {ticketHistory.reduce((acc, item) => acc + item.quantity, 0)}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                Total Pendapatan: Rp. {ticketHistory.reduce((acc, item) => acc + item.total, 0).toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Input View */}
                    <Grid item xs={12} sm={5}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Grid container spacing={2} justifyContent="space-between" mb={2}>
                                <Grid item xs={12} sm={4} sx={{ mb: 1 }}>
                                    <TextField
                                        id="ticket-quantity"
                                        label="Jumlah Tiket"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={ticketQuantity}
                                        onChange={(e) => setTicketQuantity(Number(e.target.value))}
                                        InputProps={{
                                            style: { fontSize: theme.typography.body2.fontSize }
                                        }}
                                        InputLabelProps={{
                                            style: { fontSize: theme.typography.body2.fontSize }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} justifyContent="space-between" mb={2}>
                                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                                    <TextField
                                        id="search-movie"
                                        label="Cari Film"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        InputProps={{
                                            style: { fontSize: theme.typography.body2.fontSize }
                                        }}
                                        InputLabelProps={{
                                            style: { fontSize: theme.typography.body2.fontSize }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="contained" size="medium" fullWidth onClick={handleSearch}>
                                        Cari
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Menampilkan loading, error, atau hasil film */}
                            {moviesLoading ? <CircularProgress /> : moviesError ? <Typography>{moviesError}</Typography> : (
                                <Grid container spacing={2} mb={3}>
                                    <Grid item xs={12} >
                                        <FormControl fullWidth>
                                            <InputLabel id="movie-select-label" sx={{ fontSize: theme.typography.body2.fontSize }} size="small">Pilih Film</InputLabel>
                                            <Select
                                                labelId="movie-select-label"
                                                id="movie-select"
                                                value={selectedMovie}
                                                onChange={(e) => setSelectedMovie(e.target.value as string)}
                                                label="Pilih Film"
                                                size="small"
                                                fullWidth
                                                sx={{ fontSize: theme.typography.body2.fontSize }}
                                            >
                                                {movies.map((movie) => (
                                                    <MenuItem key={movie.imdbID} value={movie.imdbID}>
                                                        {movie.Title} ({movie.Year})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            )}

                            {selectedMovieDetails && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Avatar
                                        alt={selectedMovieDetails.Title}
                                        src={selectedMovieDetails.Poster}
                                        sx={{ width: 100, height: 150, mb: 4 }}
                                        variant="rounded"
                                    />
                                </Box>
                            )}

                            <Grid container spacing={2} mb={2}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        id="date-picker"
                                        label="Pilih Tanggal"
                                        type="date"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={selectedDate}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            style: { fontSize: theme.typography.body2.fontSize }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ mb: 2, fontSize: theme.typography.body2.fontSize, fontWeight: 'bold' }}>
                                HTM :
                            </Typography>
                            <Grid container spacing={2} justifyContent="space-between">
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        id="htm"
                                        label="Harga Tiket"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={htm}
                                        onChange={(e) => setHTM(Number(e.target.value))}
                                        slotProps={{
                                            input: {
                                                readOnly: true, sx: { fontSize: theme.typography.body2.fontSize }
                                            },
                                        }}
                                        InputProps={{
                                            style: { fontSize: theme.typography.body2.fontSize }
                                        }}
                                        InputLabelProps={{
                                            style: { fontSize: theme.typography.body2.fontSize }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="contained" size="medium" fullWidth sx={{ bgcolor: '#2196F3', color: '#fff' }} onClick={handleOpenModal}>
                                        Edit
                                    </Button>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />
                            <Button variant="contained" size="medium" fullWidth onClick={handleSave} sx={{ bgcolor: '#4CAF50', color: '#fff' }}>
                                Simpan
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                {/* Modal for editing HTM */}
                <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogContent>
                        <Typography variant="h6" sx={{ mb: 2, fontSize: theme.typography.body2.fontSize, fontWeight: 'bold' }}>
                            Edit HTM :
                        </Typography>
                        <TextField
                            label="HTM Senin-Kamis"
                            type="number"
                            fullWidth
                            margin="normal"
                            size='small'
                            value={htmSeninKamis}
                            onChange={(e) => setHtmSeninKamis(parseInt(e.target.value))}
                            InputProps={{
                                style: { fontSize: theme.typography.body2.fontSize }
                            }}
                            InputLabelProps={{
                                style: { fontSize: theme.typography.body2.fontSize }
                            }}
                        />
                        <TextField
                            label="HTM Jumat-Sabtu"
                            type="number"
                            fullWidth
                            margin="normal"
                            size='small'
                            value={htmJumatSabtu}
                            onChange={(e) => setHtmJumatSabtu(parseInt(e.target.value))}
                            InputProps={{
                                style: { fontSize: theme.typography.body2.fontSize }
                            }}
                            InputLabelProps={{
                                style: { fontSize: theme.typography.body2.fontSize }
                            }}
                        />
                        <TextField
                            label="HTM Minggu"
                            type="number"
                            fullWidth
                            margin="normal"
                            size='small'
                            value={htmMinggu}
                            onChange={(e) => setHtmMinggu(parseInt(e.target.value))}
                            InputProps={{
                                style: { fontSize: theme.typography.body2.fontSize }
                            }}
                            InputLabelProps={{
                                style: { fontSize: theme.typography.body2.fontSize }
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button variant="contained" size="medium" onClick={handleCloseModal} sx={{ bgcolor: '#9E9E9E', color: '#fff' }}>
                            Batal
                        </Button>
                        <Button variant="contained" size="medium" onClick={handleModalSave} sx={{ bgcolor: '#2196F3', color: '#fff' }}>
                            Simpan
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export { App };
