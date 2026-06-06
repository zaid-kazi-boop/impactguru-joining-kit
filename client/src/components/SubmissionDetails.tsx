import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Submission = {
  id: number;
  fullName: string;
  fathersName: string;
  mothersName: string | null;
  spouseName: string | null;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string | null;
  bloodGroup: string | null;
  religion: string | null;
  currentAddress: string;
  currentLandmark: string | null;
  permanentAddress: string | null;
  village: string | null;
  state: string | null;
  mobileNumber: string;
  landline: string | null;
  personalEmail: string;
  placeOfSigning: string | null;
  employeeId: string;
  designation: string;
  department: string;
  reportingManager: string;
  dateOfJoining: string;
  employmentType: string;
  workLocation: string;
  ctc: string | null;
  officeEmail: string | null;
  panNumber: string;
  aadhaarNumber: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  accountHolderName: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  pfNumber: string | null;
  esiNumber: string | null;
  dependents: number | null;
  signature: string | null;
  submittedAt: Date;
  status: string;
  submittedBy: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface SubmissionDetailsProps {
  submission: Submission;
}

export default function SubmissionDetails({ submission }: SubmissionDetailsProps) {
  const sections = [
    {
      title: "Personal Identity",
      fields: [
        { label: "Full Name", value: submission.fullName },
        { label: "Father's Name", value: submission.fathersName },
        { label: "Mother's Name", value: submission.mothersName },
        { label: "Spouse's Name", value: submission.spouseName },
        { label: "Date of Birth", value: submission.dateOfBirth },
        { label: "Gender", value: submission.gender },
        { label: "Marital Status", value: submission.maritalStatus },
        { label: "Nationality", value: submission.nationality },
        { label: "Blood Group", value: submission.bloodGroup },
        { label: "Religion", value: submission.religion },
      ],
    },
    {
      title: "Address Details",
      fields: [
        { label: "Current Address", value: submission.currentAddress },
        { label: "Landmark", value: submission.currentLandmark },
        { label: "Permanent Address", value: submission.permanentAddress },
        { label: "Village", value: submission.village },
        { label: "State", value: submission.state },
      ],
    },
    {
      title: "Contact Details",
      fields: [
        { label: "Mobile Number", value: submission.mobileNumber },
        { label: "Landline", value: submission.landline },
        { label: "Personal Email", value: submission.personalEmail },
        { label: "Place of Signing", value: submission.placeOfSigning },
      ],
    },
    {
      title: "Employment Details",
      fields: [
        { label: "Employee ID", value: submission.employeeId },
        { label: "Designation", value: submission.designation },
        { label: "Department", value: submission.department },
        { label: "Reporting Manager", value: submission.reportingManager },
        { label: "Date of Joining", value: submission.dateOfJoining },
        { label: "Employment Type", value: submission.employmentType },
        { label: "Work Location", value: submission.workLocation },
        { label: "CTC", value: submission.ctc },
        { label: "Office Email", value: submission.officeEmail },
      ],
    },
    {
      title: "KYC & Bank Details",
      fields: [
        { label: "PAN Number", value: submission.panNumber },
        { label: "Aadhaar Number", value: submission.aadhaarNumber },
        { label: "Bank Account Number", value: submission.bankAccountNumber },
        { label: "Bank Name", value: submission.bankName },
        { label: "IFSC Code", value: submission.ifscCode },
        { label: "Account Holder Name", value: submission.accountHolderName },
      ],
    },
    {
      title: "Family & PF Details",
      fields: [
        { label: "Emergency Contact Name", value: submission.emergencyContactName },
        { label: "Emergency Contact Relation", value: submission.emergencyContactRelation },
        { label: "Emergency Contact Phone", value: submission.emergencyContactPhone },
        { label: "PF Number", value: submission.pfNumber },
        { label: "ESI Number", value: submission.esiNumber },
        { label: "Number of Dependents", value: submission.dependents?.toString() },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status and Metadata */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{submission.fullName}</h3>
          <p className="text-sm text-slate-600">{submission.employeeId}</p>
        </div>
        <div className="text-right">
          <Badge className="mb-2">
            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
          </Badge>
          <p className="text-xs text-slate-600">
            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, idx) => (
        <div key={idx}>
          <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">
            {section.title}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
            {section.fields.map((field, fieldIdx) => (
              <div key={fieldIdx}>
                <p className="text-xs font-medium text-slate-600 mb-1">{field.label}</p>
                <p className="text-sm text-slate-900 break-words">
                  {field.value ? field.value : <span className="text-slate-400 italic">—</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Signature */}
      {submission.signature && (
        <div>
          <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">
            Digital Signature
          </h4>
          <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50">
            <img src={submission.signature} alt="Signature" className="max-h-32 mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
