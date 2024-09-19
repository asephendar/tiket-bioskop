import { FC } from 'react';
import { Grid, Button, Chip, Paper, Typography, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useTheme } from '@mui/material/styles';
import jsPDF from 'jspdf';

interface TicketHistoryItem {
    title: string;
    quantity: number;
    total: number;
    date: string;
}

interface HistoricalViewProps {
    ticketHistory: TicketHistoryItem[];
    onDelete: (date: string) => void;
}

const HistoricalView: FC<HistoricalViewProps> = ({ ticketHistory, onDelete }) => {
    const theme = useTheme();
    // Group ticket history by date
    const groupHistoryByDate = ticketHistory.reduce((acc, item) => {
        if (!acc[item.date]) {
            acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
    }, {} as Record<string, TicketHistoryItem[]>);

    // Sort dates in descending order
    const sortedDates = Object.keys(groupHistoryByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Handle delete click
    const handleDelete = (date: string) => {
        onDelete(date); // Call the parent component's onDelete function
    };


    // Generate PDF function
    const handleGeneratePDF = (selectedDate: string) => {
        const doc = new jsPDF();
        const marginLeft = 15;
        let currentY = 20;

        doc.setFontSize(14);
        doc.text('Ringkasan Tiket Terjual', marginLeft, 10);
        doc.setFontSize(12);

        const dailyHistory = groupHistoryByDate[selectedDate];
        if (dailyHistory) {
            const totalTickets = dailyHistory.reduce((acc, item) => acc + item.quantity, 0);
            const totalRevenue = dailyHistory.reduce((acc, item) => acc + item.total, 0);

            // Add date as a section header
            doc.setFontSize(12);
            doc.text(`Tanggal: ${selectedDate}`, marginLeft, currentY);
            currentY += 10; // Move down for the next section

            // Add details for each movie on that date
            dailyHistory.forEach((historyItem) => {
                doc.setFontSize(10);
                doc.text(`Judul: ${historyItem.title}`, marginLeft, currentY);
                doc.text(`Jumlah: ${historyItem.quantity}`, marginLeft + 160, currentY);
                doc.text(`Total: Rp. ${historyItem.total.toLocaleString()}`, marginLeft + 110, currentY);
                currentY += 7; // Keep small space between each movie entry
            });

            // Add total tickets and revenue with a bold style
            currentY += 5; // Add extra space before totals
            doc.setFontSize(12);
            doc.text(`Total Tiket Terjual: ${totalTickets}`, marginLeft, currentY);
            doc.text(`Total Pendapatan: Rp. ${totalRevenue.toLocaleString()}`, marginLeft + 70, currentY);
            currentY += 10; // Space between different dates

            // Draw a line to separate sections
            doc.setLineWidth(0.5);
            doc.line(marginLeft, currentY, 190, currentY);
        } else {
            doc.text('Tidak ada data untuk tanggal yang dipilih.', marginLeft, currentY);
        }

        // Save the PDF
        doc.save(`ticket_history_${selectedDate}.pdf`);
    };



    return (
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
                                <Grid container spacing={2} sx={{ mb: 6 }} justifyContent="flex-end">
                                    <Grid item>
                                        <Chip
                                            label="Hapus"
                                            onClick={() => handleDelete(date)}
                                            onDelete={() => handleDelete(date)}
                                            deleteIcon={<DeleteIcon />}
                                            variant="outlined"
                                            sx={{ mr: 1 }}
                                        />
                                        <Chip
                                            label="Cetak PDF"
                                            onClick={() => handleGeneratePDF(date)} // Pass the selected date to the PDF function
                                            onDelete={() => handleGeneratePDF(date)}
                                            deleteIcon={<PictureAsPdfIcon />}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>

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
    );
};

export default HistoricalView;
