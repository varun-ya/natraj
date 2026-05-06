$f = 'C:\Users\varun\OneDrive\Documents\hg-new\hg-app\src\app\[role]\dashboard\search\page.tsx'
$lines = [System.IO.File]::ReadAllLines($f)
$before = $lines[0..247]
$after  = $lines[377..($lines.Length-1)]

$newBlock = @'
          {/* RESULTS */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-normal text-on-surface-variant">{filtered.length} tutors found</span>
                <span className="text-[12px] font-normal text-on-surface-variant">Sorted by relevance</span>
              </div>

              {/* FEATURED HERO — M3 rounded card, Instagram photo, X info */}
              {(() => {
                const t = filtered[0];
                const avail = getAvailability(t.availability);
                const badge = getBadge(t.badge);
                const subCfg = SUBJECT_CONFIG[t.subjects[0]];
                return (
                  <div key={t.id} onClick={() => router.push(`/teachers/${t.id}`)} className="rounded-[28px] border-2 border-outline-variant overflow-hidden cursor-pointer group" style={{ background: "var(--surface)" }}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-[260px] shrink-0 overflow-hidden" style={{ minHeight: 240, background: subCfg?.bg ?? "var(--surface-container)" }}>
                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ minHeight: 240 }} />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${subCfg?.bg ?? "var(--surface-container)"} 0%, transparent 50%)`, opacity: 0.8 }} />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: avail.color }} />
                            {avail.label}
                          </span>
                          {badge && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: badge.bg, color: badge.fg }}>{badge.label}</span>}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between p-5 border-t sm:border-t-0 sm:border-l border-outline-variant">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p style={{ fontSize: 18, fontWeight: 400, color: "var(--on-surface)", lineHeight: 1.2 }}>{t.name}</p>
                              <p className="text-[12px] font-normal text-on-surface-variant mt-0.5">{t.experience} · {t.students} students</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p style={{ fontSize: 20, fontWeight: 400, color: "var(--on-surface)" }}>₹{t.price}</p>
                              <p className="text-[11px] font-normal text-on-surface-variant">/hr</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <StarRow rating={t.rating} />
                            <span className="text-[12px] font-normal text-on-surface">{t.rating}</span>
                            <span className="text-[11px] font-normal text-on-surface-variant">({t.reviews})</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {t.subjects.map(s => { const cfg = SUBJECT_CONFIG[s]; return <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: cfg?.bg ?? "var(--surface-container)", color: cfg?.fg ?? "var(--on-surface-variant)" }}>{s}</span>; })}
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); }} className="self-start mt-4 px-5 py-2 rounded-full text-[12px] font-medium border-none cursor-pointer hover:opacity-90 transition-all" style={{ background: "var(--primary-container)", color: "var(--on-primary-container)" }}>Book a session</button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* FUSION GRID — Instagram tiles + X info + M3 tonal color wash */}
              {filtered.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-[1px] bg-outline-variant overflow-hidden rounded-[28px]">
                  {filtered.slice(1).map((teacher) => {
                    const avail = getAvailability(teacher.availability);
                    const badge = getBadge(teacher.badge);
                    const subCfg = SUBJECT_CONFIG[teacher.subjects[0]];
                    return (
                      <div key={teacher.id} onClick={() => router.push(`/teachers/${teacher.id}`)} className="cursor-pointer group flex flex-col overflow-hidden" style={{ background: "var(--surface)" }}>
                        <div className="relative overflow-hidden" style={{ height: 200, background: subCfg?.bg ?? "var(--surface-container)" }}>
                          <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${subCfg?.bg ?? "var(--surface-container)"} 0%, transparent 55%)`, opacity: 0.85 }} />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.45)", color: "#fff" }}>
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: avail.color }} />
                              {avail.label}
                            </span>
                          </div>
                          {badge && <div className="absolute top-2.5 right-2.5"><span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium" style={{ background: badge.bg, color: badge.fg }}>{badge.label}</span></div>}
                          <div className="absolute bottom-2.5 left-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium" style={{ background: subCfg?.bg ?? "var(--surface-container)", color: subCfg?.fg ?? "var(--on-surface-variant)" }}>{teacher.subjects[0]}</span>
                          </div>
                        </div>
                        <div className="px-3 py-2.5 flex flex-col gap-0.5" style={{ background: "var(--surface)" }}>
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-medium text-on-surface truncate flex-1 mr-2">{teacher.name}</p>
                            <p className="text-[12px] font-normal text-on-surface shrink-0">₹{teacher.price}<span className="text-[10px] text-on-surface-variant">/hr</span></p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <StarRow rating={teacher.rating} />
                            <span className="text-[10px] font-normal text-on-surface-variant">{teacher.rating} · {teacher.experience}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface rounded-[28px] border-2 border-outline-variant flex flex-col items-center justify-center py-24 px-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--surface-container)" }}>
                <MagnifyingGlass size={26} className="text-on-surface-variant" />
              </div>
              <p className="text-[15px] font-normal text-on-surface mb-1">No tutors found</p>
              <p className="text-[13px] font-normal text-on-surface-variant mb-5">Try adjusting your search or filters</p>
              <button onClick={clearAll} className="px-5 py-2.5 rounded-full text-[13px] font-medium border-none cursor-pointer" style={{ background: "var(--primary-container)", color: "var(--on-primary-container)" }}>Clear filters</button>
            </div>
          )}
'@

$newLines = $newBlock -split "`n"
$combined = $before + $newLines + $after
[System.IO.File]::WriteAllLines($f, $combined)
Write-Output "done"
