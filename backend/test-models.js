require('dotenv').config();

async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    console.log('Fetching available models...\n');
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.models) {
      console.log('✅ Available Models:\n');
      data.models.forEach(model => {
        console.log(`Model: ${model.name}`);
        console.log(`Display Name: ${model.displayName}`);
        console.log(`Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('---');
      });
    } else {
      console.log('❌ Failed to fetch models');
      console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testModelDirectly(modelName) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

  try {
    console.log(`\n\nTesting ${modelName}...\n`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say hello in one word'
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${modelName} WORKS!`);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('Response:', text);
      return modelName;
    } else {
      console.log(`❌ ${modelName} FAILED - ${data.error?.message}`);
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function main() {
  await listAvailableModels();
  
  // Try some common model names
  const modelsToTry = [
    'models/gemini-pro',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash',
    'models/gemini-2.0-flash-exp'
  ];
  
  console.log('\n\n========== TESTING MODELS ==========\n');
  
  for (const model of modelsToTry) {
    const working = await testModelDirectly(model);
    if (working) {
      console.log(`\n🎉 FOUND WORKING MODEL: ${working}`);
      break;
    }
  }
}

main();