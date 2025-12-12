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
 * Generate a PDF certificate for quiz achievement
 */
export const generateCertificate = (data: CertificateData): void => {
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

  // Background color
  doc.setFillColor(250, 250, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer decorative border
  doc.setDrawColor(100, 149, 237);
  doc.setLineWidth(3);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner decorative border
  doc.setDrawColor(176, 196, 222);
  doc.setLineWidth(1);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Corner decorations
  const cornerSize = 10;
  const cornerOffset = 15;
  doc.setDrawColor(100, 149, 237);
  doc.setLineWidth(1);
  doc.rect(cornerOffset, cornerOffset, cornerSize, cornerSize, 'S');
  doc.rect(pageWidth - cornerOffset - cornerSize, cornerOffset, cornerSize, cornerSize, 'S');
  doc.rect(cornerOffset, pageHeight - cornerOffset - cornerSize, cornerSize, cornerSize, 'S');
  doc.rect(pageWidth - cornerOffset - cornerSize, pageHeight - cornerOffset - cornerSize, cornerSize, cornerSize, 'S');

  // Title
  doc.setFontSize(38);
  doc.setTextColor(25, 25, 112);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF ACHIEVEMENT', centerX, 45, { align: 'center' });

  // Subtitle
  doc.setFontSize(16);
  doc.setTextColor(70, 130, 180);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', centerX, 65, { align: 'center' });

  // Student Name (prominent)
  doc.setFontSize(34);
  doc.setTextColor(25, 25, 112);
  doc.setFont('helvetica', 'bold');
  const nameLines = doc.splitTextToSize(studentName.toUpperCase(), pageWidth - 60);
  doc.text(nameLines, centerX, 90, { align: 'center' });

  // Achievement text
  doc.setFontSize(15);
  doc.setTextColor(70, 130, 180);
  doc.setFont('helvetica', 'normal');
  doc.text('has achieved', centerX, 110, { align: 'center' });

  // Medal and Rank
  const medalColor = rank === 1 ? [255, 215, 0] : rank === 2 ? [192, 192, 192] : [205, 127, 50];
  const rankText = rank === 1 ? 'FIRST PLACE' : rank === 2 ? 'SECOND PLACE' : 'THIRD PLACE';
  
  // Draw medal circle
  doc.setFillColor(medalColor[0], medalColor[1], medalColor[2]);
  doc.circle(centerX, 130, 10, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(centerX, 130, 6, 'F');
  doc.setFontSize(14);
  doc.setTextColor(medalColor[0] * 0.6, medalColor[1] * 0.6, medalColor[2] * 0.6);
  doc.setFont('helvetica', 'bold');
  doc.text(rank.toString(), centerX, 133, { align: 'center' });
  
  // Rank text
  doc.setFontSize(26);
  doc.setTextColor(medalColor[0] * 0.7, medalColor[1] * 0.7, medalColor[2] * 0.7);
  doc.setFont('helvetica', 'bold');
  doc.text(rankText, centerX, 150, { align: 'center' });

  // Quiz details
  doc.setFontSize(13);
  doc.setTextColor(70, 130, 180);
  doc.setFont('helvetica', 'normal');
  const quizLines = doc.splitTextToSize(`in the quiz: "${quizName}"`, pageWidth - 40);
  doc.text(quizLines, centerX, 165, { align: 'center' });

  // Score details box
  doc.setFillColor(245, 245, 250);
  doc.roundedRect(centerX - 50, 175, 100, 25, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text(`Score: ${score}%`, centerX - 25, 185, { align: 'center' });
  doc.text(`Composite: ${compositeScore.toFixed(1)}`, centerX + 25, 185, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Rank: #${rank} of ${totalParticipants} participants`, centerX, 195, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, centerX, pageHeight - 45, { align: 'center' });

  // Bottom decorative line
  doc.setDrawColor(176, 196, 222);
  doc.setLineWidth(1);
  doc.line(centerX - 70, pageHeight - 35, centerX + 70, pageHeight - 35);

  // Platform signature
  doc.setFontSize(11);
  doc.setTextColor(100, 149, 237);
  doc.setFont('helvetica', 'bold');
  doc.text('KidChatbox Learning Platform', centerX, pageHeight - 25, { align: 'center' });
  
  // Certificate ID
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificate ID: ' + generateCertificateId(), centerX, pageHeight - 15, { align: 'center' });

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
