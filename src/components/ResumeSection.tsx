// src/components/ResumeSection.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Download, ChevronsLeft, ChevronsRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const resumeUrl = '/Karthik_U_Rao_Resume.pdf';

export default function ResumeSection() {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

    return (
        <section id="resume" className="py-20 px-4 bg-slate-800 text-white">
            <div className="container mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-center mb-4"
                >
                    My Resume
                </motion.h2>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex justify-center mb-8"
                >
                    <a href={resumeUrl} download>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                        </Button>
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex justify-center"
                >
                    <Card className="w-full max-w-4xl bg-slate-900 border-slate-700 overflow-hidden">
                        <CardContent className="p-4">
                            <div className="relative flex justify-center bg-slate-700">
                                <Document file={resumeUrl} onLoadSuccess={onDocumentLoadSuccess}>
                                    <Page pageNumber={pageNumber} renderTextLayer={false} />
                                </Document>
                            </div>
                             {numPages && (
                                <div className="flex items-center justify-center gap-4 mt-4 text-white">
                                    <Button variant="outline" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                                        <ChevronsLeft className="h-4 w-4" /> Prev
                                    </Button>
                                    <span>
                                        Page {pageNumber} of {numPages}
                                    </span>
                                    <Button variant="outline" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                                        Next <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}