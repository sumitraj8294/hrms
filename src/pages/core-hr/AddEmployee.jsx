import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, User, Briefcase, Building2, FileText, Check } from 'lucide-react'
import { employeeService, departmentService, designationService } from '@/services/employeeService'
import toast from 'react-hot-toast'

const STEPS = [
  { id:1, label:'Personal Info', icon: User      },
  { id:2, label:'Employment',    icon: Briefcase  },
  { id:3, label:'Organisation',  icon: Building2  },
  { id:4, label:'Documents',     icon: FileText   },
]

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done   = current > s.id
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

// Controlled field
function Field({ label, name, type='text', placeholder, required, half, value, onChange }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-600 text-text-primary mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
    </div>
  )
}

function SelectField({ label, name, options=[], required, half, value, onChange, valueKey='_id', labelKey='name' }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-600 text-text-primary mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white text-text-secondary"
      >
        <option value="">Select {label}</option>
        {options.map(o => (
          typeof o === 'string'
            ? <option key={o} value={o}>{o}</option>
            : <option key={o[valueKey]} value={o[valueKey]}>{o[labelKey]}</option>
        ))}
      </select>
    </div>
  )
}

export default function AddEmployee() {
  const navigate  = useNavigate()
  const [step, setStep]         = useState(1)
  const [loading, setLoading]   = useState(false)
  const [departments, setDepts] = useState([])
  const [designations, setDesigs] = useState([])
  const [filteredDesigs, setFilteredDesigs] = useState([])

  // Unified form state across all steps
  const [form, setForm] = useState({
    // Step 1
    firstName:'', lastName:'', email:'', phone:'', dob:'', gender:'',
    personalEmail:'', emergencyContactName:'', emergencyContactPhone:'', bloodGroup:'', address:'',
    // Step 2
    employeeId:'', joiningDate:'', employmentType:'', workLocation:'', officialEmail:'',
    probationEndDate:'', grade:'', band:'', accountNumber:'', ifsc:'', pan:'', aadhar:'',
    // Step 3
    department:'', designation:'', businessUnit:'', branch:'', reportingTo:'', costCenter:'', shift:'', leavePolicy:'',
  })

  const [employees, setEmployees] = useState([]) // for reporting manager dropdown

  useEffect(() => {
    departmentService.getAll().then(res => setDepts(res.data || [])).catch(() => {})
    designationService.getAll().then(res => setDesigs(res.data || [])).catch(() => {})
    employeeService.getAll({ limit:100 }).then(res => setEmployees(res.data?.employees || [])).catch(() => {})
  }, [])

  // Filter designations when department changes
  useEffect(() => {
    if (form.department) {
      setFilteredDesigs(designations.filter(d => d.department?._id === form.department || d.department === form.department))
    } else {
      setFilteredDesigs(designations)
    }
  }, [form.department, designations])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validateStep = () => {
    if (step === 1) {
      if (!form.firstName.trim()) return toast.error('First name is required')
      if (!form.lastName.trim())  return toast.error('Last name is required')
      if (!form.email.trim())     return toast.error('Email is required')
      return true
    }
    if (step === 2) {
      if (!form.employeeId.trim()) return toast.error('Employee ID is required')
      if (!form.joiningDate)       return toast.error('Joining date is required')
      return true
    }
    if (step === 3) {
      if (!form.department)   return toast.error('Department is required')
      if (!form.designation)  return toast.error('Designation is required')
      return true
    }
    return true
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        firstName:      form.firstName,
        lastName:       form.lastName,
        email:          form.email,
        phone:          form.phone,
        dob:            form.dob || undefined,
        gender:         form.gender || undefined,
        employeeId:     form.employeeId,
        joiningDate:    form.joiningDate || undefined,
        employmentType: form.employmentType || 'Full-Time',
        location:       form.workLocation || undefined,
        probationEndDate: form.probationEndDate || undefined,
        grade:          form.grade || undefined,
        band:           form.band || undefined,
        department:     form.department || undefined,
        designation:    form.designation || undefined,
        reportingTo:    form.reportingTo || undefined,
        address: form.address ? { street: form.address } : undefined,
        emergencyContact: form.emergencyContactName ? {
          name:  form.emergencyContactName,
          phone: form.emergencyContactPhone,
        } : undefined,
        bankDetails: form.accountNumber ? {
          accountNo: form.accountNumber,
          ifsc:      form.ifsc,
        } : undefined,
      }

      await employeeService.create(payload)
      toast.success('Employee created successfully!')
      navigate('/core-hr')
    } catch (err) {
      toast.error(err?.message || 'Failed to create employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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

            {/* Step 1 — Personal Info */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name"   name="firstName"   required half placeholder="e.g. Priya"    value={form.firstName}   onChange={handleChange}/>
                <Field label="Last Name"    name="lastName"    required half placeholder="e.g. Sharma"   value={form.lastName}    onChange={handleChange}/>
                <Field label="Email Address" name="email"      required      placeholder="priya@company.com" value={form.email}    onChange={handleChange}/>
                <Field label="Phone Number" name="phone"       required half placeholder="10-digit number" value={form.phone}      onChange={handleChange}/>
                <Field label="Date of Birth" name="dob"        type="date"   half value={form.dob}        onChange={handleChange}/>
                <SelectField label="Gender" name="gender"      half options={['Male','Female','Other','Prefer not to say']} value={form.gender} onChange={handleChange}/>
                <Field label="Personal Email" name="personalEmail" half placeholder="personal@gmail.com" value={form.personalEmail} onChange={handleChange}/>
                <Field label="Emergency Contact Name"  name="emergencyContactName"  half placeholder="Full name"       value={form.emergencyContactName}  onChange={handleChange}/>
                <Field label="Emergency Contact Phone" name="emergencyContactPhone" half placeholder="10-digit number" value={form.emergencyContactPhone} onChange={handleChange}/>
                <SelectField label="Blood Group" name="bloodGroup" half options={['A+','A-','B+','B-','AB+','AB-','O+','O-']} value={form.bloodGroup} onChange={handleChange}/>
                <div className="col-span-2">
                  <label className="block text-xs font-600 text-text-primary mb-1.5">Current Address</label>
                  <textarea name="address" rows={2} placeholder="Full address…" value={form.address} onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"/>
                </div>
              </div>
            )}

            {/* Step 2 — Employment */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Employee ID"       name="employeeId"    required half placeholder="e.g. EMP009" value={form.employeeId}    onChange={handleChange}/>
                <Field label="Date of Joining"   name="joiningDate"   type="date" required half value={form.joiningDate}   onChange={handleChange}/>
                <SelectField label="Employment Type" name="employmentType" required half options={['Full-Time','Part-Time','Contract','Intern']} value={form.employmentType} onChange={handleChange}/>
                <SelectField label="Work Location"   name="workLocation"  required half options={['Bangalore','Mumbai','Delhi','Pune','Hyderabad','Chennai','Remote']} value={form.workLocation} onChange={handleChange}/>
                <Field label="Official Email"     name="officialEmail" required      placeholder="emp@company.com" value={form.officialEmail} onChange={handleChange}/>
                <Field label="Probation End Date" name="probationEndDate" type="date" half value={form.probationEndDate} onChange={handleChange}/>
                <SelectField label="Grade" name="grade" half options={['L1','L2','L3','L4','L5','M1','M2','Director','VP']} value={form.grade} onChange={handleChange}/>
                <SelectField label="Band"  name="band"  half options={['Junior','Senior','Lead','Manager','Senior Manager','Director']} value={form.band} onChange={handleChange}/>
                <Field label="Account Number" name="accountNumber" half placeholder="Bank account number" value={form.accountNumber} onChange={handleChange}/>
                <Field label="IFSC Code"      name="ifsc"          half placeholder="e.g. HDFC0001234"   value={form.ifsc}          onChange={handleChange}/>
                <Field label="PAN Number"     name="pan"           half placeholder="ABCDE1234F"         value={form.pan}           onChange={handleChange}/>
                <Field label="Aadhar Number"  name="aadhar"        half placeholder="12-digit Aadhar"   value={form.aadhar}        onChange={handleChange}/>
              </div>
            )}

            {/* Step 3 — Organisation */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Department" name="department" required half
                  options={departments} valueKey="_id" labelKey="name"
                  value={form.department} onChange={handleChange}
                />
                <SelectField
                  label="Designation" name="designation" required half
                  options={filteredDesigs.length ? filteredDesigs : designations}
                  valueKey="_id" labelKey="name"
                  value={form.designation} onChange={handleChange}
                />
                <SelectField label="Business Unit" name="businessUnit" half options={['Product','Platform','Revenue','Corporate']} value={form.businessUnit} onChange={handleChange}/>
                <SelectField label="Branch / Location" name="branch" half options={['HQ - Bangalore','Mumbai Office','Delhi Office','Remote']} value={form.branch} onChange={handleChange}/>
                <SelectField
                  label="Reporting Manager" name="reportingTo" required half
                  options={employees.map(e => ({ _id: e._id, name: `${e.firstName} ${e.lastName}` }))}
                  valueKey="_id" labelKey="name"
                  value={form.reportingTo} onChange={handleChange}
                />
                <SelectField label="Cost Center" name="costCenter" half options={departments.map(d => d.costCenter || d.code).filter(Boolean)} value={form.costCenter} onChange={handleChange}/>
                <SelectField label="Shift Policy"  name="shift"        half options={['General Shift (9-6)','Morning Shift (7-4)','Evening Shift (2-11)','Night Shift (10-7)']} value={form.shift}       onChange={handleChange}/>
                <SelectField label="Leave Policy"  name="leavePolicy"  half options={['Standard Policy','Contract Policy','Intern Policy']} value={form.leavePolicy} onChange={handleChange}/>
              </div>
            )}

            {/* Step 4 — Documents */}
            {step === 4 && (
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
            )}

          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/core-hr')}
              className="px-4 py-2 border border-border rounded-md text-sm font-600 text-text-secondary hover:bg-slate-50 transition-colors"
            >
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            {step < STEPS.length ? (
              <button onClick={next}
                className="px-5 py-2 bg-primary text-white rounded-md text-sm font-600 hover:bg-primary-dark transition-colors">
                Continue →
              </button>
            ) : (
              <button onClick={handleSave} disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 text-white rounded-md text-sm font-600 hover:bg-emerald-600 transition-colors disabled:opacity-60">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  : <Check size={15}/>
                }
                {loading ? 'Saving…' : 'Save Employee'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}