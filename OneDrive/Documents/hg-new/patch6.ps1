$f = 'C:\Users\varun\OneDrive\Documents\hg-new\hg-app\src\app\[role]\dashboard\search\page.tsx'
$lines = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)

# Replace lines 255-338 (hero + grid) with uniform grid for ALL teachers
$before = $lines[0..254]
$after  = $lines[339..($lines.Length-1)]

$newSection = @'
              {/* UNIFORM GRID — all teachers same card, info always visible */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[1px] bg-outline-variant overflow-hidden rounded-[28px]">
                {filtered.map((teacher) => {
                  const avail = getAvailability(teacher.availability);
                  const badge = getBadge(teacher.badge);
                  const subCfg = SUBJECT_CONFIG[teacher.subjects[0]];
                  return (
                    <div
                      key={teacher.id}
                      onClick={() => router.push(`/teachers/${teacher.id}`)}
                      className="cursor-pointer group flex flex-col overflow-hidden"
                      style={{ background: "var(--surface)" }}
                    >
                      {/* Photo */}
                      <div className="relative overflow-hidden" style={{ height: 180, background: subCfg?.bg ?? "var(--surface-container)" }}>
                        <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium" style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: avail.color }} />
                            {avail.label}
                          </span>
                          {badge && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium" style={{ background: badge.bg, color: badge.fg }}>{badge.label}</span>}
                        </div>
                      </div>
                      {/* Info — always visible */}
                      <div className="flex flex-col gap-1.5 px-3 py-3 border-t border-outline-variant flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-medium text-on-surface leading-tight">{teacher.name}</p>
                          <p className="text-[13px] font-normal text-on-surface shrink-0">{"₹"}{teacher.price}<span className="text-[10px] text-on-surface-variant">/hr</span></p>
                        </div>
                        <p className="text-[11px] font-normal text-on-surface-variant">{teacher.experience} &middot; {teacher.students} students</p>
                        <div className="flex items-center gap-1">
                          <StarRow rating={teacher.rating} />
                          <span className="text-[10px] font-normal text-on-surface-variant">{teacher.rating} ({teacher.reviews})</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {teacher.subjects.slice(0, 2).map(s => {
                            const cfg = SUBJECT_CONFIG[s];
                            return <span key={s} className="px-2 py-0.5 rounded-full text-[9px] font-medium" style={{ background: cfg?.bg ?? "var(--surface-container)", color: cfg?.fg ?? "var(--on-surface-variant)" }}>{s}</span>;
                          })}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="mt-1 px-3 py-1.5 rounded-full text-[11px] font-medium border-none cursor-pointer hover:opacity-90 transition-all self-start"
                          style={{ background: "var(--primary-container)", color: "var(--on-primary-container)" }}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
'@

$newLines = $newSection -split "`n"
$combined = $before + $newLines + $after
[System.IO.File]::WriteAllLines($f, $combined, [System.Text.Encoding]::UTF8)
Write-Output "done"
