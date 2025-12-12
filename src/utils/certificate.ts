/**
 * Certificate Generation Utility
 * Creates PDF certificates for quiz achievements
 */

import jsPDF from 'jspdf';

interface CertificateData {
  studentName: string;
  quizName: string;
  rank: number;
  score: number;
  compositeScore: number;
  date: string;
  totalParticipants: number;
}

/**
 * Load logo as base64 data URL
 */
const loadLogoAsBase64 = async (): Promise<string | null> => {
  try {
    const response = await fetch('/favicon.svg');
    const svgText = await response.text();
    // Convert SVG to base64 data URL
    const base64 = btoa(unescape(encodeURIComponent(svgText)));
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    console.warn('Could not load logo for certificate:', error);
    return null;
  }
};

/**
 * Generate a PDF certificate for quiz achievement
 */
export const generateCertificate = async (data: CertificateData): Promise<void> => {
  const { studentName, quizName, rank, score, compositeScore, date, totalParticipants } = data;

  // Create PDF document (A4 landscape: 297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  // Beautiful gradient background (light blue to white)
  doc.setFillColor(240, 248, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Add subtle pattern overlay
  doc.setFillColor(230, 240, 250);
  for (let i = 0; i < pageWidth; i += 20) {
    for (let j = 0; j < pageHeight; j += 20) {
      if ((i + j) % 40 === 0) {
        doc.circle(i, j, 1, 'F');
      }
    }
  }

  // Outer decorative border with gradient effect
  doc.setDrawColor(99, 102, 241); // Indigo
  doc.setLineWidth(4);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner decorative border
  doc.setDrawColor(139, 92, 246); // Purple
  doc.setLineWidth(2);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner decorations (ornamental)
  const cornerSize = 12;
  const cornerOffset = 18;
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(2);
  // Top-left corner
  doc.line(cornerOffset, cornerOffset, cornerOffset + cornerSize, cornerOffset);
  doc.line(cornerOffset, cornerOffset, cornerOffset, cornerOffset + cornerSize);
  // Top-right corner
  doc.line(pageWidth - cornerOffset, cornerOffset, pageWidth - cornerOffset - cornerSize, cornerOffset);
  doc.line(pageWidth - cornerOffset, cornerOffset, pageWidth - cornerOffset, cornerOffset + cornerSize);
  // Bottom-left corner
  doc.line(cornerOffset, pageHeight - cornerOffset, cornerOffset + cornerSize, pageHeight - cornerOffset);
  doc.line(cornerOffset, pageHeight - cornerOffset, cornerOffset, pageHeight - cornerOffset - cornerSize);
  // Bottom-right corner
  doc.line(pageWidth - cornerOffset, pageHeight - cornerOffset, pageWidth - cornerOffset - cornerSize, pageHeight - cornerOffset);
  doc.line(pageWidth - cornerOffset, pageHeight - cornerOffset, pageWidth - cornerOffset, pageHeight - cornerOffset - cornerSize);

  // Logo and Brand Header (Top Section)
  let currentY = 25;
  
  // Draw Guru AI logo (programmatic design)
  const logoSize = 16;
  const logoX = centerX;
  const logoY = currentY + logoSize / 2;
  
  // Try to add SVG logo, fallback to programmatic logo
  let logoAdded = false;
  try {
    const logoData = await loadLogoAsBase64();
    if (logoData) {
      try {
        doc.addImage(logoData, 'SVG', logoX - logoSize / 2, currentY, logoSize, logoSize);
        logoAdded = true;
      } catch (imgError) {
        // If addImage fails, use fallback
        logoAdded = false;
      }
    }
  } catch (error) {
    logoAdded = false;
  }
  
  // Draw programmatic logo if SVG failed
  if (!logoAdded) {
    // Outer circle with gradient effect (indigo to purple)
    doc.setFillColor(99, 102, 241); // Indigo
    doc.circle(logoX, logoY, logoSize / 2, 'F');
    
    // Inner circle
    doc.setFillColor(139, 92, 246); // Purple
    doc.circle(logoX, logoY, logoSize / 2 - 2, 'F');
    
    // Central node (AI brain representation)
    doc.setFillColor(255, 255, 255);
    doc.circle(logoX, logoY, 3, 'F');
    
    // Neural network nodes around center
    const nodeRadius = 1.5;
    const nodes = [
      [logoX - 4, logoY - 4],
      [logoX + 4, logoY - 4],
      [logoX - 4, logoY + 4],
      [logoX + 4, logoY + 4],
      [logoX, logoY - 6],
      [logoX, logoY + 6],
    ];
    
    nodes.forEach(([x, y]) => {
      doc.setFillColor(255, 255, 255);
      doc.circle(x, y, nodeRadius, 'F');
    });
  }
  
  currentY += logoSize + 4;

  // Guru AI Brand Text
  doc.setFontSize(18);
  doc.setTextColor(99, 102, 241);
  doc.setFont('helvetica', 'bold');
  doc.text('Guru AI', centerX, currentY, { align: 'center' });
  currentY += 8;

  // Decorative line under brand
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(1);
  doc.line(centerX - 30, currentY, centerX + 30, currentY);
  currentY += 12;

  // Congratulations Text (Large and Celebratory)
  doc.setFontSize(28);
  doc.setTextColor(236, 72, 153); // Pink
  doc.setFont('helvetica', 'bold');
  doc.text('CONGRATULATIONS!', centerX, currentY, { align: 'center' });
  currentY += 10;
  
  // Decorative stars/celebration marks
  doc.setFontSize(18);
  doc.setTextColor(255, 215, 0); // Gold
  doc.text('★', centerX - 32, currentY - 4);
  doc.text('★', centerX + 32, currentY - 4);
  currentY += 6;

  // Certificate Title
  doc.setFontSize(24);
  doc.setTextColor(25, 25, 112);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF ACHIEVEMENT', centerX, currentY, { align: 'center' });
  currentY += 14;

  // Subtitle
  doc.setFontSize(13);
  doc.setTextColor(70, 130, 180);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', centerX, currentY, { align: 'center' });
  currentY += 10;

  // Student Name (prominent)
  doc.setFontSize(28);
  doc.setTextColor(25, 25, 112);
  doc.setFont('helvetica', 'bold');
  const nameLines = doc.splitTextToSize(studentName.toUpperCase(), pageWidth - 80);
  const nameHeight = nameLines.length * 9;
  doc.text(nameLines, centerX, currentY, { align: 'center' });
  currentY += nameHeight + 6;

  // Achievement text
  doc.setFontSize(13);
  doc.setTextColor(70, 130, 180);
  doc.setFont('helvetica', 'normal');
  doc.text('has achieved', centerX, currentY, { align: 'center' });
  currentY += 10;

  // Medal and Rank Section
  const medalColor = rank === 1 ? [255, 215, 0] : rank === 2 ? [192, 192, 192] : [205, 127, 50];
  const rankText = rank === 1 ? 'FIRST PLACE' : rank === 2 ? 'SECOND PLACE' : 'THIRD PLACE';
  
  // Draw medal circle with glow effect
  doc.setFillColor(medalColor[0], medalColor[1], medalColor[2]);
  doc.circle(centerX, currentY + 7, 11, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(centerX, currentY + 7, 7, 'F');
  doc.setFontSize(15);
  doc.setTextColor(medalColor[0] * 0.7, medalColor[1] * 0.7, medalColor[2] * 0.7);
  doc.setFont('helvetica', 'bold');
  doc.text(rank.toString(), centerX, currentY + 10, { align: 'center' });
  currentY += 18;
  
  // Rank text
  doc.setFontSize(24);
  doc.setTextColor(medalColor[0] * 0.8, medalColor[1] * 0.8, medalColor[2] * 0.8);
  doc.setFont('helvetica', 'bold');
  doc.text(rankText, centerX, currentY, { align: 'center' });
  currentY += 12;

  // Quiz details
  doc.setFontSize(12);
  doc.setTextColor(70, 130, 180);
  doc.setFont('helvetica', 'normal');
  const quizLines = doc.splitTextToSize(`in the quiz: "${quizName}"`, pageWidth - 60);
  const quizHeight = quizLines.length * 6;
  doc.text(quizLines, centerX, currentY, { align: 'center' });
  currentY += quizHeight + 8;

  // Score details box (beautiful card design) - compact version
  const boxWidth = 85;
  const boxHeight = 22;
  const boxX = centerX - boxWidth / 2;
  const boxY = currentY;
  
  // Ensure box fits within page (with bottom margin of 50mm)
  const maxBoxY = pageHeight - 50 - boxHeight;
  const actualBoxY = Math.min(boxY, maxBoxY);
  
  // Box shadow effect
  doc.setFillColor(220, 230, 240);
  doc.roundedRect(boxX + 1, actualBoxY + 1, boxWidth, boxHeight, 3, 3, 'F');
  
  // Main box
  doc.setFillColor(250, 250, 255);
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(1);
  doc.roundedRect(boxX, actualBoxY, boxWidth, boxHeight, 3, 3, 'FD');
  
  // Score text - more compact layout
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text(`Score: ${score}%`, centerX, actualBoxY + 7, { align: 'center' });
  doc.text(`Composite: ${compositeScore.toFixed(1)}`, centerX, actualBoxY + 13, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const rankTextLine = `Rank: #${rank} of ${totalParticipants}`;
  doc.text(rankTextLine, centerX, actualBoxY + 19, { align: 'center' });
  
  currentY = actualBoxY + boxHeight + 10;

  // Ensure bottom section fits (need at least 35mm from bottom)
  const minBottomSpace = 35;
  const maxDateY = pageHeight - minBottomSpace;
  
  if (currentY > maxDateY) {
    currentY = maxDateY;
  }

  // Date section
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Issued on: ${formattedDate}`, centerX, currentY, { align: 'center' });
  currentY += 7;

  // Bottom decorative line
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(1.5);
  doc.line(centerX - 60, currentY, centerX + 60, currentY);
  currentY += 8;

  // Platform signature with Guru AI branding
  doc.setFontSize(11);
  doc.setTextColor(99, 102, 241);
  doc.setFont('helvetica', 'bold');
  doc.text('Guru AI Learning Platform', centerX, currentY, { align: 'center' });
  currentY += 5;
  
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Educational Excellence', centerX, currentY, { align: 'center' });
  currentY += 6;
  
  // Certificate ID
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  doc.setFont('helvetica', 'italic');
  doc.text('Certificate ID: ' + generateCertificateId(), centerX, currentY, { align: 'center' });

  // Save PDF
  const fileName = `Certificate_${studentName.replace(/\s+/g, '_')}_${quizName.replace(/[^a-zA-Z0-9]/g, '_')}_Rank${rank}.pdf`;
  doc.save(fileName);
};

/**
 * Generate a unique certificate ID
 */
const generateCertificateId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `KC-${timestamp}-${random}`.toUpperCase();
};
