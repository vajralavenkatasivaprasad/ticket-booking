# Ultimate Deployment Guide 🚀

The new **Advanced UI (Glassmorphism & Gradients)** and **Chatbot** have been successfully added!

Because I am an AI running locally on your computer, I **do not have your passwords** and therefore **cannot log into your GitHub or Cloud hosting accounts**. 

However, since your project is fully complete, you can get it live on the internet with a public URL in 3 minutes by simply copy-pasting the steps below.

---

### Step 1: Initialize Git and Commit Changes
Open your terminal inside the `ticket-booking` folder and run:
```bash
git add .
git commit -m "Add Advanced UI and Glassmorphism design"
```

### Step 2: Push to Your GitHub Account
You must manually create an empty repository on GitHub first.
1. Log into your GitHub account: `vajralavenkatasivaprasad`
2. Create a new repository named **`ticket-booking`**
3. Once created, run these exact commands in your terminal:
```bash
git branch -M main
git remote add origin https://github.com/vajralavenkatasivaprasad/ticket-booking.git
git push -u origin main
```
*(If you already added the origin, just run `git push -u origin main`)*

---

### Step 3: Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** and select your `ticket-booking` repository.
3. Change the **Root Directory** setting to `frontend`.
4. Click **Deploy**.
🎉 *You now have a live public URL for the UI!*

### Step 4: Deploy Backend & Database (Render)
1. Go to [render.com](https://render.com) and log in with GitHub.
2. Click **New +** and select **Web Service**.
3. Select your `ticket-booking` repository.
4. Set the **Root Directory** to `backend`.
5. Set the **Build Command** to: `.\mvnw clean package -DskipTests`
6. Set the **Start Command** to: `java -jar target/ticket-booking-0.0.1-SNAPSHOT.jar`
7. Click **Create Web Service**.
🎉 *Render will automatically build and host your Spring Boot backend and H2 Database!*
