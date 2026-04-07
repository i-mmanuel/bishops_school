interface Props { teacherName: string; courseName: string; onSubmitAnother: () => void }

export default function SuccessScreen({ teacherName, courseName, onSubmitAnother }: Props) {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#69f6b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className="text-2xl font-headline font-bold text-on-surface mb-2">Session Submitted</h1>
      <p className="text-sm font-label text-on-surface-variant max-w-xs mb-1">Attendance for <span className="text-on-surface font-semibold">{courseName}</span> has been recorded.</p>
      <p className="text-xs font-label text-on-surface-variant mb-8">Submitted by {teacherName}</p>
      <button onClick={onSubmitAnother}
        className="px-8 py-3 rounded-xl font-label font-semibold text-sm text-on-primary bg-gradient-to-br from-primary to-primary-container hover:opacity-90 active:scale-[0.98] transition-all duration-200">
        Submit Another Session
      </button>
    </div>
  )
}
