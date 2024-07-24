import React, { useState } from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import MonthlyReport from './MoReportOfShop';
import { store } from '../redex/store'; // Update this path to your actual store

const GeneratePdf = () => {
    const [pdfLink, setPdfLink] = useState('');

    const handleGeneratePDF = async () => {
        try {
            // Render the MonthlyReport component to an HTML string
            const financePageContent = ReactDOMServer.renderToString(
                <Provider store={store}>
                    <MonthlyReport />
                </Provider>
            );

            const response = await fetch('/api/pdf/generatePdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ html: financePageContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await response.blob();
            const pdfUrl = window.URL.createObjectURL(blob);
            setPdfLink(pdfUrl);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div className="lg:flex flex-col justify-center items-center w-full table-auto overflow-x-scroll md:ax-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            <div>
                <button onClick={handleGeneratePDF} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Generate PDF
                </button>
                {pdfLink && (
                    <div className="mt-4">
                        <a href={pdfLink} target="_blank" rel="noopener noreferrer" download="report.pdf">Download PDF</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneratePdf;
