import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Check, UserCheck, Users, BookOpen, Star, GraduationCap, Trophy, Medal, Award } from "lucide-react";

const TUTORS = [
  { id: 1, name: "Aarav Sharma", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aarav", subject: "Mathematics", category: "Academic", level: "Expert", rating: 4.9, reviews: 128, price: 800, students: 342, sessions: 1200, language: "English", speaks: ["English (Native)", "Hindi (Fluent)"], badge: "Super Tutor", bookings: "Booked 20+ times recently", headline: "JEE & Board Maths Specialist | IIT Delhi Graduate | 8+ Years", bio: "I'm passionate about making Mathematics simple and enjoyable. My teaching methodology focuses on conceptual clarity and problem-solving skills that help students crack JEE and board exams.", specialties: ["JEE Maths", "Calculus", "Algebra", "Trigonometry"] },
  { id: 2, name: "Priya Menon", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya", subject: "Python & AI", category: "Coding & AI", level: "Intermediate", rating: 4.8, reviews: 95, price: 1200, students: 210, sessions: 890, language: "English", speaks: ["English (Native)", "Tamil (Native)", "Malayalam"], badge: "Professional", bookings: "Booked 12 times recently", headline: "Full-Stack Dev & AI Researcher | Real-World Projects | 200+ Students", bio: "I love teaching programming and AI concepts in a practical, hands-on way. My courses focus on real-world projects and industry-relevant skills that get you hired.", specialties: ["Python", "Machine Learning", "React", "System Design"] },
  { id: 3, name: "Ravi Kumar", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ravi", subject: "Guitar", category: "Music & Dance", level: "Beginner", rating: 5.0, reviews: 67, price: 600, students: 156, sessions: 520, language: "Hindi", speaks: ["Hindi (Native)", "English (Fluent)", "Marathi"], badge: null, bookings: "Booked 8 times recently", headline: "Professional Guitarist & Recording Artist | Trinity Grade 8 | 10 Years Experience", bio: "Whether you're a complete beginner or looking to improve, I'll guide you through every step of your musical journey with structured, fun, and effective lessons.", specialties: ["Acoustic Guitar", "Music Theory", "Fingerpicking", "Rock & Pop"] },
  { id: 4, name: "Sneha Patel", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sneha", subject: "IELTS English", category: "Languages", level: "Expert", rating: 4.7, reviews: 203, price: 900, students: 480, sessions: 2100, language: "English", speaks: ["English (Native)", "Hindi (Fluent)", "Gujarati"], badge: "Super Tutor", bookings: "Very popular. Booked 17 times recently", headline: "British Council Certified IELTS Trainer | 8.0+ Band Guarantee | 6+ Years", bio: "With 6+ years of IELTS training, I've helped 480+ students achieve their target scores. My personalized approach focuses on identifying weak areas and building confidence.", specialties: ["IELTS Speaking", "IELTS Writing", "Band 7+", "Business English"] },
  { id: 5, name: "Vikram Joshi", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Vikram", subject: "Physics", category: "Academic", level: "Expert", rating: 4.9, reviews: 156, price: 850, students: 290, sessions: 1050, language: "Hindi", speaks: ["Hindi (Native)", "English (Proficient)"], badge: "Professional", bookings: "Booked 10 times recently", headline: "Ex-Allen Faculty | NEET & JEE Physics | Visual Learning Approach", bio: "I specialize in making complex Physics concepts easy to understand through visualization and logic. My students consistently score 95%+ because they understand the 'why'.", specialties: ["NEET Physics", "JEE Physics", "Mechanics", "Electromagnetism"] },
  { id: 6, name: "Ananya Das", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ananya", subject: "Bharatanatyam", category: "Music & Dance", level: "Intermediate", rating: 4.6, reviews: 42, price: 700, students: 89, sessions: 340, language: "English", speaks: ["English (Native)", "Bengali (Native)", "Tamil"], badge: null, bookings: "Booked 5 times recently", headline: "Kalakshetra-Trained Dancer | 15 Years Teaching | Online & Offline", bio: "I make classical dance accessible and joyful for modern learners. My structured lessons blend tradition with contemporary teaching methods to keep students engaged and progressing.", specialties: ["Bharatanatyam", "Classical Dance", "Abhinaya", "Rhythm"] },
  { id: 7, name: "Karthik R.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Karthik", subject: "React & JavaScript", category: "Coding & AI", level: "Expert", rating: 4.8, reviews: 112, price: 1500, students: 175, sessions: 680, language: "English", speaks: ["English (Native)", "Tamil (Native)"], badge: "Professional", bookings: "Booked 9 times recently", headline: "Senior Engineer at Top Startup | Frontend Architecture & System Design", bio: "I help you think like an engineer, not just write code. With real-world industry experience, I'll teach you to build scalable, production-ready applications.", specialties: ["React", "System Design", "JavaScript", "TypeScript"] },
  { id: 8, name: "Meera Iyer", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Meera", subject: "French", category: "Languages", level: "Beginner", rating: 4.9, reviews: 78, price: 750, students: 134, sessions: 490, language: "French", speaks: ["French (Native)", "English (Fluent)", "Tamil"], badge: "Super Tutor", bookings: "Super popular. Booked 20+ times recently", headline: "Native French Speaker | DELF B2 Certified | Conversation-First Teaching", bio: "I make French learning conversational and confidence-building from day one. My lessons are tailored to your pace, goals, and interests — whether travel, business, or culture.", specialties: ["Conversational French", "DELF/DALF Prep", "Grammar", "Pronunciation"] },
  { id: 9, name: "Arjun Nair", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Arjun", subject: "JEE Chemistry", category: "Exams", level: "Expert", rating: 4.7, reviews: 189, price: 950, students: 320, sessions: 1400, language: "Hindi", speaks: ["Hindi (Native)", "English (Proficient)", "Malayalam"], badge: null, bookings: "Booked 6 times recently", headline: "12 Years JEE Chemistry Coaching | 50+ Students in IITs | Mechanism Expert", bio: "I break down complex reactions and mechanisms so they become second nature. Chemistry isn't just formulas — it's a way of thinking that I'll help you master.", specialties: ["Organic Chemistry", "JEE Advanced", "Physical Chemistry", "Reaction Mechanisms"] },
  { id: 10, name: "Divya Reddy", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Divya", subject: "Vocal Music", category: "Music & Dance", level: "Intermediate", rating: 4.8, reviews: 56, price: 650, students: 98, sessions: 380, language: "Telugu", speaks: ["Telugu (Native)", "Hindi (Fluent)", "English"], badge: null, bookings: "Booked 4 times recently", headline: "Carnatic & Hindustani Vocalist | National Festival Performer | 10+ Years", bio: "I tailor my lessons to each student's musical background and goals. Whether you're a beginner finding your voice or an intermediate student refining technique, I'll guide you.", specialties: ["Carnatic Vocals", "Ragas", "Swaras", "Tala"] },
  { id: 11, name: "Rohan Gupta", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rohan", subject: "Data Science", category: "Coding & AI", level: "Expert", rating: 4.6, reviews: 84, price: 1400, students: 145, sessions: 560, language: "English", speaks: ["English (Fluent)", "Hindi (Native)", "Bengali"], badge: "Professional", bookings: "Booked 7 times recently", headline: "Fortune 500 Data Scientist | MSc Statistics ISI Kolkata | Real Data Projects", bio: "I bridge the gap between academic concepts and real-world data problems. You'll work on actual datasets and learn to extract insights that drive business decisions.", specialties: ["Data Science", "Python", "Statistics", "Machine Learning"] },
  { id: 12, name: "Lakshmi S.", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Lakshmi", subject: "NEET Biology", category: "Exams", level: "Expert", rating: 4.9, reviews: 167, price: 900, students: 410, sessions: 1800, language: "Tamil", speaks: ["Tamil (Native)", "English (Fluent)", "Telugu"], badge: "Super Tutor", bookings: "Very popular. Booked 15 times recently", headline: "MBBS Doctor Turned Educator | 6 Years NEET Biology | Diagrams & Mnemonics", bio: "I make cell biology and genetics intuitive through vivid diagrams and proven mnemonics. As a doctor, I bring real clinical insight to NEET preparation that textbooks can't.", specialties: ["Cell Biology", "Genetics", "NEET Bio", "Physiology"] },
];

const CATEGORIES = ["Academic", "Coding & AI", "Music & Dance", "Languages", "Exams"];
const LEVELS = ["Beginner", "Intermediate", "Expert"];
const LANGUAGES = ["English", "Hindi", "French", "Telugu", "Tamil", "Spanish", "German"];
const RATINGS = [4.5, 4.0, 3.5, 3.0];




const avatarColors = [
  "#0A2156", "#F97316", "#6366F1", "#10B981",
  "#3B82F6", "#8B5CF6", "#0A2156", "#14B8A6",
  "#F59E0B", "#EF4444", "#EC4899", "#0A2156",
];


export default function FindTutorPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sort, setSort] = useState("popular");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredTutorId, setHoveredTutorId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const ITEMS_PER_PAGE = 4;

  const filtered = useMemo(() => {
    let list = TUTORS.filter((t) => {
      if (category && t.category !== category) return false;
      if (level && t.level !== level) return false;
      if (language && t.language !== language) return false;
      if (minRating && t.rating < minRating) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.students - a.students);
    return list;
  }, [search, category, level, language, minRating, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, category, level, language, minRating, sort]);

  const clearFilters = () => {
    setCategory(null);
    setLevel(null);
    setLanguage(null);
    setMinRating(null);
    setSearch("");
    setPage(1);
  };

  const FilterPill = ({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children?: React.ReactNode }) => (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        className="font-season-mix"
        style={{
          padding: "8px 16px",
          borderRadius: "9999px",
          border: active ? "1px solid #111" : "1px solid #E5E7EB",
          background: active ? "#111" : "#fff",
          color: active ? "#fff" : "#555",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        {label}
        <ChevronDown size={14} style={{ transform: activeDropdown === label ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
      </button>
      {activeDropdown === label && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          zIndex: 50,
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          minWidth: "200px",
          padding: "8px 0",
          overflow: "hidden",
        }}>
          {children}
        </div>
      )}
    </div>
  );

  const DropdownItem = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="font-season-mix"
      style={{
        width: "100%",
        padding: "10px 16px",
        textAlign: "left",
        border: "none",
        background: active ? "#F9FAFB" : "transparent",
        color: active ? "#F97316" : "#444",
        fontSize: "14px",
        fontWeight: active ? 800 : 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {label}
      {active && <Check size={14} />}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>

      {/* ── Hero / Search Header ── */}
      <section className="find-tutor-hero" style={{ paddingTop: "140px", paddingBottom: "40px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(165,187,252,0.15) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          {/* Badge — exact homepage badge style */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", border: "1px solid #E5E7EB", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderRadius: "9999px", padding: "6px 16px", marginBottom: "24px" }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✦</span>
            </div>
            <span className="font-season-mix" style={{ fontSize: "12px", fontWeight: 500, color: "#888" }}>Browse <span style={{ color: "#111", fontWeight: 600 }}>50+</span> verified tutors worldwide</span>
          </div>

          <h1 className="font-season-mix hero-title" style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "#111", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Find your <span style={{ color: "#F97316" }}>perfect Tutor</span>
          </h1>
          <p className="font-season-mix hero-subtitle" style={{ color: "#888", fontSize: "16px", marginTop: "12px", lineHeight: 1.6 }}>
            Personalised 1-on-1 tutoring across every subject. Book a free demo today.
          </p>

          {/* Search bar */}
          <div style={{ marginTop: "28px", display: "flex", alignItems: "center", maxWidth: "540px", margin: "28px auto 0", background: "#fff", borderRadius: "9999px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "18px", flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" />
              <path d="M21 21l-4-4" stroke="#999" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, subject, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-season-mix"
              style={{ flex: 1, border: "none", outline: "none", padding: "14px 16px", fontSize: "14px", background: "transparent", color: "#111" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 16px", color: "#999", fontSize: "18px" }}>×</button>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Twitter-style Layout ── */}
      <section className="find-tutor-content" style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 16px 80px", display: "flex", gap: "24px", alignItems: "stretch", justifyContent: "center", width: "100%", boxSizing: "border-box" }}>

        {/* LEFT: Sticky Video Section (desktop only) */}
        <div style={{ width: "300px", display: "none", flexShrink: 0, alignSelf: "stretch" }} className="desktop-spacer">
          <div style={{ position: "sticky", top: "120px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Intro Video */}
            <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <div style={{ position: "relative", paddingBottom: "62%", height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/Ysqu3es1NyE?si=o4sSFMGKLU40xBR5"
                  title="HomeGuru - Introduction"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: "16px 16px 0 0" }}
                />
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div className="font-season-mix" style={{ fontSize: "15px", fontWeight: 700, color: "#111", lineHeight: 1.3 }}>Welcome to HomeGuru</div>
                <div className="font-season-mix" style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>See how 1-on-1 tutoring works</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: "16px", padding: "18px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <div className="font-season-mix" style={{ fontSize: "15px", fontWeight: 700, color: "#111", marginBottom: "14px" }}>Platform Stats</div>
              {[
                { icon: <UserCheck size={15} color="#F97316" />, label: "Active Tutors", value: "50+" },
                { icon: <Users size={15} color="#F97316" />, label: "Students Enrolled", value: "2,500+" },
                { icon: <BookOpen size={15} color="#F97316" />, label: "Sessions Completed", value: "10,000+" },
                { icon: <Star size={15} color="#F97316" fill="#F97316" />, label: "Avg. Rating", value: "4.8 / 5.0" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid #F3F4F6" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {item.icon}
                    <span className="font-season-mix" style={{ fontSize: "13px", color: "#666" }}>{item.label}</span>
                  </div>
                  <span className="font-season-mix" style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* CTA Card */}
            <div style={{ background: "linear-gradient(135deg, #0A2156 0%, #1e3a8a 100%)", borderRadius: "16px", padding: "20px", color: "#fff" }}>
              <div className="font-season-mix" style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>Become a Tutor <GraduationCap size={18} /></span></div>
              <p className="font-season-mix" style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: "0 0 14px", lineHeight: 1.5 }}>Share your expertise and earn on your own schedule.</p>
              <button className="font-season-mix" style={{ width: "100%", padding: "10px 0", borderRadius: "99px", border: "1.5px solid #EBEBEB", background: "#fff", color: "#111", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "#FFF7F0"; e.currentTarget.style.color = "#F97316"; e.currentTarget.style.borderColor = "#F97316"; }} onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; e.currentTarget.style.borderColor = "#EBEBEB"; }}>Apply Now →</button>
            </div>
          </div>
        </div>

        {/* ── CENTER: Tutor List ── */}
        <div className="tutor-center-col" style={{ flex: 1, maxWidth: "660px", minWidth: 0, width: "100%" }}>

          {/* New Dropdown Filter Pills Bar */}
          <div style={{ background: "#fff", borderRadius: "16px 16px 0 0", border: "1px solid #EBEBEB", borderBottom: "none" }}>
            <div style={{ display: "flex", gap: "12px", padding: "16px 24px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }} className="hg-tabs-bar">
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {/* Categories */}
                <FilterPill label="Categories" active={!!category} onClick={() => setActiveDropdown(activeDropdown === "Categories" ? null : "Categories")}>
                  <DropdownItem label="All Categories" active={!category} onClick={() => { setCategory(null); setActiveDropdown(null); }} />
                  {CATEGORIES.map(c => (
                    <DropdownItem key={c} label={c} active={category === c} onClick={() => { setCategory(c); setActiveDropdown(null); }} />
                  ))}
                </FilterPill>

                {/* Rating */}
                <FilterPill label="Rating" active={!!minRating} onClick={() => setActiveDropdown(activeDropdown === "Rating" ? null : "Rating")}>
                  <DropdownItem label="Any Rating" active={!minRating} onClick={() => { setMinRating(null); setActiveDropdown(null); }} />
                  {RATINGS.map(r => (
                    <DropdownItem key={r} label={`${r}+ Stars`} active={minRating === r} onClick={() => { setMinRating(r); setActiveDropdown(null); }} />
                  ))}
                </FilterPill>

                {/* Course Levels */}
                <FilterPill label="Course levels" active={!!level} onClick={() => setActiveDropdown(activeDropdown === "Course levels" ? null : "Course levels")}>
                  <DropdownItem label="All Levels" active={!level} onClick={() => { setLevel(null); setActiveDropdown(null); }} />
                  {LEVELS.map(l => (
                    <DropdownItem key={l} label={l} active={level === l} onClick={() => { setLevel(l); setActiveDropdown(null); }} />
                  ))}
                </FilterPill>

                {/* Language */}
                <FilterPill label="Language" active={!!language} onClick={() => setActiveDropdown(activeDropdown === "Language" ? null : "Language")}>
                  <DropdownItem label="Any Language" active={!language} onClick={() => { setLanguage(null); setActiveDropdown(null); }} />
                  {LANGUAGES.map(l => (
                    <DropdownItem key={l} label={l} active={language === l} onClick={() => { setLanguage(l); setActiveDropdown(null); }} />
                  ))}
                </FilterPill>
              </div>

              {/* View Toggle - Pushed to the right */}
              <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", borderRadius: "9999px", padding: "4px", flexShrink: 0, marginLeft: "auto" }}>
                <button
                  onClick={() => setViewMode("list")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    border: "none",
                    background: viewMode === "list" ? "#fff" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: viewMode === "list" ? "#111" : "#888",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    border: "none",
                    background: viewMode === "grid" ? "#fff" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: viewMode === "grid" ? "#111" : "#888",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results list — X.com Lists style */}
          <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderTop: "1px solid #EBEBEB", borderRadius: "0 0 16px 16px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p className="font-season-mix" style={{ fontSize: "22px", color: "#111" }}>No tutors found</p>
                <p className="font-season-mix" style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>Try adjusting your filters.</p>
                <button onClick={clearFilters} className="font-season-mix" style={{ marginTop: "16px", padding: "8px 20px", borderRadius: "9999px", border: "none", background: "#111", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>Clear filters</button>
              </div>
            ) : viewMode === "list" ? (
              (() => {
                const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
                return (
                  <>
                    {pageItems.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex", gap: "0",
                    borderBottom: i < filtered.length - 1 ? "1px solid #F3F4F6" : "none",
                    transition: "background 0.15s",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => window.location.href = `/teacher-profile?id=${t.id}`}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* LEFT: Avatar */}
                  <div style={{ padding: "20px 16px 20px 20px", flexShrink: 0 }}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={t.avatar}
                        alt={t.name}
                        style={{
                          width: 88, height: 88, borderRadius: "12px",
                          objectFit: "cover", border: "1px solid #EBEBEB",
                          display: "block",
                        }}
                      />
                      {(t as any).badge && (
                        <div style={{
                          position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
                          background: (t as any).badge === "Super Tutor" ? "#F97316" : "#3B82F6",
                          color: "#fff", fontSize: "9px", fontWeight: 700,
                          padding: "2px 8px", borderRadius: "99px", whiteSpace: "nowrap",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        }} className="font-season-mix">
                          {(t as any).badge === "Super Tutor" ? "⭐ Super" : "Pro"}
                        </div>
                      )}
                    </div>
                    {/* Stars under avatar */}
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "2px" }}>
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= Math.round(t.rating) ? "#F97316" : "#E5E7EB"}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <div className="font-season-mix" style={{ fontWeight: 700, fontSize: "13px", color: "#111", marginTop: "3px" }}>{t.rating}</div>
                      <div className="font-season-mix" style={{ fontSize: "11px", color: "#999" }}>{t.reviews} reviews</div>
                    </div>
                  </div>

                  {/* CENTER: Info */}
                  <div style={{ flex: 1, minWidth: 0, padding: "20px 12px 20px 0", borderLeft: "1px solid #F3F4F6" }}>
                    {/* Name + verified */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span className="font-season-mix" style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>{t.name}</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="#F97316"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    </div>

                    {/* Subject */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      <span className="font-season-mix" style={{ fontSize: "13px", color: "#F97316", fontWeight: 500 }}>{t.subject}</span>
                    </div>

                    {/* Speaks */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span className="font-season-mix" style={{ fontSize: "12px", color: "#888" }}>Speaks {(t as any).speaks ? (t as any).speaks.slice(0, 2).join(", ") : t.language}
                        {(t as any).speaks && (t as any).speaks.length > 2 ? ` +${(t as any).speaks.length - 2}` : ""}
                      </span>
                    </div>

                    {/* Stats: students + sessions */}
                    <div style={{ display: "flex", gap: "14px", marginBottom: "10px" }}>
                      <span className="font-season-mix" style={{ fontSize: "12px", color: "#666" }}>
                        <strong style={{ color: "#111" }}>{t.students}</strong> active students
                      </span>
                      <span className="font-season-mix" style={{ fontSize: "12px", color: "#666" }}>
                        <strong style={{ color: "#111" }}>{t.sessions.toLocaleString()}</strong> lessons
                      </span>
                    </div>

                    {/* Headline + Bio */}
                    <p className="font-season-mix" style={{ fontSize: "13px", color: "#444", lineHeight: 1.6, margin: 0 }}>
                      <strong style={{ color: "#111" }}>{(t as any).headline || t.subject + " Tutor"}</strong>
                      {(t as any).bio ? ` — ${(t as any).bio.slice(0, 130)}...` : ""}
                    </p>

                    {/* Booking badge */}
                    {(t as any).bookings && (
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "10px" }}>
                        <span style={{ fontSize: "12px" }}>🔥</span>
                        <span className="font-season-mix" style={{ fontSize: "11px", color: "#E65100", fontWeight: 600 }}>{(t as any).bookings}</span>
                      </div>
                    )}

                    {/* Specialty tags */}
                    {(t as any).specialties && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                        {(t as any).specialties.slice(0, 3).map((s: string, si: number) => (
                          <span key={si} className="font-season-mix" style={{ background: "#F3F4F6", color: "#555", fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "99px" }}>{s}</span>
                        ))}
                      </div>
                    )}

                    {/* Learn more link */}
                    <button className="font-season-mix" style={{ background: "none", border: "none", padding: 0, marginTop: "10px", color: "#111", fontSize: "13px", fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}
                      onClick={e => { e.stopPropagation(); window.location.href = `/teacher-profile?id=${t.id}`; }}>
                      Learn more
                    </button>
                  </div>

                  {/* RIGHT: Price + CTAs */}
                  <div style={{ padding: "20px 20px 20px 12px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", flexShrink: 0, minWidth: 140 }}>
                    {/* Wishlist */}
                    <button
                      style={{ border: "none", background: "none", cursor: "pointer", padding: 0, flexShrink: 0, marginBottom: "auto" }}
                      onClick={e => {
                        e.stopPropagation();
                        setWishlist(prev => prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id]);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={wishlist.includes(t.id) ? "#EF4444" : "none"}
                        stroke={wishlist.includes(t.id) ? "#EF4444" : "#bbb"}
                        strokeWidth="2"
                        style={{ transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)", transform: wishlist.includes(t.id) ? "scale(1.1)" : "scale(1)" }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    {/* Price */}
                    <div style={{ textAlign: "right" }}>
                      <div className="font-season-mix" style={{ fontSize: "22px", fontWeight: 800, color: "#111", lineHeight: 1 }}>₹{t.price.toLocaleString()}</div>
                      <div className="font-season-mix" style={{ fontSize: "12px", color: "#888", marginTop: "3px" }}>50-min lesson</div>
                    </div>

                    {/* Popularity or New badge */}
                    {(t as any).badge ? (
                      <div style={{ textAlign: "right" }}>
                        <div className="font-season-mix" style={{ fontSize: "12px", fontWeight: 700, color: (t as any).badge === "Super Tutor" ? "#F97316" : "#3B82F6" }}>
                          {(t as any).badge === "Super Tutor" ? "⭐ Super Tutor" : "✓ Professional"}
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "right" }}>
                        <div className="font-season-mix" style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>New</div>
                        <div className="font-season-mix" style={{ fontSize: "11px", color: "#888" }}>tutor</div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <div style={{ width: "100%" }} onClick={e => e.stopPropagation()}>
                      <button
                        className="font-season-mix"
                        onClick={() => window.location.href = `/teacher-profile?id=${t.id}`}
                        style={{
                          width: "100%",
                          padding: "11px 0",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          background: "#fff",
                          color: "#111",
                          fontSize: "15px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "#FFF7F0";
                          e.currentTarget.style.color = "#F97316";
                          e.currentTarget.style.borderColor = "#F97316";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.color = "#111";
                          e.currentTarget.style.borderColor = "#E5E7EB";
                        }}
                      >
                        Book Demo
                      </button>
                    </div>
                  </div>
                </div>
              ))}

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "20px 20px 24px" }}>
                        {/* Prev */}
                        <button
                          onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: "smooth" }); }}
                          disabled={page === 1}
                          className="font-season-mix"
                          style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #E5E7EB", background: page === 1 ? "#F9FAFB" : "#fff", color: page === 1 ? "#CCC" : "#111", cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, transition: "all 0.15s" }}
                        >‹</button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                          <button
                            key={n}
                            onClick={() => { setPage(n); window.scrollTo({ top: 400, behavior: "smooth" }); }}
                            className="font-season-mix"
                            style={{ width: 36, height: 36, borderRadius: "50%", border: n === page ? "none" : "1px solid #E5E7EB", background: n === page ? "#F97316" : "#fff", color: n === page ? "#fff" : "#555", cursor: "pointer", fontSize: "13px", fontWeight: n === page ? 800 : 500, transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >{n}</button>
                        ))}

                        {/* Next */}
                        <button
                          onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: "smooth" }); }}
                          disabled={page === totalPages}
                          className="font-season-mix"
                          style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #E5E7EB", background: page === totalPages ? "#F9FAFB" : "#fff", color: page === totalPages ? "#CCC" : "#111", cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, transition: "all 0.15s" }}
                        >›</button>
                      </div>
                    )}
                  </>
                );
              })()
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", padding: "20px" }}>
                {filtered.map((t, i) => (
                  <div
                    key={t.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #EBEBEB",
                      borderRadius: "12px",
                      padding: "16px",
                      textAlign: "center",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                      e.currentTarget.style.borderColor = "#D1D5DB";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#EBEBEB";
                    }}
                  >
                    {/* Wishlist Heart - Grid View */}
                    <button
                      style={{ position: "absolute", top: "12px", right: "12px", border: "none", background: "none", cursor: "pointer", padding: 0 }}
                      onClick={e => {
                        e.stopPropagation();
                        setWishlist(prev => prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id]);
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={wishlist.includes(t.id) ? "#EF4444" : "none"}
                        stroke={wishlist.includes(t.id) ? "#EF4444" : "#bbb"}
                        strokeWidth="2"
                        style={{ transition: "all 0.2s ease", transform: wishlist.includes(t.id) ? "scale(1.1)" : "scale(1)" }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    <img src={t.avatar} alt={t.name} style={{
                      width: 56, height: 56, borderRadius: "12px",
                      objectFit: "cover",
                      margin: "0 auto 12px",
                      cursor: "pointer",
                      display: "block",
                    }}
                      onClick={() => window.open(`/teacher-profile?id=${t.id}`, "_blank")} />
                    <p className="font-season-mix" style={{ fontSize: "14px", fontWeight: 700, color: "#111", margin: "0 0 4px", cursor: "pointer" }} onClick={() => window.open(`/teacher-profile?id=${t.id}`, "_blank")}>{t.name}</p>
                    <p className="font-season-mix" style={{ fontSize: "12px", color: "#888", margin: "0 0 8px", cursor: "pointer" }} onClick={() => window.open(`/teacher-profile?id=${t.id}`, "_blank")}>{t.subject}</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px", margin: "8px 0", fontSize: "12px", color: "#888" }}>
                      <span>⭐ {t.rating}</span>
                      <span>·</span>
                      <span>₹{t.price}/hr</span>
                    </div>
                    <button
                      className="font-season-mix"
                      onClick={() => window.location.href = `/teacher-profile?id=${t.id}`}
                      style={{
                        width: "100%",
                        padding: "8px 0",
                        borderRadius: "9999px",
                        border: "1px solid #E5E7EB",
                        background: "#fff",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#111",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FFF7F0";
                        e.currentTarget.style.color = "#F97316";
                        e.currentTarget.style.borderColor = "#F97316";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#111";
                        e.currentTarget.style.borderColor = "#E5E7EB";
                      }}
                    >
                      Book Demo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: X.com-style Sidebar ── */}
        <aside className="hg-filter-panel" style={{ 
          width: "320px", 
          flexShrink: 0, 
          position: "relative", 
          display: "flex", 
          flexDirection: "column", 
          gap: "24px",
          paddingBottom: "100px"
        }}>

          {/* ── Today's Blogs ── */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #EBEBEB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", marginBottom: "16px" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="font-season-mix" style={{ fontSize: "20px", fontWeight: 700, color: "#111" }}>Today's Blogs</span>
            </div>
            {[
              { title: "How I Cracked JEE in 6 Months", author: "Aarav Sharma", time: "2h ago", color: "#0A2156" },
              { title: "Why Every Student Should Learn Python in 2025", author: "Priya Menon", time: "5h ago", color: "#F97316" },
              { title: "The Secret to Mastering Any Musical Instrument", author: "Ravi Kumar", time: "8h ago", color: "#6366F1" },
              { title: "Tips for Staying Motivated During Exam Season", author: "Sneha Patel", time: "10h ago", color: "#EF4444" },
            ].map((blog, idx) => (
              <div
                key={idx}
                style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: blog.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{blog.author.charAt(0)}</div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className="font-season-mix" style={{ fontSize: "12px", fontWeight: 700, color: "#111" }}>{blog.author}</span>
                    <span className="font-season-mix" style={{ fontSize: "11px", color: "#999" }}>{blog.time}</span>
                  </div>
                </div>
                <p className="font-season-mix" style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: 0, lineHeight: 1.5 }}>{blog.title}</p>
              </div>
            ))}
            <div style={{ padding: "14px 20px" }}>
              <button className="font-season-mix" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#F97316", fontWeight: 700 }}>Show more →</button>
            </div>
          </div>

          {/* ── Top Tutors ── */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #EBEBEB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "8px" }}>
              <Trophy size={20} color="#F97316" />
              <span className="font-season-mix" style={{ fontSize: "20px", fontWeight: 700, color: "#111" }}>Top Tutors</span>
            </div>
            {[
              { rank: <Trophy size={16} color="#FFD700" />, name: "Ravi Kumar", subject: "Guitar", students: 156, rating: 5, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Ravi" },
              { rank: <Medal size={16} color="#C0C0C0" />, name: "Aarav Sharma", subject: "Mathematics", students: 342, rating: 4.9, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aarav" },
              { rank: <Medal size={16} color="#CD7F32" />, name: "Vikram Joshi", subject: "Physics", students: 290, rating: 4.9, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Vikram" },
              { rank: <Award size={16} color="#F97316" />, name: "Sneha Patel", subject: "IELTS English", students: 480, rating: 4.7, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sneha" },
            ].map((tutor, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px 20px",
                  borderBottom: idx < 3 ? "1px solid #F3F4F6" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <span style={{ width: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>{tutor.rank}</span>
                  <img src={tutor.avatar} alt={tutor.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1.2px solid #EBEBEB" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-season-mix" style={{ fontSize: "16px", fontWeight: 700, color: "#111", lineHeight: 1.3 }}>{tutor.name}</div>
                  <div className="font-season-mix" style={{ fontSize: "13px", color: "#888", marginTop: "3px" }}>{tutor.subject} · {tutor.students} students</div>
                  <div className="font-season-mix" style={{ fontSize: "13px", color: "#F97316", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "3px" }}>
                    <Star size={13} color="#F97316" fill="#F97316" /> {tutor.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── What's Happening ── */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #EBEBEB", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <span className="font-season-mix" style={{ fontSize: "20px", fontWeight: 700, color: "#111" }}>What's happening</span>
            </div>
            {[
              { label: "Education · Trending", title: "NEET 2025 results declared — toppers share study tips", stat: "12.4K posts" },
              { label: "Technology · Trending", title: "AI tutoring platforms see 300% growth in India", stat: "8.2K posts" },
              { label: "HomeGuru · New", title: "Free demo classes now available for all new subjects", stat: "3.1K posts" },
              { label: "Music · Popular", title: "Online music lessons overtake in-person classes in 2025", stat: "5.7K posts" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{ padding: "14px 20px", borderBottom: idx < 3 ? "1px solid #F3F4F6" : "none", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="font-season-mix" style={{ fontSize: "11px", color: "#999" }}>{item.label}</span>
                <p className="font-season-mix" style={{ fontSize: "14px", fontWeight: 600, color: "#111", margin: "4px 0 0", lineHeight: 1.4 }}>{item.title}</p>
                <span className="font-season-mix" style={{ fontSize: "11px", color: "#BBB", marginTop: "4px", display: "block" }}>{item.stat}</span>
              </div>
            ))}
            <div style={{ padding: "14px 20px" }}>
              <button className="font-season-mix" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#F97316", fontWeight: 700 }}>Show more →</button>
            </div>
          </div>

        </aside>
      </section>

      <style>{`
        /* --- RESPONSIVE CSS --- */
        .find-tutor-hero { padding-top: 140px; }
        .hg-tabs-bar { 
          display: flex; 
          gap: 12px; 
          padding: 16px 20px; 
          flex-wrap: nowrap; 
          overflow-x: auto; 
          -webkit-overflow-scrolling: touch;
        }
        .hg-tabs-bar::-webkit-scrollbar { display: none; }
        .desktop-spacer { display: none !important; }
        .hg-filter-panel { display: none !important; }

        @media (max-width: 1023px) {
          .find-tutor-content { justify-content: center !important; }
          .tutor-center-col { max-width: 100% !important; }
        }

        @media (max-width: 768px) {
          .find-tutor-hero { padding-top: 100px !important; padding-bottom: 30px !important; }
          .hero-title { font-size: 32px !important; }
          .hero-subtitle { font-size: 14px !important; }
          .find-tutor-content { padding: 0 12px 60px !important; }
        }

        @media (min-width: 1024px) {
          .desktop-spacer { display: block !important; }
          .desktop-spacer::-webkit-scrollbar { display: none; }
          .hg-filter-panel { display: flex !important; margin-left: 12px; }
          .hg-tabs-bar { flex-wrap: wrap !important; overflow-x: visible !important; }
        }
      `}</style>

    </div>
  );
}
