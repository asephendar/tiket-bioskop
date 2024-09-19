import { useState, FC } from 'react';
import { Grid, Box } from '@mui/material';
import HistoricalView from '@components/Fragments/HistoricalView';
import { InputView } from '@components/Fragments/InputView';

interface TicketHistoryItem {
    title: string;
    quantity: number;
    total: number;
    date: string;
}

const IndexLayout: FC = () => {
    const [ticketHistory, setTicketHistory] = useState<TicketHistoryItem[]>([]);

    // Fungsi untuk menangani penyimpanan informasi tiket dari InputView
    const handleSave = (newTicket: TicketHistoryItem) => {
        // Memperbarui riwayat tiket dengan data tiket yang baru
        setTicketHistory((prevHistory) => [...prevHistory, newTicket]);
    };

    const handleDelete = (date: string) => {
        // terapkan logika hapus di sini
        setTicketHistory((prevHistory) => prevHistory.filter((item) => item.date !== date));
    };

    return (
        <Box p={2}>
            {/* <MovieSearchDetails /> */}
            <Grid container spacing={3}>
                {/* Historical View */}
                <HistoricalView ticketHistory={ticketHistory} onDelete={handleDelete} />

                {/* Input View */}
                <InputView onSave={handleSave} />
            </Grid>
        </Box>
    );
};

export default IndexLayout;
