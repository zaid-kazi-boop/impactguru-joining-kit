import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type FormData = {
  fullName: string;
  fathersName: string;
  mothersName: string;
  spouseName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  bloodGroup: string;
  religion: string;
  currentAddress: string;
  currentLandmark: string;
  permanentAddress: string;
  village: string;
  state: string;
  mobileNumber: string;
  landline: string;
  personalEmail: string;
  placeOfSigning: string;
  employeeId: string;
  designation: string;
  department: string;
  reportingManager: string;
  dateOfJoining: string;
  employmentType: string;
  workLocation: string;
  ctc: string;
  officeEmail: string;
  panNumber: string;
  aadhaarNumber: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  accountHolderName: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  pfNumber: string;
  esiNumber: string;
  dependents: string;
  signature: string;
};

interface ReviewStepProps {
  formData: FormData;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const sections = [
    {
      title: "Personal Identity",
      fields: [
        { label: "Full Name", value: formData.fullName },
        { label: "Father's Name", value: formData.fathersName },
        { label: "Mother's Name", value: formData.mothersName },
        { label: "Spouse's Name", value: formData.spouseName },
        { label: "Date of Birth", value: formData.dateOfBirth },
        { label: "Gender", value: formData.gender },
        { label: "Marital Status", value: formData.maritalStatus },
        { label: "Nationality", value: formData.nationality },
        { label: "Blood Group", value: formData.bloodGroup },
        { label: "Religion", value: formData.religion },
      ],
    },
    {
      title: "Address Details",
      fields: [
        { label: "Current Address", value: formData.currentAddress },
        { label: "Landmark", value: formData.currentLandmark },
        { label: "Permanent Address", value: formData.permanentAddress },
        { label: "Village", value: formData.village },
        { label: "State", value: formData.state },
      ],
    },
    {
      title: "Contact Details",
      fields: [
        { label: "Mobile Number", value: formData.mobileNumber },
        { label: "Landline", value: formData.landline },
        { label: "Personal Email", value: formData.personalEmail },
        { label: "Place of Signing", value: formData.placeOfSigning },
      ],
    },
    {
      title: "Employment Details",
      fields: [
        { label: "Employee ID", value: formData.employeeId },
        { label: "Designation", value: formData.designation },
        { label: "Department", value: formData.department },
        { label: "Reporting Manager", value: formData.reportingManager },
        { label: "Date of Joining", value: formData.dateOfJoining },
        { label: "Employment Type", value: formData.employmentType },
        { label: "Work Location", value: formData.workLocation },
        { label: "CTC", value: formData.ctc },
        { label: "Office Email", value: formData.officeEmail },
      ],
    },
    {
      title: "KYC & Bank Details",
      fields: [
        { label: "PAN Number", value: formData.panNumber },
        { label: "Aadhaar Number", value: formData.aadhaarNumber },
        { label: "Bank Account Number", value: formData.bankAccountNumber },
        { label: "Bank Name", value: formData.bankName },
        { label: "IFSC Code", value: formData.ifscCode },
        { label: "Account Holder Name", value: formData.accountHolderName },
      ],
    },
    {
      title: "Family & PF Details",
      fields: [
        { label: "Emergency Contact Name", value: formData.emergencyContactName },
        { label: "Emergency Contact Relation", value: formData.emergencyContactRelation },
        { label: "Emergency Contact Phone", value: formData.emergencyContactPhone },
        { label: "PF Number", value: formData.pfNumber },
        { label: "ESI Number", value: formData.esiNumber },
        { label: "Number of Dependents", value: formData.dependents },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-green-900 mb-1">Review Your Information</h3>
          <p className="text-sm text-green-800">
            Please review all the information below carefully before submitting. Once submitted, you cannot make changes.
          </p>
        </div>
      </div>

      {sections.map((section, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIdx) => (
                <div key={fieldIdx}>
                  <p className="text-sm font-medium text-slate-600 mb-1">{field.label}</p>
                  <p className="text-base text-slate-900 break-words">
                    {field.value || <span className="text-slate-400 italic">Not provided</span>}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {formData.signature && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50">
              <img src={formData.signature} alt="Signature" className="max-h-32 mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900 mb-1">Important</h3>
          <p className="text-sm text-amber-800">
            By submitting this joining kit, you confirm that all the information provided is accurate and complete to the best of your knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}
