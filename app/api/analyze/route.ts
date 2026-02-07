import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // 1. Capture Screenshot with Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        });
        const page = await browser.newPage();

        // Set viewport to desktop size for better analysis
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

        // Get page title and description for context
        const pageTitle = await page.title();
        const metaDescription = await page.$eval("meta[name='description']", element => element.content).catch(() => "");

        const screenshotBuffer = await page.screenshot({ encoding: "base64", type: "jpeg", quality: 80 });
        await browser.close();

        // 2. Prepare Gemini Prompt
        const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
        let analysisData = null;
        let lastError = null;

        const isEcommerce = url.includes("trendyol") || url.includes("etsy") || url.includes("amazon") || url.includes("hepsiburada");

        let systemPrompt = `
      You are an expert UI/UX Designer and SEO Specialist at Vogo Lab. 
      Analyze the provided website screenshot and metadata.
      
      Target URL: ${url}
      Page Title: ${pageTitle}
      Meta Description: ${metaDescription}
      
      OUTPUT LANGUAGE: TURKISH (TÜRKÇE)
      All content in the "summary", "critical_issues", "improvements", and "positive_points" fields MUST be in Turkish.
      
      Your goal is to provide a critical but constructive analysis focused on:
      1. First Impressions & Design Aesthetics (Modern mi? Güven veriyor mu?)
      2. User Experience (UX) & Navigation
      3. SEO & Content Quality (Görünür metin ve hiyerarşiye dayalı)
      
      Return the response in strict JSON format with the following structure:
      {
        "scores": {
          "design": 0-100,
          "ux": 0-100,
          "seo": 0-100,
          "content": 0-100
        },
        "summary": "Genel denetimin 2 cümlelik Türkçe özeti.",
        "critical_issues": ["Kritik Hata 1", "Kritik Hata 2", ...],
        "improvements": ["Öneri 1", "Öneri 2", ...],
        "positive_points": ["İyi nokta 1", "İyi nokta 2", ...]
      }
    `;

        if (isEcommerce) {
            systemPrompt += `
        ÖZEL E-TİCARET YÖNERGELERİ (TrendScribe metodolojisi):
        - Ürün Başlığını Analiz Et: Açıklayıcı mı? Anahtar kelimeler içeriyor mu?
        - Ana Görseli Analiz Et: Yüksek kaliteli mi? Ürünü net gösteriyor mu?
        - Fiyat Görünürlüğü ve Harekete Geçirici Mesaj (Sepete Ekle butonu) analizi.
        - Güven Sinyallerini Kontrol Et (Yorumlar, rozetler).
      `;
        }

        const imagePart = {
            inlineData: {
                data: screenshotBuffer,
                mimeType: "image/jpeg",
            },
        };

        // 3. Generate Analysis with Fallback
        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying Gemini model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent([systemPrompt, imagePart]);
                const response = await result.response;
                const text = response.text();

                // Clean up markdown code blocks if present
                const cleanJson = text.replace(/```json/g, "").replace(/```/g, "");
                analysisData = JSON.parse(cleanJson);

                if (analysisData) break; // Success!
            } catch (error) {
                console.error(`Model ${modelName} failed:`, error);
                lastError = error;
                // Continue to next model
            }
        }

        if (!analysisData) {
            throw lastError || new Error("All Gemini models failed to respond.");
        }

        return NextResponse.json(analysisData);

    } catch (error) {
        console.error("Analysis failed:", error);
        return NextResponse.json(
            {
                error: "Analiz sırasında bir sorun oluştu.",
                details: error instanceof Error ? error.message : "Bilinmeyen hata. Lütfen daha sonra tekrar deneyin."
            },
            { status: 500 }
        );
    }
}
