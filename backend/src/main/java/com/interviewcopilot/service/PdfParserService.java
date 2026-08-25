package com.interviewcopilot.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
public class PdfParserService {

    public String extractText(MultipartFile file) throws IOException {
        log.info("Extracting text from PDF: {}", file.getOriginalFilename());
        
        try (PDDocument document = Loader.loadPDF(new org.apache.pdfbox.io.RandomAccessReadBuffer(file.getBytes()))) {
            PDFTextStripper stripper = new PDFTextStripper();
            
            // Optionally set sortByPosition to true to attempt retaining visual layout order
            stripper.setSortByPosition(true);
            
            String text = stripper.getText(document);
            log.debug("Successfully extracted {} characters from PDF.", text.length());
            return text;
        }
    }
}

