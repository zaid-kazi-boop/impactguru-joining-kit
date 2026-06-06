import { useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import SignaturePad from "@/components/SignaturePad";
import ReviewStep from "@/components/ReviewStep";
import { useLocation } from "wouter";

const STEPS = [
  { id: "personal", label: "Personal & Contact", icon: "👤" },
  { id: "employment", label: "Employment", icon: "💼" },
  { id: "kyc", label: "KYC & Bank", icon: "🏦" },
  { id: "family", label: "Family & PF", icon: "👨‍👩‍👧" },
  { id: "signature", label: "Signature", icon: "✍️" },
  { id: "review", label: "Review & Generate", icon: "✅" },
];

type FormData = {
  // Personal Details
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
  // Address Details
  currentAddress: string;
  currentLandmark: string;
  permanentAddress: string;
  village: string;
  state: string;
  // Contact Details
  mobileNumber: string;
  landline: string;
  personalEmail: string;
  placeOfSigning: string;
  // Employment Details
  employeeId: string;
  designation: string;
  department: string;
  reportingManager: string;
  dateOfJoining: string;
  employmentType: string;
  workLocation: string;
  ctc: string;
  officeEmail: string;
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
  pfNumber: string;
  esiNumber: string;
  dependents: string;
  // Signature
  signature: string;
};

const initialFormData: FormData = {
  fullName: "",
  fathersName: "",
  mothersName: "",
  spouseName: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  nationality: "",
  bloodGroup: "",
  religion: "",
  currentAddress: "",
  currentLandmark: "",
  permanentAddress: "",
  village: "",
  state: "",
  mobileNumber: "",
  landline: "",
  personalEmail: "",
  placeOfSigning: "",
  employeeId: "",
  designation: "",
  department: "",
  reportingManager: "",
  dateOfJoining: "",
  employmentType: "",
  workLocation: "",
  ctc: "",
  officeEmail: "",
  panNumber: "",
  aadhaarNumber: "",
  bankAccountNumber: "",
  bankName: "",
  ifscCode: "",
  accountHolderName: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactPhone: "",
  pfNumber: "",
  esiNumber: "",
  dependents: "",
  signature: "",
};

export default function JoiningKitForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitMutation = trpc.joiningKit.submit.useMutation({
    onError: (error) => {
      console.error("Submission error:", error);
    },
  });

  // Auto-fill permanent address from current address
  const handleCurrentAddressChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        currentAddress: value,
        permanentAddress: prev.permanentAddress || value,
      }));
    },
    []
  );

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const mandatoryFields = [
      "fullName",
      "fathersName",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "currentAddress",
      "mobileNumber",
      "personalEmail",
      "employeeId",
      "designation",
      "department",
      "reportingManager",
      "dateOfJoining",
      "employmentType",
      "workLocation",
      "panNumber",
      "aadhaarNumber",
      "bankAccountNumber",
      "bankName",
      "ifscCode",
      "accountHolderName",
      "emergencyContactName",
      "emergencyContactRelation",
      "emergencyContactPhone",
    ];

    const filledFields = mandatoryFields.filter(
      (field) => formData[field as keyof FormData]
    ).length;

    return Math.round((filledFields / mandatoryFields.length) * 100);
  }, [formData]);

  const handleSubmit = async () => {
    if (completionPercentage < 100) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    if (!formData.signature) {
      toast.error("Please provide your signature");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitMutation.mutateAsync({
        ...formData,
        dependents: formData.dependents ? parseInt(formData.dependents) : 0,
      });
      toast.success(`Joining kit submitted successfully! Reference: ${result.reference}`);
      setFormData(initialFormData);
      setCurrentStep(0);
    } catch (error) {
      toast.error("Failed to submit joining kit");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">ImpactGuru Joining Kit</h1>
              <p className="text-sm text-slate-600">Complete your onboarding in 6 easy steps</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/hr-dashboard'}
                className="text-sm"
              >
                HR Dashboard
              </Button>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
                <p className="text-xs text-slate-600">Complete</p>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>

      {/* Top Navigation Pills */}
      <div className="bg-white border-b border-slate-200 sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => goToStep(idx)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  idx === currentStep
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span className="mr-2">{step.icon}</span>
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <Card className="sticky top-[160px]">
              <CardHeader>
                <CardTitle className="text-lg">Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {STEPS.map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => goToStep(idx)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        idx === currentStep
                          ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="mr-2">{step.icon}</span>
                      {step.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Form Content */}
          <main className="lg:col-span-3">
            {/* Personal & Contact Step */}
            {currentStep === 0 && (
              <div className="animate-in fade-in duration-300">
                <PersonalStep formData={formData} handleInputChange={handleInputChange} handleCurrentAddressChange={handleCurrentAddressChange} />
              </div>
            )}

            {/* Employment Step */}
            {currentStep === 1 && (
              <div className="animate-in fade-in duration-300">
                <EmploymentStep formData={formData} handleInputChange={handleInputChange} />
              </div>
            )}

            {/* KYC & Bank Step */}
            {currentStep === 2 && (
              <div className="animate-in fade-in duration-300">
                <KYCStep formData={formData} handleInputChange={handleInputChange} />
              </div>
            )}

            {/* Family & PF Step */}
            {currentStep === 3 && (
              <div className="animate-in fade-in duration-300">
                <FamilyStep formData={formData} handleInputChange={handleInputChange} />
              </div>
            )}

            {/* Signature Step */}
            {currentStep === 4 && (
              <div className="animate-in fade-in duration-300">
                <SignatureStep formData={formData} handleInputChange={handleInputChange} />
              </div>
            )}

            {/* Review Step */}
            {currentStep === 5 && (
              <div className="animate-in fade-in duration-300">
                <ReviewStep formData={formData} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={goToPrevStep}
                disabled={currentStep === 0}
              >
                ← Previous
              </Button>
              {currentStep === STEPS.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || completionPercentage < 100}
                  className="ml-auto"
                >
                  {isSubmitting ? "Submitting..." : "Submit Joining Kit"}
                </Button>
              ) : (
                <Button onClick={goToNextStep} className="ml-auto">
                  Next →
                </Button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Step Components
function PersonalStep({
  formData,
  handleInputChange,
  handleCurrentAddressChange,
}: {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleCurrentAddressChange: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Identity</CardTitle>
          <CardDescription>As per Aadhaar card</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name (as per Aadhaar) *"
              value={formData.fullName}
              onChange={(v) => handleInputChange("fullName", v)}
              placeholder="e.g. Priya Sharma"
            />
            <FormField
              label="Father's Full Name *"
              value={formData.fathersName}
              onChange={(v) => handleInputChange("fathersName", v)}
              placeholder="e.g. Ramesh Sharma"
            />
            <FormField
              label="Mother's Full Name"
              value={formData.mothersName}
              onChange={(v) => handleInputChange("mothersName", v)}
              placeholder="e.g. Sunita Sharma"
            />
            <FormField
              label="Spouse's Name (if married)"
              value={formData.spouseName}
              onChange={(v) => handleInputChange("spouseName", v)}
              placeholder="Leave blank if not applicable"
            />
            <FormField
              label="Date of Birth * (DD/MM/YYYY)"
              value={formData.dateOfBirth}
              onChange={(v) => handleInputChange("dateOfBirth", v)}
              placeholder="15/08/1996"
            />
            <FormSelect
              label="Gender *"
              value={formData.gender}
              onChange={(v) => handleInputChange("gender", v)}
              options={["Male", "Female", "Transgender"]}
            />
            <FormSelect
              label="Marital Status *"
              value={formData.maritalStatus}
              onChange={(v) => handleInputChange("maritalStatus", v)}
              options={["Single", "Married", "Widow", "Widower", "Divorcee"]}
            />
            <FormField
              label="Nationality"
              value={formData.nationality}
              onChange={(v) => handleInputChange("nationality", v)}
              placeholder="Indian"
            />
            <FormSelect
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(v) => handleInputChange("bloodGroup", v)}
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            />
            <FormField
              label="Religion (Gratuity Form F)"
              value={formData.religion}
              onChange={(v) => handleInputChange("religion", v)}
              placeholder="e.g. Hindu"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Details</CardTitle>
          <CardDescription>Joining Form · Background Check · PF Form · ESIC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FormField
              label="Correspondence / Current Address *"
              value={formData.currentAddress}
              onChange={handleCurrentAddressChange}
              placeholder="Flat/House No, Building, Street, Area, City, State — Pincode"
              isTextarea
            />
            <FormField
              label="Landmark (current)"
              value={formData.currentLandmark}
              onChange={(v) => handleInputChange("currentLandmark", v)}
              placeholder="Near..."
            />
            <FormField
              label="Permanent Address (leave blank if same as above)"
              value={formData.permanentAddress}
              onChange={(v) => handleInputChange("permanentAddress", v)}
              placeholder="Will auto-copy from above if left blank"
              isTextarea
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Village / Town (for Gratuity Form)"
                value={formData.village}
                onChange={(v) => handleInputChange("village", v)}
                placeholder="e.g. Jaipur"
              />
              <FormField
                label="State (for Gratuity Form)"
                value={formData.state}
                onChange={(v) => handleInputChange("state", v)}
                placeholder="e.g. Rajasthan"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>POSH · ESIC · PF Form 11</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Mobile Number * (Aadhaar linked)"
              value={formData.mobileNumber}
              onChange={(v) => handleInputChange("mobileNumber", v)}
              placeholder="+91 98765 43210"
            />
            <FormField
              label="Landline (optional)"
              value={formData.landline}
              onChange={(v) => handleInputChange("landline", v)}
              placeholder="Optional"
            />
            <FormField
              label="Personal Email ID *"
              type="email"
              value={formData.personalEmail}
              onChange={(v) => handleInputChange("personalEmail", v)}
              placeholder="name@gmail.com"
            />
            <FormField
              label="City of Signing"
              value={formData.placeOfSigning}
              onChange={(v) => handleInputChange("placeOfSigning", v)}
              placeholder="e.g. Mumbai"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmploymentStep({
  formData,
  handleInputChange,
}: {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Details</CardTitle>
        <CardDescription>Your role and position at ImpactGuru</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Employee ID *"
            value={formData.employeeId}
            onChange={(v) => handleInputChange("employeeId", v)}
            placeholder="e.g. EMP001"
          />
          <FormField
            label="Designation *"
            value={formData.designation}
            onChange={(v) => handleInputChange("designation", v)}
            placeholder="e.g. Software Engineer"
          />
          <FormField
            label="Department *"
            value={formData.department}
            onChange={(v) => handleInputChange("department", v)}
            placeholder="e.g. Engineering"
          />
          <FormField
            label="Reporting Manager *"
            value={formData.reportingManager}
            onChange={(v) => handleInputChange("reportingManager", v)}
            placeholder="e.g. John Doe"
          />
          <FormField
            label="Date of Joining * (DD/MM/YYYY)"
            value={formData.dateOfJoining}
            onChange={(v) => handleInputChange("dateOfJoining", v)}
            placeholder="01/06/2024"
          />
          <FormSelect
            label="Employment Type *"
            value={formData.employmentType}
            onChange={(v) => handleInputChange("employmentType", v)}
            options={["Full-time", "Part-time", "Contract", "Intern"]}
          />
          <FormField
            label="Work Location *"
            value={formData.workLocation}
            onChange={(v) => handleInputChange("workLocation", v)}
            placeholder="e.g. Bangalore"
          />
          <FormField
            label="CTC"
            value={formData.ctc}
            onChange={(v) => handleInputChange("ctc", v)}
            placeholder="e.g. 12,00,000"
          />
          <FormField
            label="Office Email"
            type="email"
            value={formData.officeEmail}
            onChange={(v) => handleInputChange("officeEmail", v)}
            placeholder="name@impactguru.com"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function KYCStep({
  formData,
  handleInputChange,
}: {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC & Bank Details</CardTitle>
        <CardDescription>Tax and banking information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="PAN Number *"
            value={formData.panNumber}
            onChange={(v) => handleInputChange("panNumber", v)}
            placeholder="e.g. ABCDE1234F"
          />
          <FormField
            label="Aadhaar Number *"
            value={formData.aadhaarNumber}
            onChange={(v) => handleInputChange("aadhaarNumber", v)}
            placeholder="e.g. 1234 5678 9012"
          />
          <FormField
            label="Bank Account Number *"
            value={formData.bankAccountNumber}
            onChange={(v) => handleInputChange("bankAccountNumber", v)}
            placeholder="e.g. 12345678901234"
          />
          <FormField
            label="Bank Name *"
            value={formData.bankName}
            onChange={(v) => handleInputChange("bankName", v)}
            placeholder="e.g. HDFC Bank"
          />
          <FormField
            label="IFSC Code *"
            value={formData.ifscCode}
            onChange={(v) => handleInputChange("ifscCode", v)}
            placeholder="e.g. HDFC0001234"
          />
          <FormField
            label="Account Holder Name *"
            value={formData.accountHolderName}
            onChange={(v) => handleInputChange("accountHolderName", v)}
            placeholder="e.g. Priya Sharma"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function FamilyStep({
  formData,
  handleInputChange,
}: {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>In case of emergency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Emergency Contact Name *"
              value={formData.emergencyContactName}
              onChange={(v) => handleInputChange("emergencyContactName", v)}
              placeholder="e.g. Ramesh Sharma"
            />
            <FormField
              label="Relation *"
              value={formData.emergencyContactRelation}
              onChange={(v) => handleInputChange("emergencyContactRelation", v)}
              placeholder="e.g. Father"
            />
            <FormField
              label="Phone Number *"
              value={formData.emergencyContactPhone}
              onChange={(v) => handleInputChange("emergencyContactPhone", v)}
              placeholder="+91 98765 43210"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provident Fund & Insurance</CardTitle>
          <CardDescription>PF and ESIC details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="PF Number"
              value={formData.pfNumber}
              onChange={(v) => handleInputChange("pfNumber", v)}
              placeholder="e.g. DL/123456/12345"
            />
            <FormField
              label="ESI Number"
              value={formData.esiNumber}
              onChange={(v) => handleInputChange("esiNumber", v)}
              placeholder="e.g. 1234567890123456"
            />
            <FormField
              label="Number of Dependents"
              type="number"
              value={formData.dependents}
              onChange={(v) => handleInputChange("dependents", v)}
              placeholder="e.g. 2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Family Information</CardTitle>
          <CardDescription>Additional family details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Spouse Occupation"
              value=""
              onChange={() => {}}
              placeholder="e.g. Software Engineer"
            />
            <FormField
              label="Children Count"
              type="number"
              value=""
              onChange={() => {}}
              placeholder="e.g. 2"
            />
            <FormField
              label="Father Occupation"
              value=""
              onChange={() => {}}
              placeholder="e.g. Retired"
            />
            <FormField
              label="Mother Occupation"
              value=""
              onChange={() => {}}
              placeholder="e.g. Homemaker"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SignatureStep({
  formData,
  handleInputChange,
}: {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Digital Signature</CardTitle>
        <CardDescription>Sign below to confirm your details</CardDescription>
      </CardHeader>
      <CardContent>
        <SignaturePad
          signature={formData.signature}
          onSignatureChange={(sig: string) => handleInputChange("signature", sig)}
        />
      </CardContent>
    </Card>
  );
}

// Form Field Components
function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  isTextarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  isTextarea?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {isTextarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="resize-none"
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
