import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asStr, asInt } from '../utils/typeHelpers';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Bạn là chuyên gia du lịch văn hoá vùng cao Tây Bắc Việt Nam của EthnoDiscovery.
Nhiệm vụ: Tạo lịch trình du lịch cá nhân hoá, tập trung vào:
- Trải nghiệm văn hoá H'Mông, Dao, Tày chân thực
- Homestay địa phương tại bản làng
- Ẩm thực bản địa độc đáo
- Hoạt động ngoài trời phù hợp với thể lực
- Tối ưu chi phí theo budget người dùng

Luôn trả về JSON hợp lệ theo schema sau, KHÔNG thêm text ngoài JSON:
{
  "title": "string",
  "summary": "string",
  "totalDays": number,
  "estimatedCost": { "min": number, "max": number },
  "highlights": ["string"],
  "days": [
    {
      "day": number,
      "title": "string",
      "location": "string",
      "activities": ["string"],
      "meals": { "breakfast": "string", "lunch": "string", "dinner": "string" },
      "accommodation": "string",
      "tips": "string"
    }
  ],
  "recommendedHomestays": ["string"],
  "culturalNotes": "string",
  "packingList": ["string"],
  "bestTimeToVisit": "string"
}`;

// POST /api/ai/generate (streaming SSE)
export const generateTrip = async (req: AuthRequest, res: Response) => {
  const { duration, budget, groupSize, interests, province, startDate } = req.body;

  if (!duration || !budget) {
    throw createError('Thiếu thông tin: duration và budget là bắt buộc', 400);
  }

  const availableTours = await prisma.tour.findMany({
    where: { active: true, ...(province ? { destination: { province } } : {}) },
    take: 10,
    select: {
      title: true, durationDays: true, pricePerPerson: true,
      destination: { select: { nameVi: true, province: true } },
    },
  });

  const toursContext = availableTours.map(t =>
    `- ${t.title} (${t.durationDays} ngày, ${Number(t.pricePerPerson).toLocaleString('vi-VN')}đ/người, tại ${t.destination.nameVi})`
  ).join('\n');

  const userPrompt = `Tạo lịch trình du lịch với thông tin sau:
- Thời gian: ${duration} ngày
- Ngân sách: ${Number(budget).toLocaleString('vi-VN')} VND/người
- Số người: ${groupSize || 2}
- Sở thích: ${interests || 'văn hoá, ẩm thực, thiên nhiên'}
- Tỉnh ưu tiên: ${province || 'Hà Giang, Sapa, Mộc Châu'}
- Ngày khởi hành: ${startDate || 'linh hoạt'}

Các tour hiện có của EthnoDiscovery:
${toursContext || 'Chưa có tour nào được thêm'}`;

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama3-70b-8192',
      stream: true,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    let fullText = '';
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      fullText += text;
      res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
    res.end();
  } catch (error: any) {
    res.write(`data: ${JSON.stringify({ error: error.message || 'Có lỗi xảy ra khi tạo lịch trình' })}\n\n`);
    res.end();
  }
};

// POST /api/ai/save
export const saveTrip = async (req: AuthRequest, res: Response) => {
  const { title, preferences, itinerary } = req.body;

  const trip = await prisma.aiTrip.create({
    data: {
      userId: req.user!.id,
      title: title || 'Lịch trình của tôi',
      preferences,
      itinerary,
      isSaved: true,
    },
  });

  res.status(201).json({ success: true, message: 'Đã lưu lịch trình', data: trip });
};

// GET /api/ai/trips
export const getSavedTrips = async (req: AuthRequest, res: Response) => {
  const trips = await prisma.aiTrip.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: trips });
};

// DELETE /api/ai/trips/:id
export const deleteTrip = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  const trip = await prisma.aiTrip.findFirst({
    where: { id, userId: req.user!.id },
  });
  if (!trip) throw createError('Không tìm thấy lịch trình', 404);
  await prisma.aiTrip.delete({ where: { id: trip.id } });
  res.json({ success: true, message: 'Đã xoá lịch trình' });
};
