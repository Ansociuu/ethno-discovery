import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBdf-7zBv-1DMOPHnh1xGp1Qk3SDrZsv74');

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello');
    console.log(result.response.text());
  } catch (error: any) {
    console.error('Error with gemini-1.5-flash:', error.message);
  }
}

run();
