import { FC, useState, useEffect } from 'react';
import {
    Grid, Paper, TextField, Button, FormControl, InputLabel, MenuItem, Select,
    Typography, Divider, Box, CircularProgress, Avatar, Dialog, DialogActions,
    DialogContent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '@src/reduxs/hooks';
// import { fetchMovies } from '@src/reduxs/slices/moviesSlice';
import { searchMovies } from '@models/actions/moviesActions';
import { fetchMovieDetails } from '@models/actions/movieDetailsActions';
// import { fetchMovieDetails } from '@src/reduxs/slices/movieDetailsSlice';
import { SelectChangeEvent } from '@mui/material/Select'; // Impor SelectChangeEvent untuk tipe event Select

interface InputViewProps {
    onSave: (ticket: { title: string; quantity: number; total: number; date: string; seats: string[] }) => void;
}

const rows = ['A', 'B', 'C', 'D', 'E'];
const seatsPerRow = 8;

// Fungsi untuk menghasilkan daftar kursi
const generateSeats = () => {
    return rows.flatMap(row =>
        Array.from({ length: seatsPerRow }, (_, index) => `${row}${(index + 1).toString().padStart(2, '0')}`)
    );
};

const InputView: FC<InputViewProps> = ({ onSave }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    // State untuk jumlah tiket yang akan dibeli
    const [ticketQuantity, setTicketQuantity] = useState<number | ''>('');

    // State untuk tanggal yang dipilih
    const [selectedDate, setSelectedDate] = useState<string>('');

    // State untuk harga tiket per hari
    const [htm, setHTM] = useState<number>(0);

    // State untuk kueri pencarian film
    const [searchQuery, setSearchQuery] = useState<string>('');

    // State untuk film yang dipilih
    const [selectedMovie, setSelectedMovie] = useState<string>('');

    // Mengambil data film dan detail film dari Redux
    const { movies, loading: moviesLoading, error: moviesError } = useAppSelector(state => state.movies);
    const { movieDetails: selectedMovieDetails, loading: movieDetailsLoading, error: movieDetailsError } = useAppSelector(state => state.movieDetails);

    const [open, setOpen] = useState(false); // State untuk kontrol dialog
    const [movieSeats, setMovieSeats] = useState<{ [key: string]: { [key: string]: string[] } }>({}); // State untuk kursi film
    const [openModal, setOpenModal] = useState(false); // State untuk kontrol modal

    // Harga tiket per hari
    const [htmSeninKamis, setHtmSeninKamis] = useState(30000);
    const [htmJumatSabtu, setHtmJumatSabtu] = useState(50000);
    const [htmMinggu, setHtmMinggu] = useState(40000);

    // State untuk waktu tayang yang dipilih
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

    // Mengambil kursi yang dipilih untuk film dan waktu tayang yang dipilih
    const selectedSeats = movieSeats[selectedMovie]?.[selectedTimeSlot] || [];

    // Fungsi untuk menangani klik pada kursi
    const handleSeatClick = (seat: string) => {
        if (selectedTimeSlot) {
            setMovieSeats(prev => ({
                ...prev,
                [selectedMovie]: {
                    ...prev[selectedMovie],
                    [selectedTimeSlot]: prev[selectedMovie]?.[selectedTimeSlot]?.includes(seat)
                        ? prev[selectedMovie][selectedTimeSlot].filter(seatNumber => seatNumber !== seat)
                        : [...(prev[selectedMovie]?.[selectedTimeSlot] || []), seat]
                }
            }));
        }
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Fungsi untuk menyimpan data tiket
    const handleSave = () => {
        if (ticketQuantity && selectedMovie && htm && selectedDate && selectedMovieDetails && selectedSeats.length > 0) {
            const totalPrice = ticketQuantity * htm;
            onSave({
                title: selectedMovieDetails.Title,
                quantity: ticketQuantity,
                total: totalPrice,
                date: selectedDate,
                seats: selectedSeats, // Kursi sesuai film dan waktu tayang yang dipilih
            });
            // Reset state setelah menyimpan
            setTicketQuantity('');
            setSelectedMovie('');
            setHTM(0);
            setSelectedDate('');
        }
    };

    // Fungsi untuk menangani perubahan waktu tayang
    const handleTimeSlotChange = (event: SelectChangeEvent<string>) => {
        setSelectedTimeSlot(event.target.value as string);
    };

    // const handleSearch = () => {
    //     if (searchQuery) {
    //         dispatch(fetchMovies(searchQuery));
    //     }
    // };

    const handleSearch = () => {
        if (searchQuery) {
            dispatch(searchMovies(searchQuery));
        }
    };

    // Jadwal tayang film yang telah ditentukan
    const movieTimeSlots: Record<string, string[]> = {
        'Naruto': ['10:00', '13:30', '17:00', '20:30'],
        'One Piece': ['11:00', '14:00', '18:00', '21:00'],
        'Dragon Ball': ['09:30', '12:30', '16:00', '19:00', '22:00'],
        'default': ['10:00', '13:00', '16:00', '19:00', '22:00'],
    };

    // Fungsi untuk mendapatkan jadwal tayang berdasarkan judul film
    const getTimeSlots = (movieTitle: string): string[] => {
        return movieTimeSlots[movieTitle] || movieTimeSlots['default'];
    };

    // Fungsi untuk menangani perubahan tanggal
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        const dayOfWeek = new Date(date).getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 4) {
            setHTM(htmSeninKamis);
        } else if (dayOfWeek === 5 || dayOfWeek === 6) {
            setHTM(htmJumatSabtu);
        } else {
            setHTM(htmMinggu);
        }
    };

    // Mengambil detail film setelah memilih salah satu film
    useEffect(() => {
        if (selectedMovie) {
            dispatch(fetchMovieDetails(selectedMovie));
        }
    }, [selectedMovie, dispatch]);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleModalSave = () => {
        handleCloseModal();
    };

    return (
        <>
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
                        <Box >
                            <Avatar
                                alt={selectedMovieDetails.Title}
                                src={selectedMovieDetails.Poster}
                                sx={{ width: 100, height: 150, mb: 2, cursor: 'pointer' }} // Tambahkan cursor pointer untuk interaksi
                                variant="rounded"
                                onClick={handleClickOpen} // Buka modal ketika gambar diklik
                            />
                            <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                <strong>Plot:</strong> {selectedMovieDetails.Plot}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                <strong>Genre:</strong> {selectedMovieDetails.Genre}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize }}>
                                <strong>Durasi:</strong> {selectedMovieDetails.Runtime}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize, mb: 3 }}>
                                <strong>Jam Tayang Terpilih:</strong> {selectedTimeSlot ? selectedTimeSlot : 'Belum dipilih'}
                            </Typography>

                            {/* Pilih Jam Tayang */}
                            <FormControl fullWidth>
                                <InputLabel id="time-slot-label" sx={{ fontSize: theme.typography.body2.fontSize }} size="small">Pilih Jam Tayang</InputLabel>
                                <Select
                                    labelId="time-slot-label"
                                    id="time-slot"
                                    value={selectedTimeSlot}
                                    onChange={handleTimeSlotChange}
                                    label="Pilih Jam Tayang"
                                    size="small"
                                    fullWidth
                                    sx={{ fontSize: theme.typography.body2.fontSize }}
                                >
                                    {getTimeSlots(selectedMovieDetails.Title).map((time) => (
                                        <MenuItem key={time} value={time}>
                                            {time}
                                        </MenuItem>
                                    ))}
                                </Select>

                            </FormControl>

                            {/* Menampilkan jam tayang yang dipilih */}
                            {/* {selectedTimeSlot && (
                                <Typography variant="body1" sx={{ fontSize: theme.typography.body2.fontSize, my: 2 }}>
                                    <strong>Jam Tayang Terpilih:</strong> {selectedTimeSlot}
                                </Typography>
                            )} */}
                        </Box>
                    )}

                    <Grid container spacing={2} my={2}>
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
                    <Grid container spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
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


                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontSize: theme.typography.body2.fontSize, fontWeight: 'bold' }}>
                            Pilih Kursi:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                            LAYAR
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)`,
                                gap: 0.5,
                                maxWidth: '100%',
                                overflowX: 'auto',
                                padding: 1,
                                justifyContent: 'center'
                            }}
                        >
                            {generateSeats().map(seat => (
                                <Box
                                    key={seat}
                                    onClick={() => handleSeatClick(seat)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #ddd',
                                        padding: 0.5,
                                        width: { xs: 20, sm: 40 },
                                        height: { xs: 20, sm: 40 },
                                        fontSize: { xs: 10, sm: 14 },
                                        position: 'relative',
                                        cursor: 'pointer',
                                        backgroundColor: (movieSeats[selectedMovie]?.[selectedTimeSlot] || []).includes(seat) ? '#d1e7dd' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: { xs: 10, sm: 14 },
                                        }}
                                    >
                                        {seat}
                                    </Typography>
                                    {(movieSeats[selectedMovie]?.[selectedTimeSlot] || []).includes(seat) && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                fontSize: { xs: 10, sm: 14 },
                                                textAlign: 'center',
                                            }}
                                        >
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>

                    </Paper>



                    <Divider sx={{ my: 3 }} />
                    <Button variant="contained" size="medium" fullWidth onClick={handleSave} sx={{ bgcolor: '#4CAF50', color: '#fff' }}>
                        Simpan
                    </Button>
                </Paper>
            </Grid>
            {/* Modal untuk menampilkan gambar besar */}
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    {selectedMovieDetails && (
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={selectedMovieDetails.Poster}
                                alt={selectedMovieDetails.Title}
                                style={{ maxWidth: '100%', height: 'auto' }} // Membuat gambar lebih besar
                            />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
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
        </>
    );
};

export { InputView };
