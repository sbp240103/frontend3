import React, { useContext, useEffect, useState } from 'react';
import './c/Cont.css';
import { UserDataContext } from '../context/UserContext';

const Contact = () => {
  const { user } = useContext(UserDataContext);
  const [summary, setSummary] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const savedSummary = localStorage.getItem('summary');
        if (savedSummary) {
          setSummary(savedSummary);
          return;
        }

        const response = await fetch(`https://simple-word-processor.onrender.com/catalog/author/get-summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();
        if (response.ok) {
          setSummary(data.summary);
          localStorage.setItem('summary', data.summary);
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    if (user.email) fetchSummary();
  }, [user.email]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult('Updating...');

    try {
      const response = await fetch('https://simple-word-processor.onrender.com/catalog/author/update-summary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, summary }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult('Summary updated successfully');
        alert('Summary updated successfully in the database');
        localStorage.setItem('summary', summary);
      } else {
        setResult('Failed to update the summary');
      }
    } catch (error) {
      setResult('An error occurred while updating the summary');
    }
  };

  const onConvertToGoogleDoc = async () => {
    try {
      const response = await fetch('https://simple-word-processor.onrender.com/google/create-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary }),
      });
      const data = await response.json();
      if (response.ok) {
        window.open(data.url, '_blank');
      } else {
        alert('Failed to create Google Docs file');
      }
    } catch {
      alert('Error creating Google Docs file');
    }
  };

  const onUploadToDrive = async () => {
    try {
      const response = await fetch('https://simple-word-processor.onrender.com/google/upload-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary }),
      });
      const data = await response.json();
      if (response.ok) {
        window.open(data.url, '_blank');
      } else {
        alert(data.message || 'Failed to upload Google Docs file');
      }
    } catch {
      alert('Error uploading Google Docs file');
    }
  };

  return (
    <div id="contact" className="contact">
      <div className="contact-container">
        <h2 className="form-title">Your Summary</h2>
        <form onSubmit={onSubmit} className="contact-form">
          <label className="form-label">Write your message</label>
          <textarea
            name="message"
            rows="10"
            placeholder="Enter your message..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="form-textarea"
          ></textarea>
          <div className="button-group">
            <button type="submit" className="btn btn-primary">Save as Draft</button>
            <button type="button" className="btn btn-secondary" onClick={onConvertToGoogleDoc}>
              Convert to Google Docs
            </button>
            <button type="button" className="btn btn-tertiary" onClick={onUploadToDrive}>
              Upload to Google Drive
            </button>
          </div>
        </form>
        {result && <p className="status-text">{result}</p>}
      </div>
    </div>
  );
};

export default Contact;
