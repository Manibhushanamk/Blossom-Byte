'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, User, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from '../login/page.module.css'; // Reusing auth styles

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Admin State
  const [adminData, setAdminData] = useState({
    name: '', email: '', password: '', confirm: '', phone: ''
  });

  // DB State
  const [dbData, setDbData] = useState({
    uri: '', dbName: ''
  });
  const [dbTested, setDbTested] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (adminData.password !== adminData.confirm) {
        return setError('Passwords do not match');
      }
      setStep(2);
    }
  };

  const handleTestConnection = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/setup/test-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbData)
      });
      const data = await res.json();
      if (data.success) {
        setDbTested(true);
      } else {
        setError(data.error || 'Connection failed');
      }
    } catch (err) {
      setError('Network error. Could not test connection.');
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      let foundUri = '';
      
      for (const line of lines) {
        if (line.trim().startsWith('#')) continue; // skip comments
        const [key, ...rest] = line.split('=');
        const cleanKey = key?.trim().toUpperCase();
        
        if (cleanKey === 'MONGODB_URI' || cleanKey === 'MONGO_URI' || cleanKey === 'DATABASE_URL') {
          let value = rest.join('=').trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          foundUri = value;
          break;
        }
      }
      
      if (foundUri) {
        setDbData(prev => ({ ...prev, uri: foundUri }));
        setDbTested(false);
      } else {
        setError('Could not find a MONGODB_URI or DATABASE_URL in the uploaded file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleFinalize = async () => {
    if (!dbTested) {
      return setError('Please test the connection first');
    }
    setError('');
    setStep(3); // Initializing step
    
    try {
      const res = await fetch('/api/setup/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUser: adminData, dbConfig: dbData })
      });
      const data = await res.json();
      
      if (data.success) {
        // Setup complete! Redirect to login
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setStep(2);
        setError(data.error || 'Initialization failed');
      }
    } catch (err) {
      setStep(2);
      setError('Network error during initialization.');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container} style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', padding: '40px' }}>
        
        {/* Main Setup Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.authCard}
          style={{ maxWidth: '500px' }}
        >
          <div className={styles.header}>
            <h1 className={styles.title}>System Setup</h1>
            <p className={styles.subtitle}>Configure Blossom Byte for the first time.</p>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            <div style={{ flex: 1, height: '4px', background: step >= 1 ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '4px', background: step >= 3 ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', background: 'rgba(233, 30, 99, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form key="step1" onSubmit={handleNextStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Administrator Account</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>Create the master admin</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Input label="Full Name" value={adminData.name} onChange={e => setAdminData({...adminData, name: e.target.value})} required />
                  <Input label="Email Address" type="email" value={adminData.email} onChange={e => setAdminData({...adminData, email: e.target.value})} required />
                  <Input label="Phone Number" value={adminData.phone} onChange={e => setAdminData({...adminData, phone: e.target.value})} required />
                  <Input label="Password" type="password" value={adminData.password} onChange={e => setAdminData({...adminData, password: e.target.value})} required />
                  <Input label="Confirm Password" type="password" value={adminData.confirm} onChange={e => setAdminData({...adminData, confirm: e.target.value})} required />
                </div>
                
                <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginTop: '32px' }}>
                  Continue to Database Setup
                </Button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>MongoDB Configuration</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>Connect to your database cluster</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                      Auto-fill from .env file
                    </label>
                    <input 
                      type="file" 
                      accept=".env,text/plain" 
                      onChange={handleFileUpload} 
                      style={{ fontSize: '13px', width: '100%' }} 
                    />
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-secondary)', margin: '-4px 0' }}>— OR ENTER MANUALLY —</div>

                  <Input 
                    label="MongoDB Connection URI" 
                    placeholder="mongodb+srv://..."
                    value={dbData.uri} 
                    onChange={e => { setDbData({...dbData, uri: e.target.value}); setDbTested(false); }} 
                  />
                  <Input 
                    label="Database Name (Optional)" 
                    placeholder="blossom-byte"
                    value={dbData.dbName} 
                    onChange={e => { setDbData({...dbData, dbName: e.target.value}); setDbTested(false); }} 
                  />
                  
                  <Button variant="secondary" onClick={handleTestConnection} disabled={loading || !dbData.uri} style={{ marginTop: '8px' }}>
                    {loading ? 'Testing...' : 'Test Connection'}
                  </Button>

                  {dbTested && (
                    <div style={{ color: 'green', fontSize: '14px', textAlign: 'center', padding: '8px', background: 'rgba(0,255,0,0.1)', borderRadius: '8px' }}>
                      <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      Connected Successfully
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                  <Button variant="secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</Button>
                  <Button variant="primary" onClick={handleFinalize} disabled={!dbTested} style={{ flex: 2 }}>
                    Initialize System
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.successState} style={{ textAlign: 'center', padding: '40px 0' }}>
                <Loader2 size={48} className={styles.spinner} style={{ color: 'var(--color-primary)', margin: '0 auto 24px', animation: 'spin 2s linear infinite' }} />
                <h3 style={{ margin: '0 0 8px' }}>Initializing Database</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  Please wait. We are creating collections and seeding default data...
                </p>
                <style jsx>{`
                  @keyframes spin { 100% { transform: rotate(360deg); } }
                `}</style>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* In-App Setup Guide */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.authCard}
          style={{ maxWidth: '400px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '32px' }}
        >
          <div className={styles.header} style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '22px' }}>Setup Guide</h2>
            <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Follow these exact steps to connect your database.</p>
          </div>
          
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6', overflowY: 'auto', maxHeight: '600px', paddingRight: '12px' }}>
            <p style={{ margin: '0 0 16px' }}>Don't know what MongoDB is? No problem! It's a free service that stores your website data. Follow these steps exactly:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <strong style={{ color: 'var(--color-text)', fontSize: '15px' }}>Step 1: Create an Account</strong>
                <ol style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Click this link to open <a href="https://www.mongodb.com/cloud/atlas/register" target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>MongoDB Atlas</a> in a new tab.</li>
                  <li>Sign up for a free account (you can use "Sign up with Google").</li>
                </ol>
              </div>

              <div>
                <strong style={{ color: 'var(--color-text)', fontSize: '15px' }}>Step 2: Build a Cluster</strong>
                <ol style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>When asked what kind of cluster you want, choose <strong>"M0 Free"</strong> (or "Shared Free").</li>
                  <li>Leave all defaults as they are and click <strong>Create Cluster</strong>.</li>
                </ol>
              </div>

              <div>
                <strong style={{ color: 'var(--color-text)', fontSize: '15px' }}>Step 3: Create a Database User</strong>
                <ol style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>On the Quickstart page, it asks you to create a user.</li>
                  <li>Type a simple username (e.g., <code>admin</code>).</li>
                  <li>Type a password (or click "Autogenerate"). <strong style={{ color: 'var(--color-primary)' }}>WRITE THIS PASSWORD DOWN.</strong> You will need it!</li>
                  <li>Click <strong>Create User</strong>.</li>
                </ol>
              </div>

              <div>
                <strong style={{ color: 'var(--color-text)', fontSize: '15px' }}>Step 4: Allow Network Access</strong>
                <ol style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Scroll down to "Where would you like to connect from?".</li>
                  <li>Choose <strong>"My Local Environment"</strong>.</li>
                  <li>Click the <strong>Add Different IP Address</strong> button.</li>
                  <li>In the box that appears, type <code>0.0.0.0/0</code> and click <strong>Add IP Address</strong>. (This allows your website to connect).</li>
                  <li>Click <strong>Finish and Close</strong>.</li>
                </ol>
              </div>

              <div>
                <strong style={{ color: 'var(--color-text)', fontSize: '15px' }}>Step 5: Get Your Connection String</strong>
                <ol style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>You will now be on your Database Dashboard. Click the <strong>Connect</strong> button next to your cluster.</li>
                  <li>Click <strong>Drivers</strong> (or "Connect your application").</li>
                  <li>You will see a link that looks like this:</li>
                </ol>
                <code style={{ display: 'block', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', wordBreak: 'break-all', fontFamily: 'monospace', color: '#e0e0e0', margin: '8px 0' }}>
                  mongodb+srv://admin:&lt;password&gt;@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
                </code>
                <ol style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '6px' }} start="4">
                  <li>Copy that link and paste it into the <strong>MongoDB Connection URI</strong> box on the left.</li>
                  <li><strong>CRITICAL:</strong> Erase the word <code>&lt;password&gt;</code> inside the link you pasted, and replace it with the password you wrote down in Step 3! (Do not include the <code>&lt;</code> <code>&gt;</code> brackets).</li>
                  <li>Click <strong>Test Connection</strong>. You're done!</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
