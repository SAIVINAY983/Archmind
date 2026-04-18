# ArchMind - AI System Design Generator

ArchMind is an AI-powered platform that converts product requirements into comprehensive system designs.

## 🚀 How to Run

To run ArchMind and avoid conflicts with other projects:

1. **Stop all other project terminals**.
2. **Run the startup script**:
   Double-click the `run_archmind.bat` file in the root folder.
   OR run it via terminal:
   ```cmd
   .\run_archmind.bat
   ```
3. **Open the App**:
   Once the terminals are ready, go to:
   **[http://localhost:5566](http://localhost:5566)**

## 🛠️ Troubleshooting

- **Site cannot be reached**: Ensure you ran `run_archmind.bat` and that the terminals are still open.
- **Seeing the wrong project**: The app is now set to port **5566**. Avoid using port 5173 as it may be cached by other projects.
- **Incognito/Private Mode**: Always use a fresh window if you see old project content.

## 📂 Project Structure
- `backend/`: Node.js/Express API with OpenAI integration.
- `frontend/`: React/Vite UI with React Flow diagramming.
