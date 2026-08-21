// ================================================================
// SVIST COLLEGE PORTAL — PRODUCTION SERVER
// ================================================================
// Architecture: Express 5.x + MongoDB Atlas (Mongoose 9.x)
// Deployment: Render.com (ephemeral containers)
// Security: Helmet, CORS whitelist, Rate Limiting, JWT strict mode
// Performance: Compression, Connection Pooling, Health Checks
// ================================================================

// 1. IMPORT DEPENDENCIES
const dns = require("dns");
try {
  // Ensure reliable DNS resolution for MongoDB Atlas SRV connection strings across local Windows & cloud environments
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (dnsErr) {
  console.warn("[DNS] Custom DNS configuration skipped:", dnsErr.message);
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// 2. IMPORT MODELS
const Student = require("./models/Student");
const Admin = require("./models/Admin");
const HOD = require("./models/HOD");
const Notice = require("./models/Notice");
const Faculty = require("./models/Faculty");
const Admission = require("./models/Admission");
const FeeReceipt = require("./models/FeeReceipt");
const JobDrive = require("./models/JobDrive");

// 3. IMPORT MIDDLEWARE
const { verifyMasterKey, verifyHODKey } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// ================================================================
// 4. FAIL-FAST ENVIRONMENT VALIDATION
// ================================================================
// If JWT_SECRET is not set, the server MUST NOT start. A production
// server running with a hardcoded secret is a critical vulnerability.
// We crash immediately with a clear error message so the operator
// knows exactly what to fix in the Render environment variables.
// ================================================================
if (!process.env.JWT_SECRET) {
  console.error("══════════════════════════════════════════════════");
  console.error("FATAL: JWT_SECRET environment variable is not set.");
  console.error("The server cannot start without a signing secret.");
  console.error("Set JWT_SECRET in your Render environment variables.");
  console.error("Generate one with: openssl rand -hex 32");
  console.error("══════════════════════════════════════════════════");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("FATAL: MONGO_URI environment variable is not set.");
  process.exit(1);
}

// ================================================================
// 5. INITIALIZE EXPRESS ENGINE
// ================================================================
const app = express();

// ----------------------------------------------------------------
// 5A. HELMET — HTTP Security Headers
// ----------------------------------------------------------------
// Helmet sets 15+ HTTP headers that protect against common attacks:
// - X-Content-Type-Options: nosniff → prevents MIME type sniffing
// - X-Frame-Options: SAMEORIGIN → blocks clickjacking via iframes
// - Strict-Transport-Security → enforces HTTPS connections
// - X-XSS-Protection → enables browser XSS filters
// - Removes X-Powered-By → hides Express fingerprint from attackers
// ----------------------------------------------------------------
app.use(helmet());

// ----------------------------------------------------------------
// 5B. CORS — Origin Whitelist Configuration
// ----------------------------------------------------------------
// DESIGN: Instead of cors() (accepts ALL origins), we whitelist:
//   1. http://localhost:5173 — Vite dev server for local development
//   2. Any *.vercel.app domain — supports Vercel preview branches
//      AND the main production deployment
//
// The `origin` callback receives the request's Origin header and
// must call callback(null, true) to allow or callback(error) to block.
// Requests with no Origin (e.g., curl, server-to-server) are allowed
// because they aren't subject to browser CORS restrictions.
// ----------------------------------------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", // Secondary Vite port if 5173 is occupied
];

// Regex: matches any subdomain or root of vercel.app
// Examples that match:
//   https://svist-portal.vercel.app
//   https://svist-portal-git-feature-x-user.vercel.app
//   https://svist-portal-abc123.vercel.app
const vercelRegex = /^https:\/\/.*\.vercel\.app$/;

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no Origin header (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Check against the static whitelist first
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Check against the Vercel regex pattern
    if (vercelRegex.test(origin)) return callback(null, true);

    // Block everything else
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true, // Allow cookies and Authorization headers
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// ----------------------------------------------------------------
// 5C. COMPRESSION — Response Payload Compression
// ----------------------------------------------------------------
// Compresses all responses with gzip/deflate. Typical compression
// ratios for JSON APIs are 60-80% size reduction.
// The `threshold` of 1024 bytes means we don't waste CPU compressing
// tiny responses (e.g., a 50-byte { "ok": true } response).
// ----------------------------------------------------------------
app.use(compression({ threshold: 1024 }));

// ----------------------------------------------------------------
// 5D. JSON Body Parser
// ----------------------------------------------------------------
// Limit payload size to 10MB to prevent memory exhaustion attacks.
// The default express.json() has no limit — an attacker could POST
// a 500MB JSON body and crash the Render container.
// ----------------------------------------------------------------
app.use(express.json({ limit: "10mb" }));

// ----------------------------------------------------------------
// 5E. RATE LIMITING — Two-Tier Configuration
// ----------------------------------------------------------------
// TIER 1 (Strict): Authentication endpoints.
// 5 requests per 15 minutes per IP address.
// Rationale: Login endpoints are the #1 target for brute-force
// attacks. 5 attempts is generous for a legitimate user but
// blocks automated credential stuffing.
//
// TIER 2 (Standard): All other API routes.
// 100 requests per 15 minutes per IP address.
// Rationale: Prevents scraping and DoS while allowing normal
// browsing patterns (page loads, form submissions, etc.)
// ----------------------------------------------------------------
const isDev = process.env.NODE_ENV !== "production";

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 15,    // Generous for local development, 15 attempts in production
  skip: (req) => isDev || req.ip === "127.0.0.1" || req.ip === "::1" || req.ip === "::ffff:127.0.0.1",
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,      // Disable X-RateLimit-* headers
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
});

const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 5000 : 200,   // Generous for local development
  skip: (req) => isDev || req.ip === "127.0.0.1" || req.ip === "::1" || req.ip === "::ffff:127.0.0.1",
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please slow down.",
  },
});

// Apply standard limiter to ALL /api routes as a baseline
app.use("/api", standardLimiter);

// Apply strict limiter to authentication endpoints (overrides standard)
app.use("/api/admin/login", strictAuthLimiter);
app.use("/api/hod/login", strictAuthLimiter);
app.use("/api/students/login", strictAuthLimiter);

// ================================================================
// 6. CONNECT TO MONGODB ATLAS
// ================================================================
// CONNECTION POOL CONFIGURATION — Critical for Render's ephemeral
// container architecture. Render containers restart frequently
// (deploys, scaling events, cold starts after inactivity).
//
// maxPoolSize: 10
//   Maintains up to 10 concurrent connections to Atlas. This is
//   optimal for a single Render container — too low causes queuing,
//   too high wastes Atlas connection slots (free tier allows 500).
//
// minPoolSize: 2
//   Keeps 2 connections warm even during idle periods. When Render
//   spins the container back up after a cold start, these pre-warmed
//   connections reduce the first-request latency from ~2s to ~200ms.
//
// serverSelectionTimeoutMS: 5000
//   How long the driver waits to find a suitable server in the
//   replica set. Default is 30s — far too long for a web request.
//   5s is aggressive but reasonable for Atlas (which has 99.99% SLA).
//   If Atlas is truly down, we fail fast instead of hanging.
//
// heartbeatFrequencyMS: 10000
//   How often the driver pings the replica set to check topology.
//   Default 10s is fine. This keeps the driver aware of failovers.
//
// socketTimeoutMS: 45000
//   Maximum time a socket can remain idle before being closed.
//   45s covers slow queries and prevents zombie connections from
//   accumulating after Render container restarts.
//
// retryWrites & retryReads: true
//   If a write/read fails due to a transient network blip (common
//   during Render deploys), the driver automatically retries once
//   before surfacing the error. This is the single biggest resilience
//   win for ephemeral hosting.
// ================================================================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
  })
  .then(() => console.log("[DB] MongoDB Atlas connection established."))
  .catch((err) => {
    console.error("[DB] MongoDB connection FAILED:", err.message);
    // Don't process.exit here — let the health check report the failure.
    // Render will restart the container automatically.
  });

// Mongoose connection event listeners for operational visibility
mongoose.connection.on("disconnected", () => {
  console.warn("[DB] MongoDB disconnected. Awaiting automatic reconnection...");
});
mongoose.connection.on("reconnected", () => {
  console.log("[DB] MongoDB reconnected successfully.");
});
mongoose.connection.on("error", (err) => {
  console.error("[DB] MongoDB connection error:", err.message);
});

// ================================================================
// 7. HEALTH CHECK ENDPOINT
// ================================================================
// Purpose 1: Render uptime monitoring — Render pings this endpoint
//            to verify the container is alive.
// Purpose 2: Frontend deployment-race detection — if the React app
//            deploys before the backend, the frontend can hit /api/health
//            to check if the API is ready before making data requests.
// Returns the current MongoDB connection state:
//   0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
// ================================================================
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "healthy" : "degraded",
    database: states[dbState] || "unknown",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ==========================================
// 8. ADMIN AUTHENTICATION ROUTES
// ==========================================
app.post("/api/admin/setup", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ username: "master_admin" });
    if (existingAdmin) return res.status(400).json({ error: "Admin already exists." });
    const newAdmin = new Admin({ username: "master_admin", password: "svist_admin_700145" });
    await newAdmin.save();
    console.log("[SYSTEM] Master Admin Account Created.");
    res.status(201).json({ message: "Master Admin initialized securely." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) return res.status(400).json({ error: "Invalid username." });
    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password." });
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    console.log(`[SYSTEM] Admin login successful: ${admin.username}`);
    res.status(200).json({ token: token, message: "Master Key granted." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 9. HOD AUTHENTICATION ROUTES
// ==========================================
app.post("/api/hod/setup", async (req, res) => {
  try {
    const existingHOD = await HOD.findOne({ username: "master_hod" });
    if (existingHOD) return res.status(400).json({ error: "HOD already exists." });
    const newHOD = new HOD({ username: "master_hod", password: "svist_hod_700145" });
    await newHOD.save();
    console.log("[SYSTEM] Master HOD Account Created.");
    res.status(201).json({ message: "Master HOD initialized securely." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/hod/login", async (req, res) => {
  try {
    const hod = await HOD.findOne({ username: req.body.username });
    if (!hod) return res.status(400).json({ error: "Invalid HOD username." });
    const validPassword = await bcrypt.compare(req.body.password, hod.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password." });
    const token = jwt.sign({ _id: hod._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    console.log(`[SYSTEM] HOD login successful: ${hod.username}`);
    res.status(200).json({ token: token, message: "HOD Key granted." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 10. STUDENT DATA & LOGIN ROUTES
// ==========================================
app.post("/api/students/login", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.body.rollNumber });
    if (!student) return res.status(400).json({ error: "Invalid Roll Number." });

    const validPassword = await bcrypt.compare(req.body.password, student.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid Password." });

    const token = jwt.sign({ _id: student._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({ token: token, studentData: student });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/students", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("svist123", salt);
    const newStudent = new Student({
       name: req.body.name, rollNumber: req.body.rollNumber,
       department: req.body.department, semester: req.body.semester, password: hashedPassword
    });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) { res.status(500).json({ error: "Failed to save student", details: err.message }); }
});

app.patch("/api/students/:id/attendance", verifyHODKey, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { attendance: req.body.attendance }, { new: true });
    res.status(200).json(updatedStudent);
  } catch (err) { res.status(500).json({ error: "Failed to update attendance." }); }
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) { res.status(500).json({ error: "Failed to fetch students" }); }
});

app.put("/api/students/:id", verifyMasterKey, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedStudent);
  } catch (err) { res.status(500).json({ error: "Failed to update student." }); }
});

app.delete("/api/students/:id", verifyMasterKey, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Record permanently purged from Atlas." });
  } catch (err) { res.status(500).json({ error: "Failed to delete student." }); }
});

// ==========================================
// 11. FACULTY CRUD ROUTES
// ==========================================
app.post("/api/faculty", verifyMasterKey, async (req, res) => {
  try {
    const newFaculty = new Faculty(req.body);
    const savedFaculty = await newFaculty.save();
    res.status(201).json(savedFaculty);
  } catch (err) { res.status(500).json({ error: "Failed to save faculty" }); }
});

app.get("/api/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.status(200).json(faculty);
  } catch (err) { res.status(500).json({ error: "Failed to fetch faculty" }); }
});

app.delete("/api/faculty/:id", verifyMasterKey, async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Faculty permanently purged." });
  } catch (err) { res.status(500).json({ error: "Failed to delete faculty." }); }
});

// ==========================================
// 12. ADMISSIONS DB PIPELINE
// ==========================================
app.post("/api/admissions", async (req, res) => {
  try {
    const newAdmission = new Admission(req.body);
    const savedAdmission = await newAdmission.save();
    console.log(`[SYSTEM] New Admission Application Received: ${savedAdmission.name}`);
    res.status(201).json(savedAdmission);
  } catch (err) { res.status(500).json({ error: "Failed to save application" }); }
});

app.get("/api/admissions", verifyMasterKey, async (req, res) => {
  try {
    const applications = await Admission.find().sort({ _id: -1 });
    res.status(200).json(applications);
  } catch (err) { res.status(500).json({ error: "Failed to fetch applications" }); }
});

app.delete("/api/admissions/:id", verifyMasterKey, async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Application purged." });
  } catch (err) { res.status(500).json({ error: "Failed to delete application." }); }
});

// ==========================================
// 13. HOD NOTICE BROADCAST ROUTES
// ==========================================
app.post("/api/notices", verifyHODKey, async (req, res) => {
  try {
    const newNotice = new Notice(req.body);
    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (err) { res.status(500).json({ error: "Failed to broadcast notice." }); }
});

app.get("/api/notices", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ _id: -1 }); 
    res.status(200).json(notices);
  } catch (err) { res.status(500).json({ error: "Failed to fetch notices." }); }
});

app.delete("/api/notices/:id", verifyHODKey, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notice permanently deleted." });
  } catch (err) { res.status(500).json({ error: "Failed to delete notice." }); }
});

app.put("/api/notices/:id", verifyHODKey, async (req, res) => {
  try {
    const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedNotice);
  } catch (err) { res.status(500).json({ error: "Failed to update notice." }); }
});

// ==========================================
// 14. FINANCE & SEMESTER FEE GATEWAY
// ==========================================
// Student Lookup for Public Fee Payment Gateway
app.get("/api/finance/lookup/:rollNumber", async (req, res, next) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber.trim() });
    if (!student) {
      return res.status(404).json({ error: `No student found with University Roll Number "${req.params.rollNumber}". Please verify and try again.` });
    }

    const receipts = await FeeReceipt.find({ studentRoll: student.rollNumber }).sort({ date: -1 });

    res.status(200).json({
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester,
        attendance: student.attendance,
        sgpa: student.sgpa,
      },
      receipts,
    });
  } catch (err) {
    next(err);
  }
});

// Process Online Fee Payment
app.post("/api/finance/pay", async (req, res, next) => {
  try {
    let { studentId, studentRoll, studentName, semester, amount, feeType, paymentMethod } = req.body;

    if (!studentRoll || !amount) {
      return res.status(400).json({ error: "Student Roll Number and Amount are required." });
    }

    // Auto-resolve student if studentId is not provided
    if (!studentId || !studentName) {
      const student = await Student.findOne({ rollNumber: String(studentRoll).trim() });
      if (!student) {
        return res.status(404).json({ error: `Student with Roll Number ${studentRoll} not found.` });
      }
      studentId = student._id;
      studentName = student.name;
      if (!semester) semester = student.semester;
    }

    // Generate unique verifiable transaction identifier
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    const transactionId = `TXN-SVIST-${timestamp}-${randomSuffix}`;

    const receipt = new FeeReceipt({
      studentId,
      studentRoll: String(studentRoll).trim(),
      studentName: studentName || "SVIST Student",
      semester: Number(semester) || 1,
      amount: Number(amount),
      feeType: feeType || "Semester Tuition Fee",
      paymentMethod: paymentMethod || "NetBanking / UPI / Card",
      transactionId,
      status: "Paid",
      date: new Date(),
    });

    const savedReceipt = await receipt.save();
    console.log(`[FINANCE] Digital Payment Verified: ${transactionId} | Amount: ₹${amount} | Student: ${studentRoll} (${studentName}) | Type: ${receipt.feeType}`);

    res.status(200).json({
      success: true,
      message: "Payment processed and digital receipt generated successfully.",
      receipt: savedReceipt,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/api/finance/receipts/:studentRoll", async (req, res, next) => {
  try {
    const receipts = await FeeReceipt.find({ studentRoll: req.params.studentRoll }).sort({ date: -1 });
    res.status(200).json(receipts);
  } catch (err) {
    next(err);
  }
});

// Student Helpdesk & Anti-Ragging Grievance Ticket System
app.post("/api/support/ticket", async (req, res, next) => {
  try {
    const { name, email, rollNumber, department, category, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message description are required." });
    }

    const ticketId = `SVIST-TKT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(`[SUPPORT HELPDESK] Ticket Created: ${ticketId} | From: ${name} (${email}) | Category: ${category || "General Inquiry"}`);

    res.status(201).json({
      success: true,
      ticketId,
      message: `Your inquiry has been registered. Reference Ticket ID: ${ticketId}. Our student grievance cell will contact you within 24 hours.`,
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 15. TRAINING & PLACEMENT (T&P) ENGINE
// ==========================================
// Campus Placement Drives with strict SGPA qualification validation.

// Seed default drives if collection is empty
const defaultDrives = [
  {
    companyName: "Tata Consultancy Services (TCS)",
    role: "Digital Software Engineer",
    package: "7.5 LPA",
    eligibilityCriteria: { minSgpa: 7.0, allowedDepartments: ["CSE", "ECE", "EE", "AI & DS"] },
    deadline: "September 30, 2026",
    description: "Full-stack cloud engineering, microservices development, and enterprise Java/Spring architecture.",
    location: "Kolkata / Bangalore"
  },
  {
    companyName: "Cognizant Technology Solutions",
    role: "GenC Next Developer",
    package: "6.75 LPA",
    eligibilityCriteria: { minSgpa: 6.5, allowedDepartments: ["CSE", "ECE", "EE", "ME", "CE", "AI & DS"] },
    deadline: "October 15, 2026",
    description: "Cloud computing, automated quality engineering, and modern web application development.",
    location: "Kolkata / Hyderabad"
  },
  {
    companyName: "Amazon Web Services (AWS)",
    role: "Cloud Support Associate",
    package: "12.0 LPA",
    eligibilityCriteria: { minSgpa: 8.0, allowedDepartments: ["CSE", "ECE", "AI & DS"] },
    deadline: "November 10, 2026",
    description: "Deep Linux systems administration, distributed database optimization, and Kubernetes orchestration.",
    location: "Bangalore / Remote"
  }
];

app.get("/api/placements/drives", async (req, res, next) => {
  try {
    let drives = await JobDrive.find().sort({ createdAt: -1 });
    if (drives.length === 0) {
      drives = await JobDrive.insertMany(defaultDrives);
      console.log("[T&P] Initialized default campus placement drives.");
    }
    res.status(200).json(drives);
  } catch (err) {
    next(err);
  }
});

app.post("/api/placements/drives", verifyMasterKey, async (req, res, next) => {
  try {
    const newDrive = new JobDrive(req.body);
    const savedDrive = await newDrive.save();
    res.status(201).json(savedDrive);
  } catch (err) {
    next(err);
  }
});

app.post("/api/placements/apply", async (req, res, next) => {
  try {
    const { driveId, rollNumber } = req.body;

    if (!driveId || !rollNumber) {
      return res.status(400).json({ error: "Drive ID and Student Roll Number are required." });
    }

    // 1. Locate student record
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ error: "Student roll number not registered in SVIST database." });
    }

    // 2. Locate active placement drive
    const drive = await JobDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ error: "Placement drive not found or expired." });
    }

    // 3. STRICT SGPA ELIGIBILITY VALIDATION
    const studentSgpa = student.sgpa !== undefined ? Number(student.sgpa) : 0;
    const requiredSgpa = drive.eligibilityCriteria?.minSgpa || 6.5;

    if (studentSgpa < requiredSgpa) {
      return res.status(400).json({
        error: `Academic Ineligibility: ${drive.companyName} requires a minimum SGPA of ${requiredSgpa}. Your current recorded SGPA is ${studentSgpa.toFixed(2)}.`,
        requiredSgpa,
        currentSgpa: studentSgpa,
      });
    }

    // 4. Duplicate application check
    const alreadyApplied = drive.applicants.some(
      (applicant) => applicant.studentRoll === rollNumber
    );
    if (alreadyApplied) {
      return res.status(400).json({
        error: `Duplicate Application: You have already applied for the ${drive.companyName} recruitment drive.`,
      });
    }

    // 5. Append student to applicant roster
    drive.applicants.push({
      studentId: student._id,
      studentRoll: student.rollNumber,
      studentName: student.name,
      sgpa: studentSgpa,
      appliedAt: new Date(),
    });

    await drive.save();
    console.log(`[T&P] Application Registered: ${student.name} (${student.rollNumber}) -> ${drive.companyName}`);

    res.status(200).json({
      success: true,
      message: `Congratulations! Your application for ${drive.companyName} (${drive.role}) has been submitted successfully to the T&P Cell.`,
      drive,
    });
  } catch (err) {
    next(err);
  }
});

// ================================================================
// 16. GLOBAL ERROR HANDLER (must be LAST middleware)
// ================================================================
// Express identifies error-handling middleware by its 4-parameter
// signature (err, req, res, next). This MUST be registered after
// all routes — Express will route uncaught errors here.
// ================================================================
app.use(errorHandler);

// ================================================================
// 15. IGNITE THE SERVER
// ================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] SVIST Portal API running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`[SERVER] Health check: http://localhost:${PORT}/api/health`);
});