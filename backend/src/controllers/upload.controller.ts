import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { cloudinary } from '../middlewares/upload.middleware';
import { asStr } from '../utils/typeHelpers';

// POST /api/upload/single
export const uploadSingle = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file nào được upload' });
  }

  const file = req.file as any;
  res.json({
    success: true,
    message: 'Upload thành công',
    data: {
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
    },
  });
};

// POST /api/upload/multiple
export const uploadMultiple = async (req: Request, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ success: false, message: 'Không có file nào được upload' });
  }

  const files = req.files as any[];
  const uploaded = files.map(file => ({
    url: file.path,
    publicId: file.filename,
    originalName: file.originalname,
  }));

  res.json({
    success: true,
    message: `Upload ${uploaded.length} ảnh thành công`,
    data: uploaded,
  });
};

// DELETE /api/upload/:publicId
export const deleteImage = async (req: AuthRequest, res: Response) => {
  const publicId = decodeURIComponent(asStr(req.params.publicId));
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'Đã xoá ảnh' });
};
