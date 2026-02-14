export const MOCK_REPORT = {
    _id: "1",
    title: "Software Engineer Resume Review",
    matchScore: 85,
    atsScore: 92,
    predictedSalary: 125000,
    matchedSkills: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    missingSkills: ["Docker", "Kubernetes", "AWS"],
    similarityExplanation: "Strong match in core full-stack technologies. Missing cloud infrastructure experience.",
    createdAt: new Date().toISOString()
};

export const MOCK_USER = {
    name: "Arjav User",
    email: "arjav@example.com",
    role: "user"
};
