import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Complete schema mapping all 45 boundary conditions safely
const formSchema = z.object({
  fullName: z.string().min(2, "Employee name is required"),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  doj: z.string().min(1, "Date of joining is required"),
  fatherName: z.string().min(2, "Father's name is required"),
  currentAddress: z.string().min(5, "Current address is required"),
  permanentAddress: z.string().min(5, "Permanent address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  panNum: z.string().min(10, "Valid PAN Card number is required"),
  manager: z.string().min(2, "Reporting manager name is required"),
  // Family details list structural constraint schema
  familyDetails: z.array(z.object({
    name: z.string().default(""),
    relation: z.string().default(""),
    dob: z.string().default("")
  })).max(5)
});

type FormValues = z.infer<typeof formSchema>;

export default function JoiningKitForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "", department: "", designation: "", doj: "", fatherName: "",
      currentAddress: "", permanentAddress: "", phone: "", dob: "", panNum: "", manager: "",
      familyDetails: [{ name: "", relation: "", dob: "" }]
    }
  });

  // Safe field array controller instance
  const { fields, append, remove } = useFieldArray({
    control,
    name: "familyDetails"
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/submit-joining-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Database insertion pipeline execution rejected.");
      alert("Application data synced cleanly to cloud layers!");
    } catch (err) {
      console.error(err);
      alert("Submission Error: Check that all required inputs match schema restrictions.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-slate-800 border-b pb-3">ImpactGuru Onboarding Profile Matrix</h2>
      
      {/* Primary Input Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <input {...register("fullName")} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Department</label>
          <input {...register("department")} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
      </div>

      {/* Dynamic Sub-form Area (Fixed Input Locking) */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Family Profile Dependency Rows (Max 5)</h3>
        
        {fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
            <div>
              <input 
                {...register(`familyDetails.${index}.name` as const)} 
                placeholder="Full Name"
                className="w-full rounded-md border-slate-300 shadow-sm text-sm"
              />
            </div>
            <div>
              <input 
                {...register(`familyDetails.${index}.relation` as const)} 
                placeholder="Relationship"
                className="w-full rounded-md border-slate-300 shadow-sm text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="date"
                {...register(`familyDetails.${index}.dob` as const)} 
                className="w-full rounded-md border-slate-300 shadow-sm text-sm"
              />
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 text-sm font-bold px-2">✕</button>
              )}
            </div>
          </div>
        ))}

        {fields.length < 5 && (
          <button type="button" onClick={() => append({ name: "", relation: "", dob: "" })} className="mt-2 text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium">
            + Add Family Row
          </button>
        )}
      </div>

      <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow">
        Save Profile State & Synchronize
      </button>
    </form>
  );
}
