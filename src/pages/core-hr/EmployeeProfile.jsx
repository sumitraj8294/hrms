import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, Mail, Phone, MapPin, Calendar, Briefcase, Building2, FileText, TrendingUp, Award } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { employeeService, documentService } from '@/services/employeeService'
import { formatDate } from '@/utils/formatDate'

const TABS = ['Overview','Timeline','Documents','Payroll','Leave','Performance']

const STATUS_BADGE = {
  active:   { label:'Active',    variant:'green'  },
  on_leave: { label:'On Leave',  variant:'yellow' },
  probation:{ label:'Probation', variant:'purple' },
  inactive: { label:'Inactive',  variant:'gray'   },
}

const EVENT_COLORS = {
  join:      'bg-emerald-500',
  promotion: 'bg-violet-500',
  transfer:  'bg-blue-500',
  revision:  'bg-amber-500',
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-text-muted"/>
      </div>
      <div>
        <p className="text-[10px] text-text-muted">{label}</p>
        <p className="text-xs font-600 text-text-primary">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function EmployeeProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab]       = useState('Overview')
  const [emp, setEmp]       = useState(null)
  const [docs, setDocs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [docsLoading, setDocsLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    employeeService.getById(id)
      .then(res => setEmp(res.data))
      .catch(() => navigate('/core-hr'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (tab !== 'Documents' || !id) return
    setDocsLoading(true)
    documentService.getAll({ employee: id })
      .then(res => setDocs(res.data?.docs || []))
      .catch(() => {})
      .finally(() => setDocsLoading(false))
  }, [tab, id])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Spinner size="lg"/>
    </div>
  )

  if (!emp) return null

  const fullName   = `${emp.firstName} ${emp.lastName}`
  const statusInfo = STATUS_BADGE[emp.status] || { label: emp.status, variant:'gray' }

  // compute tenure
  const tenure = (() => {
    if (!emp.joiningDate) return '—'
    const ms    = Date.now() - new Date(emp.joiningDate)
    const years = Math.floor(ms / (1000*60*60*24*365))
    const months= Math.floor((ms % (1000*60*60*24*365)) / (1000*60*60*24*30))
    return years > 0 ? `${years} yr${years>1?'s':''} ${months} mo` : `${months} months`
  })()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-border bg-white">
        <button onClick={() => navigate('/core-hr')} className="text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={18}/>
        </button>
        <div className="flex items-center gap-3 flex-1">
          <Avatar name={fullName} src={emp.avatar} size="md"/>
          <div>
            <h2 className="font-700 text-text-primary">{fullName}</h2>
            <p className="text-xs text-text-muted">
              {emp.employeeId}
              {emp.designation?.name && ` · ${emp.designation.name}`}
              {emp.department?.name  && ` · ${emp.department.name}`}
            </p>
          </div>
          <Badge variant={statusInfo.variant} className="ml-2">{statusInfo.label}</Badge>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-600 text-text-secondary hover:bg-slate-50 transition-colors">
          <Edit2 size={13}/> Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-white px-5">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`py-2.5 px-3 text-xs font-600 border-b-2 transition-colors whitespace-nowrap
              ${tab===t ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">

        {/* Overview */}
        {tab === 'Overview' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Personal */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-3">Personal Information</p>
              <div className="space-y-3">
                <InfoRow icon={Mail}     label="Email"    value={emp.email}/>
                <InfoRow icon={Phone}    label="Phone"    value={emp.phone}/>
                <InfoRow icon={MapPin}   label="Location" value={emp.location}/>
                <InfoRow icon={Calendar} label="DOB"      value={emp.dob ? formatDate(emp.dob) : null}/>
                <InfoRow icon={MapPin}   label="Address"  value={emp.address?.street}/>
              </div>
            </div>

            {/* Employment */}
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-3">Employment Details</p>
              <div className="space-y-3">
                <InfoRow icon={Briefcase}  label="Employment Type" value={emp.employmentType}/>
                <InfoRow icon={Building2}  label="Department"      value={emp.department?.name}/>
                <InfoRow icon={Award}      label="Designation"     value={emp.designation?.name}/>
                <InfoRow icon={Calendar}   label="Joining Date"    value={emp.joiningDate ? formatDate(emp.joiningDate) : null}/>
                <InfoRow icon={TrendingUp} label="Reporting To"    value={emp.reportingTo ? `${emp.reportingTo.firstName} ${emp.reportingTo.lastName}` : null}/>
                <InfoRow icon={FileText}   label="Employee ID"     value={emp.employeeId}/>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white border border-border rounded-lg p-4">
                <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-3">Quick Summary</p>
                <div className="space-y-2">
                  {[
                    { label:'Tenure',       value: tenure },
                    { label:'Grade',        value: emp.grade || '—' },
                    { label:'Band',         value: emp.band  || '—' },
                    { label:'Gender',       value: emp.gender || '—' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between">
                      <span className="text-xs text-text-muted">{r.label}</span>
                      <span className="text-xs font-600 text-text-primary">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank details */}
              {emp.bankDetails?.accountNo && (
                <div className="bg-white border border-border rounded-lg p-4">
                  <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-3">Bank Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-text-muted">Account No.</span>
                      <span className="text-xs font-600 text-text-primary">{'•'.repeat(8) + emp.bankDetails.accountNo.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-text-muted">IFSC</span>
                      <span className="text-xs font-600 text-text-primary">{emp.bankDetails.ifsc || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-text-muted">Bank</span>
                      <span className="text-xs font-600 text-text-primary">{emp.bankDetails.bankName || '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {tab === 'Timeline' && (
          <div className="max-w-xl">
            <p className="text-xs font-700 text-text-muted uppercase tracking-wide mb-4">Employee Lifecycle</p>
            {emp.joiningDate ? (
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border"/>
                {/* Joining event always shown */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"/>
                  <div className="bg-white border border-border rounded-lg p-3">
                    <p className="text-xs font-700 text-text-primary">
                      Joined as {emp.designation?.name || 'Employee'}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">{formatDate(emp.joiningDate)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">No timeline events yet.</p>
            )}
          </div>
        )}

        {/* Documents */}
        {tab === 'Documents' && (
          <div className="max-w-2xl">
            {docsLoading ? (
              <div className="flex justify-center py-10"><Spinner/></div>
            ) : docs.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-text-muted">
                <FileText size={28} className="mb-2 opacity-30"/>
                <p className="text-sm">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="bg-white border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border">
                      {['Document','Uploaded','Status','Action'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-700 text-text-muted uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {docs.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-text-muted"/>
                            <span className="font-600 text-text-primary">{d.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{formatDate(d.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={d.isVerified ? 'green' : 'yellow'}>
                            {d.isVerified ? 'Verified' : 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <a href={d.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-600 text-primary hover:underline">View</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {['Payroll','Leave','Performance'].includes(tab) && (
          <div className="flex items-center justify-center h-48 text-text-muted text-sm">
            {tab} details coming soon…
          </div>
        )}
      </div>
    </div>
  )
}