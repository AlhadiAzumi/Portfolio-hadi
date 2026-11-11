import FadeDown from "@/components/animations/FadeDown"

const GITHUB_USERNAME = "AlhadiAzumi"

interface Contribution {
  date: string
  count: number
  level: number
}

async function getContributions(): Promise<Contribution[] | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { contributions?: Contribution[] }
    return data.contributions ?? null
  } catch {
    return null
  }
}

const levelClasses = [
  "bg-text-secondary/10",
  "bg-text-primary/20",
  "bg-text-primary/40",
  "bg-text-primary/65",
  "bg-text-primary",
]

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""]

function getMonthLabels(weeks: (Contribution | null)[][]) {
  return weeks.map((week, weekIndex) => {
    if (weekIndex === 0) {
      const first = week.find((day) => day !== null)
      return first ? monthNames[Number(first.date.split("-")[1]) - 1] : null
    }

    const monthStart = week.find((day) => day && day.date.endsWith("-01"))
    return monthStart ? monthNames[Number(monthStart.date.split("-")[1]) - 1] : null
  })
}

function buildWeeks(contributions: Contribution[]) {
  if (contributions.length === 0) return []

  const first = contributions[0].date.split("-").map(Number)
  const firstWeekday = new Date(first[0], first[1] - 1, first[2]).getDay()

  const padded: (Contribution | null)[] = [...Array(firstWeekday).fill(null), ...contributions]
  const weeks: (Contribution | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }
  return weeks
}

function getContributionStats(contributions: Contribution[]) {
  if (contributions.length === 0) {
    return { total: 0, bestDay: 0, currentStreak: 0, longestStreak: 0 }
  }

  const total = contributions.reduce((sum, day) => sum + day.count, 0)
  const bestDay = contributions.reduce((max, day) => Math.max(max, day.count), 0)

  let longestStreak = 0
  let run = 0
  for (const day of contributions) {
    if (day.count > 0) {
      run++
      longestStreak = Math.max(longestStreak, run)
    } else {
      run = 0
    }
  }

  let currentStreak = 0
  let index = contributions.length - 1
  if (index >= 0 && contributions[index].count === 0) index--
  while (index >= 0 && contributions[index].count > 0) {
    currentStreak++
    index--
  }

  return { total, bestDay, currentStreak, longestStreak }
}

export default async function Github() {
  const contributions = await getContributions()

  const weeks = contributions ? buildWeeks(contributions) : []
  const monthLabels = getMonthLabels(weeks)
  const stats = contributions ? getContributionStats(contributions) : null

  const statCards = [
    { label: "Total", value: stats?.total, suffix: "" },
    { label: "Best Day", value: stats?.bestDay, suffix: "" },
    { label: "Current Streak", value: stats?.currentStreak, suffix: " days" },
    { label: "Longest Streak", value: stats?.longestStreak, suffix: " days" },
  ]

  return (
    <section id="github" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
      <FadeDown>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Open Source</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">GitHub Contributions</h3>
        </div>
      </FadeDown>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="p-6 md:p-10 bg-thirdary/20 border border-text-secondary/10 rounded-2xl transition-all duration-500 hover:border-text-primary/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-lg font-black text-text-primary tracking-tight">@{GITHUB_USERNAME}</p>
              <p className="text-sm text-text-secondary font-medium">Contribution activity from GitHub</p>
            </div>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn text-xs font-bold tracking-[0.2em] uppercase text-text-primary flex items-center gap-3"
            >
              Visit GitHub
              <span className="w-8 h-[2px] bg-text-primary group-hover/btn:w-12 transition-all duration-300"></span>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((item) => (
              <div key={item.label} className="p-5 bg-background border border-text-secondary/10 rounded-xl transition-colors duration-300 hover:border-text-primary/40">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tighter">
                  {item.value !== undefined ? item.value.toLocaleString() : "—"}
                  <span className="text-xs sm:text-sm font-bold text-text-secondary">{item.suffix}</span>
                </span>
                <span className="block mt-1 text-[10px] font-bold tracking-widest text-text-secondary uppercase">{item.label}</span>
              </div>
            ))}
          </div>

          {contributions && weeks.length > 0 ? (
            <>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 shrink-0 pt-5">
                  {weekdayLabels.map((label, index) => (
                    <div key={index} className="h-3 text-[10px] font-bold tracking-wider text-text-secondary uppercase leading-none flex items-center">
                      {label}
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto pb-2">
                  <div className="min-w-max">
                    <div className="flex gap-1 mb-1 h-4">
                      {weeks.map((_, weekIndex) => (
                        <div key={weekIndex} className="relative w-3 h-4">
                          {monthLabels[weekIndex] && (
                            <span className="absolute left-0 top-0 text-[10px] font-bold tracking-wider text-text-secondary uppercase whitespace-nowrap">
                              {monthLabels[weekIndex]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-1">
                      {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const day = week[dayIndex]
                            return (
                              <div
                                key={dayIndex}
                                title={day ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}` : undefined}
                                className={`w-3 h-3 rounded-[2px] ${day ? levelClasses[Math.min(day.level, 4)] : "bg-transparent"}`}
                              />
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">Less</span>
                {levelClasses.map((cls, i) => (
                  <div key={i} className={`w-3 h-3 rounded-[2px] ${cls}`} />
                ))}
                <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">More</span>
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-sm font-medium text-text-secondary">
              Contribution graph is temporarily unavailable.{" "}
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-text-primary underline underline-offset-4">
                View on GitHub
              </a>
            </div>
          )}

          <p className="mt-8 pt-6 border-t border-text-secondary/10 max-w-3xl mx-auto text-center text-sm md:text-base italic font-medium text-text-secondary leading-relaxed">
            &ldquo;Today is not about who is the fastest, but about who does not stop. It is from that 0.01 that something great usually grows.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}
