// 1. Import Dependencies (CLEAN CLOUD IMPORTS - NO DNS BYPASS)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 2. Import Blueprints (Models)
const Student = require("./models/Student");
const Admin = require("./models/Admin");
const HOD = require("./models/HOD");       
const Notice = require("./models/Notice"); 
const Faculty = require("./models/Faculty");
const Admission = require("./models/Admission"); 

// 3. Initialize Engine
const app = express();
app.use(cors());
app.use(express.json());

// 4. Connect to Atlas Database (OPTIMIZED FOR CLOUD - NO IPv4 RESTRICTION)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connection secured: SVIST MongoDB Live"))
  .catch((err) => console.error("Database connection failed:", err));

// ==========================================
// 5. SECURITY MIDDLEWARE (The Digital Locks)
// ==========================================
const verifyMasterKey = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied." });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "svist_super_secret_core");
    req.admin = verified;
    next();
  } catch (err) { res.status(400).json({ error: "Invalid Key." }); }
};

const verifyHODKey = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "HOD Access Denied." });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "svist_super_secret_core");
    req.hod = verified;
    next();
  } catch (err) { res.status(400).json({ error: "Invalid HOD Key." }); }
};

// ==========================================
// 6. ADMIN AUTHENTICATION ROUTES
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
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET || "svist_super_secret_core", { expiresIn: "2h" });
    console.log(`[SYSTEM] Admin login successful: ${admin.username}`);
    res.status(200).json({ token: token, message: "Master Key granted." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 7. HOD AUTHENTICATION ROUTES
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
    const token = jwt.sign({ _id: hod._id }, process.env.JWT_SECRET || "svist_super_secret_core", { expiresIn: "2h" });
    console.log(`[SYSTEM] HOD login successful: ${hod.username}`);
    res.status(200).json({ token: token, message: "HOD Key granted." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 8A. STUDENT DATA & LOGIN ROUTES 
// ==========================================
app.post("/api/students/login", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.body.rollNumber });
    if (!student) return res.status(400).json({ error: "Invalid Roll Number." });

    const validPassword = await bcrypt.compare(req.body.password, student.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid Password." });

    const token = jwt.sign({ _id: student._id }, process.env.JWT_SECRET || "svist_super_secret_core", { expiresIn: "2h" });
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
// 8B. FACULTY CRUD ROUTES
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
// 8C. ADMISSIONS DB PIPELINE (NEW INJECTION)
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
// 9. HOD NOTICE BROADCAST ROUTES
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
// 10. Ignite the Server
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ignited. Listening on port ${PORT}`);
});