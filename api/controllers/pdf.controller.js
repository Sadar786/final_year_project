import express from 'express';
import pdf from 'html-pdf';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();

// Use the built-in middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use CORS middleware
app.use(cors());

// Generate PDF function
export const generatePdf = (req, res) => {
    const { html } = req.body;

    if (!html) {
        return res.status(400).send('HTML content is required');
    }

    const pdfPath = path.resolve('./generated-pdf.pdf');

    pdf.create(html).toFile(pdfPath, (err, result) => {
        if (err) return res.status(500).send(err);

        res.sendFile(pdfPath, (sendFileErr) => {
            if (sendFileErr) return res.status(500).send(sendFileErr);

            // Delete the file after a short delay
            setTimeout(() => {
                fs.unlink(pdfPath, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting the file:', unlinkErr);
                });
            }, 10000); // Delay for 10 seconds
        });
    });
};
