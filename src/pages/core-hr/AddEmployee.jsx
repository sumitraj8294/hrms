import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, User, Briefcase, Building2, FileText, Check } from 'lucide-react'

const STEPS = [
  { id:1, label:'Personal Info',   icon: User       },
  { id:2, label:'Employment',      icon: Briefcase  },
  { id:3, label:'Organisation',    icon: Building2  },
  { id:4, label:'Documents',       icon: FileText   },
]

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done = current > s.id
        const active = current === s.id
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${active ? 'bg-primary text-white' : done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-text-muted'}`}>
              {done ? <Check size={14}/> : <Icon size={14}/>}
              <span className="text-xs font-600 hidden sm:block">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-border mx-1"/>}
          </div>
        )
      })}
    </div>
  )
}

function Field({ label, type='text', placeholder, required, children, half }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-600 text-text-primary mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children || (
        <input type={type} placeholder={placeholder}
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"/>
      )}
    </div>
  )
}

function Select({ label, options, required, half }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-600 text-text-primary mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white text-text-secondary">
        <option value="">Select {label}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

const STEP_CONTENT = {
  1: () => (
    <div className="grid grid-cols-2 gap-4">
      <Field label="First Name"   required half placeholder="e.g. Priya"/>
      <Field label="Last Name"    required half placeholder="e.g. Sharma"/>
      <Field label="Email Address" required placeholder="priya@company.com"/>
      <Field label="Phone Number" required half placeholder="10-digit mobile number"/>
      <Field label="Date of Birth" type="date" required half/>
      <Select label="Gender" options={['Male','Female','Other','Prefer not to say']} half/>
      <Field label="Personal Email" half placeholder="personal@gmail.com"/>
      <Field label="Emergency Contact Name" half placeholder="Full name"/>
      <Field label="Emergency Contact Phone" half placeholder="10-digit number"/>
      <Select label="Blood Group" options={['A+','A-','B+','B-','AB+','AB-','O+','O-']} half/>
      <div className="col-span-2">
        <label className="block text-xs font-600 text-text-primary mb-1.5">Current Address</label>
        <textarea rows={2} placeholder="Full address…"
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"/>
      </div>
    </div>
  ),
  2: () => (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Employee ID" required half placeholder="e.g. EMP009"/>
      <Field label="Date of Joining" type="date" required half/>
      <Select label="Employment Type" required options={['Full-Time','Part-Time','Contract','Intern']} half/>
      <Select label="Work Location" required options={['Bangalore','Mumbai','Delhi','Pune','Hyderabad','Chennai','Remote']} half/>
      <Field label="Official Email" required placeholder="emp@company.com"/>
      <Field label="Probation End Date" type="date" half/>
      <Select label="Grade" options={['L1','L2','L3','L4','L5','M1','M2','Director','VP']} half/>
      <Select label="Band" options={['Junior','Senior','Lead','Manager','Senior Manager','Director']} half/>
      <Field label="Account Number" half placeholder="Bank account number"/>
      <Field label="IFSC Code" half placeholder="e.g. HDFC0001234"/>
      <Field label="PAN Number" half placeholder="ABCDE1234F"/>
      <Field label="Aadhar Number" half placeholder="12-digit Aadhar"/>
    </div>
  ),
  3: () => (
    <div className="grid grid-cols-2 gap-4">
      <Select label="Department" required options={['Engineering','Sales','HR','Finance','Operations','Marketing','Design','Legal']} half/>
      <Select label="Designation" required options={['Junior Developer','Senior Developer','Tech Lead','Manager','Director','VP','Analyst','Executive']} half/>
      <Select label="Business Unit" options={['Product','Platform','Revenue','Corporate']} half/>
      <Select label="Branch / Location" options={['HQ - Bangalore','Mumbai Office','Delhi Office','Remote']} half/>
      <Select label="Reporting Manager" options={['Raj Mehta','Neha Kapoor','Arjun Singh','Kavya Nair']} required half/>
      <Select label="Cost Center" options={['CC-ENG-01','CC-SALES-01','CC-HR-01','CC-FIN-01','CC-OPS-01']} half/>
      <Select label="Shift Policy" options={['General Shift (9-6)','Morning Shift (7-4)','Evening Shift (2-11)','Night Shift (10-7)']} half/>
      <Select label="Leave Policy" options={['Standard Policy','Contract Policy','Intern Policy']} half/>
    </div>
  ),
  4: () => (
    <div className="space-y-3">
      {['Offer Letter','ID Proof','Education Certificates','Previous Experience Letters','Photo'].map(doc => (
        <div key={doc} className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3">
            <FileText size={16} className="text-text-muted"/>
            <div>
              <p className="text-sm font-600 text-text-primary">{doc}</p>
              <p className="text-[10px] text-text-muted">PDF, JPG, PNG · Max 5MB</p>
            </div>
          </div>
          <label className="px-3 py-1.5 border border-primary text-primary text-xs font-600 rounded-md cursor-pointer hover:bg-primary/5 transition-colors">
            Upload
            <input type="file" className="hidden"/>
          </label>
        </div>
      ))}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
        <strong>Note:</strong> Documents can also be uploaded later from the employee's profile page.
      </div>
    </div>
  ),
}

export default function AddEmployee() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const StepForm = STEP_CONTENT[step]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-border bg-white">
        <button onClick={() => navigate('/core-hr')} className="text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={18}/>
        </button>
        <div>
          <h2 className="font-700 text-text-primary">Add New Employee</h2>
          <p className="text-xs text-text-muted">Step {step} of {STEPS.length} — {STEPS[step-1].label}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-2xl mx-auto">
          <StepIndicator current={step}/>
          <div className="bg-white border border-border rounded-lg p-5">
            <StepForm/>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button onClick={() => step > 1 ? setStep(s => s-1) : navigate('/core-hr')}
              className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50 transition-colors">
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            <div className="flex items-center gap-2">
              {step < STEPS.length ? (
                <button onClick={() => setStep(s => s+1)}
                  className="px-5 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark transition-colors">
                  Continue →
                </button>
              ) : (
                <button onClick={() => navigate('/core-hr')}
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 text-white rounded-md text-sm font-600 hover:bg-emerald-600 transition-colors">
                  <Check size={15}/> Save Employee
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}