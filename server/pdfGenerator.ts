import { jsPDF } from 'jspdf';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';

export interface JoiningKitData {
  // Personal Details
  fullName: string;
  fathersName: string;
  mothersName?: string;
  spouseName?: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality?: string;
  bloodGroup?: string;
  religion?: string;
  // Address Details
  currentAddress: string;
  currentLandmark?: string;
  permanentAddress?: string;
  village?: string;
  state?: string;
  // Contact Details
  mobileNumber: string;
  landline?: string;
  personalEmail: string;
  placeOfSigning?: string;
  // Employment Details
  employeeId: string;
  designation: string;
  department: string;
  reportingManager: string;
  dateOfJoining: string;
  employmentType: string;
  workLocation: string;
  ctc?: string;
  officeEmail?: string;
  // KYC & Bank Details
  panNumber: string;
  aadhaarNumber: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  accountHolderName: string;
  // Family & PF Details
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  pfNumber?: string;
  esiNumber?: string;
  dependents?: number;
  // Signature
  signature?: string;
}

export async function generateJoiningKitPDF(data: JoiningKitData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;
  const lineHeight = 6;
  const sectionSpacing = 3;

  // Helper function to add text
  const addText = (text: string, x: number, y: number, fontSize: number = 10, bold: boolean = false) => {
    doc.setFontSize(fontSize);
    if (bold) doc.setFont(undefined, 'bold');
    else doc.setFont(undefined, 'normal');
    doc.text(text, x, y);
  };

  // Helper function to add a section
  const addSection = (title: string) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;
    }
    addText(title, margin, yPosition, 12, true);
    yPosition += lineHeight + sectionSpacing;
  };

  // Helper function to add a field
  const addField = (label: string, value: string | undefined, inline: boolean = false) => {
    if (yPosition > pageHeight - 15) {
      doc.addPage();
      yPosition = margin;
    }
    const displayValue = value || '_______________';
    addText(`${label}: ${displayValue}`, margin, yPosition, 9);
    yPosition += lineHeight;
  };

  // Header
  addText('IMPACT GURU TECHNOLOGY VENTURES PRIVATE LIMITED', margin, yPosition, 11, true);
  yPosition += lineHeight;
  addText('EMPLOYEE JOINING FORM', margin, yPosition, 11, true);
  yPosition += lineHeight + sectionSpacing;

  // Employee Info Header
  addText(`Name Of Employee: ${data.fullName}`, margin, yPosition, 10, true);
  yPosition += lineHeight;
  addText(`Department: ${data.department}`, margin, yPosition, 10);
  yPosition += lineHeight;
  addText(`Designation: ${data.designation}`, margin, yPosition, 10);
  yPosition += lineHeight;
  addText(`Date of Joining: ${data.dateOfJoining}`, margin, yPosition, 10);
  yPosition += lineHeight;
  addText(`Emp Code: ${data.employeeId}`, margin, yPosition, 10);
  yPosition += lineHeight + sectionSpacing;

  // Personal Details Section
  addSection('PERSONAL DETAILS');
  addField('Name', data.fullName);
  addField("Father's Name", data.fathersName);
  addField("Mother's Name", data.mothersName);
  addField('Date of Birth', data.dateOfBirth);
  addField('Gender', data.gender);
  addField('Marital Status', data.maritalStatus);
  addField('Blood Group', data.bloodGroup);
  addField('Nationality', data.nationality);
  addField('Religion', data.religion);
  yPosition += sectionSpacing;

  // Address Details Section
  addSection('ADDRESS DETAILS');
  addField('Correspondence / Current Address', data.currentAddress);
  addField('Landmark', data.currentLandmark);
  addField('Permanent Address', data.permanentAddress || data.currentAddress);
  addField('Village', data.village);
  addField('State', data.state);
  yPosition += sectionSpacing;

  // Contact Details Section
  addSection('CONTACT DETAILS');
  addField('Mobile', data.mobileNumber);
  addField('Landline', data.landline);
  addField('Email ID', data.personalEmail);
  yPosition += sectionSpacing;

  // Employment Details Section
  addSection('EMPLOYMENT DETAILS');
  addField('Employee ID', data.employeeId);
  addField('Designation', data.designation);
  addField('Department', data.department);
  addField('Reporting Manager', data.reportingManager);
  addField('Date of Joining', data.dateOfJoining);
  addField('Employment Type', data.employmentType);
  addField('Work Location', data.workLocation);
  addField('CTC', data.ctc);
  addField('Office Email', data.officeEmail);
  yPosition += sectionSpacing;

  // KYC & Bank Details Section
  addSection('KYC & BANK DETAILS');
  addField('PAN Number', data.panNumber);
  addField('Aadhaar Number', data.aadhaarNumber);
  addField('Bank Account Number', data.bankAccountNumber);
  addField('Bank Name', data.bankName);
  addField('IFSC Code', data.ifscCode);
  addField('Account Holder Name', data.accountHolderName);
  yPosition += sectionSpacing;

  // Family & PF Details Section
  addSection('FAMILY & PF DETAILS');
  addField('Emergency Contact Name', data.emergencyContactName);
  addField('Emergency Contact Relation', data.emergencyContactRelation);
  addField('Emergency Contact Phone', data.emergencyContactPhone);
  addField('PF Number', data.pfNumber);
  addField('ESI Number', data.esiNumber);
  addField('Number of Dependents', data.dependents?.toString());
  yPosition += sectionSpacing;

  // Declaration Section
  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = margin;
  }
  addSection('DECLARATION');
  const declarationText = 'I hereby declare that the above statements made in my application form are true, complete and correct to the best of my knowledge and belief. In the event of any information being found false or incorrect at any stage, my services are liable to be terminated without notice.';
  const splitText = doc.splitTextToSize(declarationText, contentWidth - 5);
  doc.setFontSize(9);
  doc.text(splitText, margin + 2, yPosition);
  yPosition += splitText.length * lineHeight + sectionSpacing;

  // Signature Section
  yPosition += 10;
  addText('Date: _______________', margin, yPosition);
  yPosition += lineHeight;
  addText('Place: _______________', margin, yPosition);
  yPosition += lineHeight + 5;

  // Add signature image if available
  if (data.signature && data.signature.startsWith('data:image')) {
    try {
      doc.addImage(data.signature, 'PNG', margin, yPosition, 30, 20);
      yPosition += 25;
    } catch (error) {
      console.error('Error adding signature image:', error);
    }
  }

  addText('Signature: _______________', margin, yPosition);
  yPosition += lineHeight;
  addText('Employee Name (Print): _______________', margin, yPosition);

  // Footer
  yPosition = pageHeight - 15;
  addText('Impact Guru Technology Ventures Private Limited', margin, yPosition, 8);
  yPosition += lineHeight;
  addText('3rd Floor, Vaman Techno Center, Makwana Road, Andheri East, Mumbai – 400059', margin, yPosition, 8);

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}
