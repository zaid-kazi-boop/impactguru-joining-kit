import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

interface ProfilePayload {
  fullName: string;
  department: string;
  designation: string;
  doj: string;
  fatherName: string;
  currentAddress: string;
  permanentAddress: string;
  phone: string;
  dob: string;
  panNum: string;
  manager: string;
}

export async function compileOnboardingTemplate(payload: ProfilePayload): Promise<Uint8Array> {
  // Path verification container target
  const templatePath = path.join(process.cwd(), 'public', 'assets', 'IGTV_other_dept_joining_kit.pdf');
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Target operational asset missing from physical folder path structure: ${templatePath}`);
  }

  const existingPdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const internalAcroForm = pdfDoc.getForm();
  const physicalFieldsList = internalAcroForm.getFields();

  // Primary Global Data Mapping Matrix Configuration
  const schemaBindingRules = [
    { matcher: /^Name\s*Of\s*Employee/i, content: payload.fullName },
    { matcher: /^Department/i, content: payload.department },
    { matcher: /^Designation/i, content: payload.designation },
    { matcher: /^Date\s*of\s*Joining/i, content: payload.doj },
    { matcher: /^Father/i, content: payload.fatherName },
    { matcher: /^Correspondence\s*Address/i, content: payload.currentAddress },
    { matcher: /^Permanent\s*Address/i, content: payload.permanentAddress },
    { matcher: /^Telephone/i, content: payload.phone },
    { matcher: /^Date\s*of\s*Birth/i, content: payload.dob },
    { matcher: /^Pan\s*Card/i, content: payload.panNum },
    { matcher: /^Reporting\s*Manager/i, content: payload.manager }
  ];

  // Scans all field parameters across the entire 26-page block
  physicalFieldsList.forEach(fieldInstance => {
    const fieldInstanceName = fieldInstance.getName();
    
    // Test current form instance against rules mapping array
    for (const rule of schemaBindingRules) {
      if (rule.matcher.test(fieldInstanceName)) {
        try {
          const textNode = internalAcroForm.getTextField(fieldInstanceName);
          if (textNode) {
            textNode.setText(rule.content || "");
            break; // Matched and populated safely
          }
        } catch (bindingIssue) {
          console.debug(`Skipped formatting field token instance: ${fieldInstanceName}`);
        }
      }
    }
  });

  // Flatten the form layout to make fields non-editable and printable
  internalAcroForm.flatten();
  
  return await pdfDoc.save();
}
