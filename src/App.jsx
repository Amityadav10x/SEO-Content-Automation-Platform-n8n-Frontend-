import React, { useState } from 'react';
import Layout from './components/Layout';
import StepCampaignInput from './components/StepCampaignInput';
import StepKeywordSelection from './components/StepKeywordSelection';
import StepArticleOutput from './components/StepArticleOutput';

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  // State to hold data between steps
  const [campaignData, setCampaignData] = useState({
    campaignDescription: '',
    targetAudience: '',
    tone: 'professional'
  });

  const [generatedKeywords, setGeneratedKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [articleData, setArticleData] = useState(null);

  // Transitions
  const handleCampaignSubmit = (data) => {
    // data contains formData + keywords
    const { keywords, ...formData } = data;
    setCampaignData(formData);
    setGeneratedKeywords(keywords);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleGeneration = (data, keywords) => {
    setArticleData(data);
    setSelectedKeywords(keywords || []); // Store selected keywords for regeneration
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleRegenerate = (newArticleData) => {
    setArticleData(newArticleData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCampaign = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToKeywords = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout currentStep={currentStep}>
      {currentStep === 1 && (
        <StepCampaignInput
          onNext={handleCampaignSubmit}
          initialData={campaignData}
        />
      )}

      {currentStep === 2 && (
        <StepKeywordSelection
          campaignData={campaignData}
          keywords={generatedKeywords}
          onBack={handleBackToCampaign}
          onNext={handleArticleGeneration}
        />
      )}

      {currentStep === 3 && (
        <StepArticleOutput
          articleData={articleData}
          campaignData={campaignData}
          keywords={selectedKeywords}
          onBack={handleBackToKeywords}
          onRegenerate={handleArticleRegenerate}
        />
      )}
    </Layout>
  );
}

export default App;
