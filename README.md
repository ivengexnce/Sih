# MineGuard Dashboard

MineGuard is a comprehensive web-based dashboard designed for Mine Managers to monitor, analyze, and improve safety and compliance across mining operations. Built with Next.js, React, and Recharts, it provides real-time insights into mine safety metrics.

## 🚀 Features

- **Real-Time Compliance Tracking**: Visual trend analysis of compliance scores over the last 7 days.
- **Risk Summary & Categorization**: Breakdown of high, medium, and low-risk factors using interactive donut charts.
- **Mines Overview & Mapping**: Geographical or structural overview of mine statuses and associated risks.
- **Inspection Management**: Log and monitor recent inspections, area-wise compliance statuses, and dates.
- **Violation Monitoring**: Track top violations (e.g., PPE Non-Compliance, Fire Safety, Housekeeping) to identify recurring safety issues.
- **Action Items Tracking**: Keep track of pending, overdue, and on-track safety actions.
- **Equipment Status**: Monitor the operational status of mining equipment (Operational, Maintenance, Idle, Out of Service).
- **Quick Actions**: Shortcuts to schedule inspections, add violations, assign actions, and view detailed reports.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts/Visualizations**: Recharts
- **Language**: TypeScript

## 📈 Improvements & More Required (Future Scope)

To make MineGuard a fully robust and production-ready system, the following improvements are required:
1. **Backend Integration**: Connect the frontend to a robust backend (Node.js/Express or Python/Django/FastAPI) to fetch real-time sensor and database data.
2. **Authentication & Authorization**: Implement role-based access control (RBAC) for different users (Corporate Admin, Mine Manager, Inspector).
3. **Interactive Maps**: Replace the SVG map placeholder with an interactive mapping library (e.g., Leaflet or Mapbox) for live geographical tracking of mines.
4. **Predictive Analytics (AI/ML)**: Integrate AI models to predict potential safety hazards based on historical violation and inspection data.
5. **Push Notifications**: Implement real-time alerts via WebSockets or Firebase for critical high-risk violations.
6. **Responsive Design Tweaks**: Ensure the dashboard is fully optimized for mobile and tablet views for on-the-go inspectors.

## ⚙️ Getting Started

First, install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 requirement.txt (Backend / ML Dependencies Placeholder)

*(Note: Since this is currently a Next.js frontend project, frontend dependencies are managed via `package.json`. Below is a placeholder `requirements.txt` for the anticipated Python backend for AI/ML integration).*

```text
# Expected Python backend requirements
fastapi==0.103.1
uvicorn==0.23.2
sqlalchemy==2.0.20
pydantic==2.3.0
pandas==2.1.0
scikit-learn==1.3.0
psycopg2-binary==2.9.7
python-dotenv==1.0.0
```
