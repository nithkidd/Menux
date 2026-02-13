import { Response } from 'express';
import { uploadService } from './upload.service.js';
import { AuthRequest } from '../../shared/middleware/auth.middleware.js';
import { ApiResponse } from '../../shared/types/index.js';



export class UploadController {
  /**
   * POST /upload/logo - Upload business logo
   */
  /**
   * POST /upload/logo - Upload business logo
   */
  async uploadLogo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file provided',
        } as ApiResponse);
        return;
      }

      // Metadata for the file
      const fileName = uploadService.generateFileName(req.user.id, file.originalname);
      
      // Upload to 'logos' folder in Cloudinary
      const result = await uploadService.uploadFile('logos', file.buffer, fileName);

      res.json({
        success: true,
        data: result,
        message: 'Logo uploaded successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Upload logo error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload logo',
      } as ApiResponse);
    }
  }

  /**
   * POST /upload/image - Upload menu item image
   */
  async uploadImage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file provided',
        } as ApiResponse);
        return;
      }

      // Metadata for the file
      const fileName = uploadService.generateFileName(req.user.id, file.originalname);

      // Upload to 'menu-images' folder in Cloudinary
      const result = await uploadService.uploadFile('menu-images', file.buffer, fileName);

      res.json({
        success: true,
        data: result,
        message: 'Image uploaded successfully',
      } as ApiResponse);
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image',
      } as ApiResponse);
    }
  }
  /**
   * DELETE /upload/:publicId - Delete an uploaded image
   */
  async deleteImage(req: AuthRequest, res: Response): Promise<void> {
      try {
        // Support both named param and regex capture group
        const publicId = (req.params.publicId || req.params[0]) as string;
        
        if (!publicId) {
          res.status(400).json({
            success: false,
            error: 'No public ID provided',
          } as ApiResponse);
          return;
        }
  
        // In a real app, you might want to verify that the user owns this image
        // For now, we rely on the generic 'user'/'admin' role check
  
        const success = await uploadService.deleteFile(publicId);
  
        if (!success) {
           res.status(500).json({
            success: false,
            error: 'Failed to delete image from storage',
          } as ApiResponse);
          return;
        }
  
        res.json({
          success: true,
          message: 'Image deleted successfully',
        } as ApiResponse);
      } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to delete image',
        } as ApiResponse);
      }
    }

  /**
   * POST /upload/url - Upload image from URL
   */
  async uploadImageFromUrl(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { url } = req.body;
      
      if (!url) {
        res.status(400).json({
          success: false,
          error: 'No URL provided',
        } as ApiResponse);
        return;
      }

      // Basic URL validation
      try {
        new URL(url);
      } catch (error) {
        res.status(400).json({
           success: false,
           error: 'Invalid URL format',
        } as ApiResponse);
        return;
      }

      // Metadata
      // For URL uploads, we might not have a filename, so generate one
      const fileName = uploadService.generateFileName(req.user.id, 'url_upload');

      // Upload to 'menu-images' folder
      const result = await uploadService.uploadFileFromUrl('menu-images', url, fileName);

      res.json({
        success: true,
        data: result,
        message: 'Image uploaded successfully from URL',
      } as ApiResponse);

    } catch (error) {
       console.error('Upload from URL error:', error);
       res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image from URL',
      } as ApiResponse);
    }
  }
  }

export const uploadController = new UploadController();
