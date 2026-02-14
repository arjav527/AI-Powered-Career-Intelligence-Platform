# ANTIGRAVITY - Project Viva Notes

## 1. Project Overview
**Q: What is Antigravity?**
A: Antigravity is an AI-powered Career Intelligence Platform. It's a SaaS application that helps job seekers by analyzing their resumes against job descriptions, identifying skill gaps, predicting potential salaries, and providing an ATS (Applicant Tracking System) compatibility score.

**Q: What problem does it solve?**
A: It solves the "black box" problem of job applications. Candidates often apply and never hear back because they don't know if their resume matches the keywords or format required by ATS algorithms. Antigravity gives them visibility and actionable insights.

## 2. Technical Architecture
**Q: Explain the architecture.**
A: The project follows a microservices-inspired architecture:
- **Frontend**: A React SPA (Single Page Application) built with Vite and Tailwind CSS for a responsive, modern UI.
- **Backend API**: A Node.js/Express server that handles user authentication (JWT), data persistence (MongoDB), and API routing.
- **ML Service**: A separate Python service (FastAPI) that performs the heavy lifting for text analysis and predictions.

**Q: Why use a separate ML service?**
A: Node.js is excellent for I/O-bound tasks but single-threaded and not optimized for CPU-intensive tasks like matrix operations in NLP. Python is the industry standard for ML. Separating them allows independent scaling and uses the best tool for each job.

## 3. Key Algorithms
**Q: How does the Match Percentage work?**
A: We use **TF-IDF (Term Frequency-Inverse Document Frequency)** to convert the resume and job description text into numerical vectors. Then, we calculate the **Cosine Similarity** between these vectors. This measures how close the two documents are in "meaning" space, ignoring the length of the documents.

**Q: How is salary predicted?**
A: It uses a **Linear Regression** model (or a heuristic fallback for the demo). The model takes input features like *Years of Experience*, *Number of Skills*, and *Education Level*, and learns the relationship between these features and salary from training data.

**Q: What is the ATS Score?**
A: It's a rule-based scoring system that checks for best practices:
- **Keyword Density**: Are relevant keywords present?
- **Formatting**: Is the text readable? Are standard sections (Experience, Education) present?
- **Length**: Is it too short or too long?

## 4. Challenges & Solutions
**Q: What was the biggest challenge?**
A: Integrating the Python ML service with the Node.js backend.
**Solution**: We used REST API calls for communication. The Node backend acts as a gateway, receiving user requests and proxying the analysis tasks to the Python service.

**Q: How do you handle security?**
A: 
- **Authentication**: JWT (JSON Web Tokens) for stateless auth.
- **Password Storage**: bcrypt for hashing passwords (never stored in plain text).
- **Validation**: Zod schema validation to prevent injection and bad data.
- **Environment Variables**: Sensitive keys (DB URI, JWT Secret) are stored in `.env` files, not hardcoded.

## 5. Future Improvements
- **Real Resume Parsing**: Integrate Tika or a dedicated parser to handle PDF/Docx structure better.
- **Advanced NLP**: Move from TF-IDF to BERT or LLM embeddings for semantic understanding (better understanding of context, not just keywords).
- **Job Scraping**: Auto-fetch job descriptions from LinkedIn/Indeed.
