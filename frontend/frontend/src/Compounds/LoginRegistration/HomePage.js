import React, { useState } from 'react';
import axios from 'axios';
import './HomePage.css';

const Predict = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [resultImageUrl, setResultImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPrediction('');
    setError('');

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageUrl(imageUrl);
    } else {
      setImageUrl('');
    }
  };

  const handleSubmitDL = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error uploading the file:', error);
      setError('Error uploading the file');
    }
  };

  const handleSubmitLLM = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Set the response type to blob to handle binary data
      });
      const resultImageUrl = URL.createObjectURL(response.data);
      setResultImageUrl(resultImageUrl);
    } catch (error) {
      console.error('Error uploading the file:', error);
      setError('Error uploading the file');
    }
  };

  return (
    <div>
      <h1>Upload an image to classify</h1>

      <form onSubmit={handleSubmitDL}>
        <input className='input' type="file" onChange={handleFileChange} />
        {imageUrl && (
          <div>
            <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
          </div>
        )}
        <button className='button' type="submit">Predict with DL</button>
      </form>

      <form onSubmit={handleSubmitLLM}>
        <button className='button' type="submit">Predict with LLM</button>
      </form>

      {resultImageUrl && (
        <div>
          <h2>Prediction Result:</h2>
          <img src={resultImageUrl} alt="Prediction Result" className="result-image" />
        </div>
      )}

      {prediction && <div>Prediction: {prediction}</div>}
      {error && <div className='error'>{error}</div>}
    </div>
  );
};

export default Predict;
