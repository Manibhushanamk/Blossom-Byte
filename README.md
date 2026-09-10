# Blossom Byte - Premium CMS Platform

Blossom Byte is a fully functional, full-stack CMS e-commerce platform. It features an automated First-Time Setup Wizard that configures your MongoDB database, creates your master administrator account, and automatically seeds your store with 75+ premium products, categories, and settings without requiring you to touch a single line of code!

---

## 🚀 First-Time System Setup Guide

When you run this application for the very first time, it will automatically detect that no database is connected and intercept your request, redirecting you directly to the **Setup Wizard**.

### Step 1: Start the Server
Run the standard Next.js development command:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser. You will be instantly redirected to the Setup Wizard.

### Step 2: Create Administrator Account
In the first screen of the Setup Wizard, you will create the master administrator account. 
- **Full Name**: Enter your name (e.g., `Mani`)
- **Email**: Enter your preferred admin email (e.g., `admin@blossombyte.com`)
- **Phone**: Enter your contact number
- **Password**: Create a strong password

*Note: This account will have full access to the Admin Dashboard.*

### Step 3: Get Your MongoDB Connection URI
To power the backend, you need a MongoDB cluster. You can get one for free in 3 minutes:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a new **Free Shared Cluster** (M0 Sandbox).
3. Under **Database Access**, create a new database user and securely copy the password.
4. Under **Network Access**, click `Add IP Address` and select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
5. Go to **Databases** -> **Connect** -> **Connect your application**.
6. Copy the connection string. It will look like this:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```
   *(Make sure to replace `<password>` with the actual password you just created!)*

### Step 4: Configure the Application
In **Step 2** of the Setup Wizard:
1. Paste your MongoDB Connection String into the **MongoDB Connection URI** field.
2. In the **Database Name** field, type: `blossom-byte` (or leave it blank to use the default).
3. Click the **Test Connection** button. The application will ping your cluster to ensure it can connect securely.
4. Once it says "Connected Successfully", click **Initialize System**.

### Step 5: The Magic Happens (Auto-Seeding)
Once you click initialize, the engine will take over. You don't need to manually create schemas or run scripts. The engine will automatically:
- Connect to your MongoDB.
- Build 4 dynamic Categories.
- Generate **75 Premium Products** with distinct names, prices, and visually unique high-quality images.
- Setup your master Admin user.
- Configure default system settings (GST, Delivery Fees, Store Name).

After a few seconds, you will be redirected to the Login page. Log in with the credentials you created in Step 2!

---

## ⚙️ Post-Setup: Admin Dashboard Management

Once logged in as an Administrator, click on the **Admin Dashboard** link in your profile.

### 1. System Settings
Navigate to the **Settings** tab. From here, you can dynamically edit:
- Website Name
- Currency
- Flat Delivery Fees & Free Delivery Threshold
- GST Rates
- Contact Information
*These changes save instantly to MongoDB and reflect across the entire site.*

### 2. Database Hot-Swapping
If you ever need to change your MongoDB database (e.g., moving from a free dev cluster to a paid production cluster):
1. Navigate to the **Database** tab in the Admin Sidebar.
2. Enter your new MongoDB URI.
3. Check the "Auto-Initialize" box if you want it to fill the new database with 75 products.
4. Click **Switch Database**. 

The server will safely disconnect from the old database, connect to the new one, and re-initialize instantly without ever requiring a server restart!
