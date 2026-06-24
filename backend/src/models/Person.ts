import { Schema, model } from "mongoose";
// Define the Person schema with fields for id, role, category, name, designation, affiliation, email, bio, joined, domains, skills, education, publications, awards, conferences, links, teaching, experience, projects, professionalService, outreachActivities, avatar, resume, and researchProject. The schema also includes timestamps for createdAt and updatedAt.
const EducationSchema = new Schema({
  degree: { type: String, required: true },
  field: { type: String, required: true },
  institute: { type: String, required: true },
  year: { type: String, required: true },
});

const PublicationSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  venue: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  type: { type: String, required: true },
  domain: { type: String, required: true },
  url: { type: String },
  abstract: { type: String },
});

const AwardSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  org: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
});

const ConferenceSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  place: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  role: { type: String, required: true },
});

const LinkSchema = new Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
});

const ExperienceSchema = new Schema({
  role: { type: String, required: true },
  org: { type: String, required: true },
  duration: { type: String, required: true },
});

const ResearchProjectSchema = new Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  datasets: [{ type: String }],
  results: [{ type: String }],
  images: [{ type: String }],
  videos: [{ type: String }],
  pdfFiles: [{
    name: { type: String, required: true },
    url: { type: String, required: true }
  }]
});

const PersonSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, enum: ["guide", "scholar"], required: true },
    category: { type: String, enum: ["PhD", "PG", "UG", "Alumni", null] },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    affiliation: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, default: "" },
    joined: { type: Number, required: true },
    domains: [{ type: String }],
    skills: [{ type: String }],
    education: [EducationSchema],
    publications: [PublicationSchema],
    awards: [AwardSchema],
    conferences: [ConferenceSchema],
    links: [LinkSchema],
    teaching: [{ type: String }],
    experience: [ExperienceSchema],
    projects: [{ type: String }],
    professionalService: [{ type: String }],
    outreachActivities: [{ type: String }],
    avatar: { type: String },
    resume: { type: String },
    researchProject: ResearchProjectSchema,
  },
  { timestamps: true }
);

export const Person = model("Person", PersonSchema);
