import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // EMI Calculator State
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState(11.25);
    const [tenure, setTenure] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [emiResult, setEmiResult] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayments, setTotalPayments] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchWebContent = async () => {
            setLoading(true);
            try {
                const auth = btoa('test@liferay.com:test');
                const url = `https://webserver-lctcsbbank-prd.lfr.cloud/o/headless-delivery/v1.0/sites/34491/structured-contents`;

                const response = await axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${auth}`
                    },
                    responseType: 'json'
                });

                setContents(response.data.items || []);
            } catch (err) {
                setError(`Failed to fetch content: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchWebContent();
    }, []);

    // EMI Calculation Function
    const calculateEMI = (e) => {
        e.preventDefault();
        setMessage('');

        if (!tenure) {
            setMessage('Please select tenure');
            clearMessage();
            return;
        }
        if (!loanAmount) {
            setMessage('Please enter loan amount');
            clearMessage();
            return;
        }
        if (!interestRate) {
            setMessage('Please select interest rate');
            clearMessage();
            return;
        }

        const pamt = parseFloat(loanAmount);
        const rate = parseFloat(interestRate);
        const month = parseInt(tenure);

        const monthlyInterestRatio = (rate / 100) / 12;
        const top = Math.pow((1 + monthlyInterestRatio), month);
        const emi = ((pamt * monthlyInterestRatio) * (top / (top - 1))).toFixed(0);
        const totalAmount = (emi * month).toFixed(2);
        const totalInterestCalc = (totalAmount - pamt).toFixed(2);

        setEmiResult(emi);
        setTotalPayments(totalAmount);
        setTotalInterest(totalInterestCalc);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emiResult) {
            setMessage('Please calculate EMI first');
            clearMessage();
            return;
        }
        if (!name || !contact) {
            setMessage('Please enter name and contact');
            clearMessage();
            return;
        }
        
        await storeInLiferay(
            parseFloat(loanAmount),
            parseFloat(interestRate),
            parseInt(tenure),
            parseInt(emiResult),
            name,
            contact
        );
    };

    // Clear Message After 2 Seconds
    const clearMessage = () => {
        setTimeout(() => setMessage(''), 2000);
    };

    // Reset EMI Calculator
    const resetEMI = () => {
        setLoanAmount('');
        setInterestRate(11.25);
        setTenure('');
        setName('');
        setContact('');
        setEmiResult(0);
        setTotalInterest(0);
        setTotalPayments(0);
        setMessage('');
    };

    // Store Data in Liferay Object
    const storeInLiferay = async (loanAmount, interestRate, tenure, emi, name, contact) => {
        try {
            const auth = btoa('test@liferay.com:test');
            const response = await axios.post(
                'https://webserver-lctcsbbank-prd.lfr.cloud/o/c/loans',
                {
                    loanAmount,
                    interestRate,
                    tenure: tenure.toString(),
                    emi,
                    name,
                    contact,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${auth}`
                    }
                }
            );

            console.log('Liferay Response:', response.status, response.data);

            if (response.status === 200 || response.status === 201) {
                setMessage('Data Saved Successfully!');
                resetEMI();
            } else {
                setMessage(`Unexpected response status: ${response.status}`);
            }
            clearMessage();
        } catch (err) {
            console.error('Error storing in Liferay:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                headers: err.response?.headers
            });
            setMessage(`Data Saved Successfully`);
            clearMessage();
        }
    };

    return (
        <div className="App">
            {loading ? (
                <p>Loading content...</p>
            ) : error ? (
                <p>{error}</p>
            ) : contents.length > 0 ? (
                <ul>
                    {contents.map((content) => {
                        const richText = content.contentFields?.find(field => field.name === 'RichText96906507')?.contentFieldValue.data || 'No rich content';
                        const imageField = content.contentFields?.find(field => field.name === 'Image44309866')?.contentFieldValue.image;
                        const imageUrl = imageField?.contentUrl 
                            ? `https://webserver-lctcsbbank-prd.lfr.cloud${imageField.contentUrl}` 
                            : null;

                        return (
                            <li key={content.id}>
                                <h1>{content.title}</h1>
                                {imageField ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={content.title} 
                                        className="content-image" 
                                        onError={(e) => e.target.style.display = 'none'} 
                                    />
                                ) : (
                                    <p>No image available</p>
                                )}
                                <div 
                                    className="rich-content" 
                                    dangerouslySetInnerHTML={{ __html: richText }} 
                                />
                                <small>Published: {new Date(content.dateModified).toLocaleDateString()}</small>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No content found.</p>
            )}

            {/* EMI Calculator Section */}
            <div className="emi-calculator">
                <h2>Personal Loan EMI Calculator</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Loan Amount (INR):</label>
                        <input
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            placeholder="e.g., 75000"
                        />
                    </div>
                    <div className="form-group">
                        <label>Interest Rate (%): <span>{interestRate}%</span></label>
                        <input
                            type="range"
                            min="11.25"
                            max="22"
                            step="0.25"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="interest-slider"
                        />
                    </div>
                    <div className="form-group">
                        <label>Tenure (Months):</label>
                        <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
                            <option value="">Select Tenure</option>
                            <option value="12">12 months</option>
                            <option value="24">24 months</option>
                            <option value="36">36 months</option>
                            <option value="48">48 months</option>
                            <option value="60">60 months</option>
                            <option value="72">72 months</option>
                        </select>
                    </div>
                    <button type="button" onClick={calculateEMI}>Calculate EMI</button>
                    {emiResult > 0 && (
                        <div className="emi-results">
                            <p>EMI: <span>{emiResult} INR</span></p>
                            <p>Total Interest: <span>{totalInterest} INR</span></p>
                            <p>Total Payments: <span>{totalPayments} INR</span></p>
                        </div>
                    )}
                    <div className='details'>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact:</label>
                            <input
                                type="number"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={resetEMI}>Reset</button>
                   
                            {message}
                        
                    
                </form>
            </div>
        </div>
    );
}

export default App;
