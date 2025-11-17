import { db } from "../db/db";
import { Image } from "@prisma/client";

class ImageService {
    
    /**
     * Creates a single image record in the database
     * @param {number} eventID - The ID of the event to associate the image with
     * @param {string} url - The URL of the image
     * @returns {Promise<Image>} Created image record
     */
    private async createImage(eventID: number, url: string): Promise<Image> {
        const image = await db.image.create({
            data: { eventID, url }
        });
        return image;
    }

    /**
     * Creates multiple image records in the database
     * @param {number} eventID - The ID of the event to associate the images with
     * @param {string[]} urls - Array of image URLs
     * @returns {Promise<Image[]>} Array of created image records
     */
    private async createMultipleImages(eventID: number, urls: string[]): Promise<Image[]> {
        const images: Image[] = [];

        for (const url of urls) {
            const img = await this.createImage(eventID, url);
            images.push(img);
        }

        return images;
    }

    /**
     * Saves multiple event images and stores their URLs in the database
     * @param {number} eventID - The ID of the event to associate the images with
     * @param {Express.Multer.File[]} files - Array of uploaded image files
     * @returns {Promise<Image[]>} Array of created image records
     */
    async saveEventImages(eventID: number, files: Express.Multer.File[]): Promise<Image[]> {
        const urls = files.map(file => `/uploads/${file.filename}`);
        const images = await this.createMultipleImages(eventID, urls);
        return images;
    }

    /**
     * Retrieves all images associated with a specific event
     * @param {number} eventID - The ID of the event to fetch images for
     * @throws {Error} If no images are found for the event
     * @returns {Promise<Image[]>} Array of image records for the event
     */
    async getImagesByEvent(eventID: number): Promise<Image[]> {
        const images = await db.image.findMany({ 
            where: { 
                eventID 
            } 
        });

        if (!images || images.length === 0) {
            throw new Error("No images found for this event");
        }

        return images;
    }
}

export const imageService = new ImageService();